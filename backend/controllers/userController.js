const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Order = require('../models/Order');
const QuizResult = require('../models/QuizResult');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, message: 'Profile fetched', data: { user } });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates },
      { new: true }
    ).select('-password');

    res.status(200).json({ success: true, message: 'Profile updated', data: { user } });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Orders fetched', data: { orders } });
  } catch (error) {
    next(error);
  }
};

const getQuizHistory = async (req, res, next) => {
  try {
    const history = await QuizResult.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('recommendations');
    res.status(200).json({ success: true, message: 'Quiz history fetched', data: { history } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword, getUserOrders, getQuizHistory };
