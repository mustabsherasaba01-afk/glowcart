const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, items } = req.body;

    if (!shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order details are incomplete.' });
    }

    let subtotal = 0;
    const validItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId || item.product}` });
      }

      const unitPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
      const quantity = Number(item.quantity || 1);
      subtotal += unitPrice * quantity;

      validItems.push({
        product: product._id,
        name: product.name,
        quantity,
        price: unitPrice,
        image: product.images[0] || '',
      });
    }

    const shippingFee = subtotal > 3000 ? 0 : 150;
    const totalAmount = subtotal + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items: validItems,
      shippingAddress,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: { order } });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const query = req.user.role === 'ADMIN' ? {} : { user: req.user._id };
    const orders = await Order.find(query).sort({ createdAt: -1 }).populate('user', 'name email');
    res.status(200).json({ success: true, message: 'Orders fetched', data: { orders } });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (req.user.role !== 'ADMIN' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized order access' });
    }

    res.status(200).json({ success: true, message: 'Order fetched', data: { order } });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (req.user.role !== 'ADMIN' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.status(200).json({ success: true, message: 'Order cancelled', data: { order } });
  } catch (error) {
    next(error);
  }
};

const getOrderTracking = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    res.status(200).json({
      success: true,
      message: 'Tracking information fetched',
      data: { status: order.orderStatus, steps: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'] },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById, cancelOrder, getOrderTracking };
