const express = require('express');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const { getDashboard, getAnalytics, getUsers, getOrders, getProductsAdmin, getReviews, updateOrderStatus } = require('../controllers/adminController');

const router = express.Router();
router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.get('/products', getProductsAdmin);
router.get('/reviews', getReviews);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
