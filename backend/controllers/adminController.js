const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

const getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, pendingOrders, lowStockProducts, totalSales] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'Pending' }),
      Product.countDocuments({ stock: { $lt: 10 } }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ]);

    const salesData = totalSales[0]?.total || 0;
    res.status(200).json({
      success: true,
      message: 'Dashboard data fetched',
      data: {
        metrics: {
          totalSales: salesData,
          totalOrders: totalOrders,
          totalUsers: totalUsers,
          totalProducts: totalProducts,
          lowStockProducts: lowStockProducts,
          pendingOrders: pendingOrders,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ soldCount: -1 }).limit(5);
    const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
    const users = await User.countDocuments();
    res.status(200).json({
      success: true,
      message: 'Analytics fetched',
      data: {
        topProducts: products,
        recentOrders: orders,
        userCount: users,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Users fetched', data: { users } });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.status(200).json({ success: true, message: 'Admin orders fetched', data: { orders } });
  } catch (error) {
    next(error);
  }
};

const getProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Admin products fetched', data: { products } });
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate('user', 'name').populate('product', 'name');
    res.status(200).json({ success: true, message: 'Reviews fetched', data: { reviews } });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.orderStatus = req.body.status || order.orderStatus;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    await order.save();

    res.status(200).json({ success: true, message: 'Order status updated', data: { order } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, getAnalytics, getUsers, getOrders, getProductsAdmin, getReviews, updateOrderStatus };
