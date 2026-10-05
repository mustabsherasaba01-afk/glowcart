const express = require('express');
const protect = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { getProductReviews, createReview } = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', protect, createReview);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
