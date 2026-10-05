const Order = require('../models/Order');

const getOrderStatusFlow = () => ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) return null;
  order.orderStatus = status;
  await order.save();
  return order;
};

module.exports = { getOrderStatusFlow, updateOrderStatus };
