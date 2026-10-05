const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true }).populate('user', 'name avatar');
    res.status(200).json({ success: true, message: 'Reviews fetched', data: { reviews } });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const order = await Order.findOne({ user: req.user._id, 'items.product': req.params.productId });
    if (!order) {
      return res.status(403).json({ success: false, message: 'Only customers who purchased this product can review it.' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: req.params.productId,
      order: order._id,
      rating,
      title,
      comment,
      isApproved: true,
    });

    const reviews = await Review.find({ product: req.params.productId, isApproved: true });
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    product.rating = reviews.length ? total / reviews.length : 0;
    product.reviewCount = reviews.length;
    await product.save();

    res.status(201).json({ success: true, message: 'Review submitted', data: { review } });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized review update' });
    }

    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: 'Review updated', data: { review: updated } });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized review deletion' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProductReviews, createReview, updateReview, deleteReview };
