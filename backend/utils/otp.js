const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // Only use this in development
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        console.log('SMTP server is ready to send emails');
    }
});

// Generate reset token
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Send reset password email
const sendResetPasswordEmail = async (email, type, resetToken = null) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            throw new Error('Email configuration is missing');
        }

        let subject, html;
        
        if (type === 'reset_request') {
            if (!process.env.FRONTEND_URL) {
                throw new Error('Frontend URL is not configured');
            }
            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            subject = 'Reset Your Password';
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                            Reset Password
                        </a>
                    </div>

                    <p style="color: #666; font-size: 14px;">This link will expire in 10 minutes.</p>
                    <p style="color: #666; font-size: 14px;">If you did not request this password reset, please ignore this email.</p>
                    <p style="color: #666; font-size: 14px;">If the button above doesn't work, copy and paste this link into your browser:</p>
                    <p style="color: #666; font-size: 14px; word-break: break-all;">${resetLink}</p>
                </div>
            `;
        } else if (type === 'password_reset_confirmation') {
            subject = 'Password Reset Successful';
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">Password Reset Successful</h2>
                    <p>Your password has been successfully reset. If you did not make this change, please contact our support team immediately.</p>
                    
                    <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 4px;">
                        <p style="color: #666; font-size: 14px; margin: 0;">For security reasons, please keep your password confidential and do not share it with anyone.</p>
                    </div>

                    <p style="color: #666; font-size: 14px;">If you need any assistance, please don't hesitate to contact our support team.</p>
                </div>
            `;
        }
        
        const mailOptions = {
            from: `"Password Reset" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

module.exports = {
    generateResetToken,
    sendResetPasswordEmail
}; 