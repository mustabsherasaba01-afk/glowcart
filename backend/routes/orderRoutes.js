const express = require('express');
const protect = require('../middleware/authMiddleware');
const { createOrder, getOrders, getOrderById, cancelOrder, getOrderTracking } = require('../controllers/orderController');

const router = express.Router();
router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.get('/:id/track', getOrderTracking);

module.exports = router;
