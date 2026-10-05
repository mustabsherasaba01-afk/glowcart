const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getRecommendations, getMyRecommendations } = require('../controllers/recommendationController');

const router = express.Router();

router.post('/', protect, getRecommendations);
router.get('/my', protect, getMyRecommendations);

module.exports = router;
