const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getProductReviews, createReview, updateReview, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
