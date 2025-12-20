const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTP, generateResetToken, sendResetPasswordEmail } = require('../utils/otp');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, addresses } = req.body; 
    // expecting addresses as an array from frontend

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      addresses // Add addresses array directly here
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses // return addresses as well
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, loginType } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 🔐 Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // 🚫 ROLE CHECK (THIS IS THE KEY)
    if (loginType === 'admin' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    if (loginType === 'user' && user.role !== 'user') {
      return res.status(403).json({ error: 'Access denied.' });
    }

    // 🔑 JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




// Logout user
exports.logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:', req.body);
    
    const { email } = req.body;
    
    if (!email) {
      console.log('Email is missing in request');
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email configuration exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email configuration missing:', {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPassword: !!process.env.EMAIL_PASSWORD
      });
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Check if frontend URL is configured
    if (!process.env.FRONTEND_URL) {
      console.error('Frontend URL not configured');
      return res.status(500).json({ error: 'Frontend URL not configured' });
    }

    console.log('Looking up user with email:', email);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Generating reset token for user:', user._id);
    // Generate reset token
    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    console.log('Saving user with reset token');
    await user.save();

    try {
      console.log('Attempting to send reset email to:', email);
      // Send reset password email
      await sendResetPasswordEmail(email, 'reset_request', resetToken);
      console.log('Reset email sent successfully');
      res.json({ 
        message: 'Password reset link sent to your email',
        token: resetToken // Send token in response for testing
      });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      
      // If email fails, remove the reset token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      
      return res.status(500).json({ 
        error: 'Failed to send reset email. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? emailError.message : undefined
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    console.log('Reset password request received:', req.body);
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset link' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Send confirmation email
    try {
      await sendResetPasswordEmail(user.email, 'password_reset_confirmation');
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if confirmation email fails
    }

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      error: 'An error occurred while resetting your password',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 