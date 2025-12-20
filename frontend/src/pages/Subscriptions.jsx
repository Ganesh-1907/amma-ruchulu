import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaPause, FaPlay, FaTimes, FaEdit, FaHistory } from 'react-icons/fa';
import axios from 'axios';
import { products, user } from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  expired: 'bg-gray-100 text-gray-500'
};

const MySubscriptions = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({ type: null, id: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/subscriptions`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      setSubs(res.data);
    } catch (err) {
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async (id) => {
    if (!window.confirm('Pause this subscription?')) return;
    setActionLoading({ type: 'pause', id });
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/subscriptions/${id}/pause`, {}, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      fetchSubs();
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };
  const handleResume = async (id) => {
    if (!window.confirm('Resume this subscription?')) return;
    setActionLoading({ type: 'resume', id });
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/subscriptions/${id}/resume`, {}, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      fetchSubs();
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };
  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this subscription? This cannot be undone.')) return;
    setActionLoading({ type: 'cancel', id });
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/subscriptions/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      fetchSubs();
    } finally {
      setActionLoading({ type: null, id: null });
    }
  };

  if (loading) return <div className="mb-8"><span>Loading subscriptions...</span></div>;
  if (error) return <div className="mb-8 text-red-600">{error}</div>;
  if (!subs.length) return <div className="mb-8 text-gray-500">You have no active subscriptions.</div>;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-green-700 mb-6">My Subscriptions</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {subs.map(sub => (
          <div key={sub._id} className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{sub.planName || 'Subscription'}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[sub.status]}`}>{sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</span>
              </div>
              <button className="text-gray-500 hover:text-primary-600" title="Edit Subscription" disabled><FaEdit /></button>
            </div>
            <div className="mb-2 text-sm text-gray-700">
              <div>Product: <b>{sub.products?.map(p => p.product?.name).join(', ')}</b></div>
              <div>Quantity: <b>{sub.products?.map(p => p.quantity).join(', ')}</b></div>
              <div>Frequency: <b>{sub.frequency}</b></div>
              <div>Start: <b>{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '-'}</b></div>
              <div>Next Billing: <b>{sub.nextBilling ? new Date(sub.nextBilling).toLocaleDateString() : 'N/A'}</b></div>
              <div>Price: <b>₹{sub.totalAmount}</b> per cycle</div>
              <div>Remaining Days: <b>{sub.remainingDays}</b> days</div>
              
              {sub.status === 'active' && (
                <>
                  {sub.deliveryVerified ? (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-800">✓ Today's delivery completed</div>
                      <div className="text-xs text-green-700 mt-1">Next delivery OTP will be generated at 5 AM</div>
                    </div>
                  ) : sub.otp ? (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="font-semibold text-yellow-800">Today's Delivery OTP:</div>
                      <div className="text-2xl font-bold text-yellow-900 mt-1">{sub.otp}</div>
                      <div className="text-xs text-yellow-700 mt-1">Show this OTP to the delivery person</div>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-gray-800">Waiting for OTP generation</div>
                      <div className="text-xs text-gray-700 mt-1">OTP will be generated at 5 AM</div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              {sub.status === 'active' && (
                <button onClick={() => handlePause(sub._id)} disabled={actionLoading.type==='pause'&&actionLoading.id===sub._id} className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded flex items-center gap-1"><FaPause /> Pause</button>
              )}
              {sub.status === 'paused' && (
                <button onClick={() => handleResume(sub._id)} disabled={actionLoading.type==='resume'&&actionLoading.id===sub._id} className="px-4 py-2 bg-green-100 text-green-700 rounded flex items-center gap-1"><FaPlay /> Resume</button>
              )}
              {sub.status !== 'cancelled' && (
                <button onClick={() => handleCancel(sub._id)} disabled={actionLoading.type==='cancel'&&actionLoading.id===sub._id} className="px-4 py-2 bg-red-100 text-red-700 rounded flex items-center gap-1"><FaTimes /> Cancel</button>
              )}
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded flex items-center gap-1" disabled><FaHistory /> History</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Subscriptions = () => {
  const [selectedDuration, setSelectedDuration] = useState('monthly');
  const [milkProductId, setMilkProductId] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      name: 'Basic',
      description: 'Perfect for small households',
      monthlyPrice: 499,
      yearlyPrice: 5499,
      features: [
        'Daily fresh pickles delivery',
        'Standard delivery timing (6 AM)',
        'Email support',
        'Cancel anytime'
      ],
      color: 'primary'
    },
    {
      name: 'Premium',
      description: 'Most popular for families',
      monthlyPrice: 999,
      yearlyPrice: 10999,
      features: [
        'Daily fresh pickles delivery',
        'Priority delivery timing (5 AM)',
        'WhatsApp support',
        'Flexible delivery schedule',
        'Special occasion offers',
        'Cancel anytime'
      ],
      color: 'primary',
      popular: true
    },
    {
      name: 'Business',
      description: 'Ideal for cafes & restaurants',
      monthlyPrice: 2499,
      yearlyPrice: 27499,
      features: [
        'pickles delivery',
        'Priority delivery timing (4 AM)',
        'Dedicated support',
        'Flexible delivery schedule',
        'Special occasion offers',
        'Bulk order discounts',
        'Cancel anytime'
      ],
      color: 'primary'
    }
  ];

  const features = [
    {
      title: 'Fresh Pickles Delivery',
      description: 'Get fresh pickles delivered to your doorstep every morning',
      icon:'🥭',
    },
    {
      title: 'Flexible Schedule',
      description: 'Choose your preferred delivery time and frequency',
      icon: '📅'
    },
    {
      title: 'Quality Guarantee',
      description: 'We ensure the highest quality standards for our pickles',
      icon: '✨'
    },
    {
      title: 'Easy Management',
      description: 'Manage your subscription easily through our mobile app',
      icon: '📱'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all products and find milk
        const prodRes = await products.getAll();
        const milk = prodRes.data.find(p => p.category === 'milk');
        setMilkProductId(milk?.id || milk?._id);
        // Fetch user profile and get address
        const userRes = await user.getProfile();
        const addr = userRes.data.address || userRes.data.addresses?.[0];
        setUserAddress(addr);
      } catch (err) {
        setMilkProductId(null);
        setUserAddress(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = (plan) => {
    if (!milkProductId) {
      alert('Milk product not found. Please contact support.');
      return;
    }
    const subscriptionData = {
      planName: plan.name,
      duration: selectedDuration,
      price: selectedDuration === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice,
      products: [
        {
          product: milkProductId,
          quantity: 1,
          price: selectedDuration === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
        }
      ],
      frequency: 'daily',
      deliveryDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      deliveryTime: '06:00'
    };
    navigate('/address', { state: { subscriptionData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b bg-yellow-100 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* My Subscriptions Section */}
          <MySubscriptions />
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Subscribe & Save</h1>
            <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect subscription plan for your daily dairy needs
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl shadow-sm p-2 inline-flex">
              <button
                onClick={() => setSelectedDuration('monthly')}
                className={`${
                  selectedDuration === 'monthly'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                } px-6 py-2 rounded-lg transition-colors text-sm font-medium`}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedDuration('yearly')}
                className={`${
                  selectedDuration === 'yearly'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                } px-6 py-2 rounded-lg transition-colors text-sm font-medium`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                  plan.popular ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="p-8">
                  {plan.popular && (
                    <span className="inline-flex float-right px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-primary-100 text-primary-600">
                      Most Popular
                    </span>
                  )}
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{plan.name}</h2>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{selectedDuration === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-600">
                      /{selectedDuration === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSubscribe(plan)}
                    className="w-full py-3 px-6 rounded-lg bg-red-600 text-white font-medium hover:bg-primary-700 transition-colors"
                  >
                    Subscribe Now
                  </button>
                </div>
                <div className="border-t border-gray-100 p-8">
                  <h3 className="text-sm font-medium text-gray-900 uppercase mb-4">
                    What's included
                  </h3>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm">
                        <svg className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Frequently asked questions
                </h2>
                <p className="text-gray-600">
                  Can't find the answer you're looking for? Contact our support team.
                </p>
              </div>
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    How does the delivery work?
                  </h3>
                  <p className="text-gray-600">
                    We deliver fresh dairy products to your doorstep early morning between 5 AM to 7 AM. You can also choose a different time slot as per your convenience.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Can I modify my subscription?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can modify your subscription plan, delivery schedule, or quantity at any time through our mobile app or website.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    What if I want to cancel?
                  </h3>
                  <p className="text-gray-600">
                    You can cancel your subscription at any time without any cancellation fees. The subscription will remain active until the end of your current billing period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions; 