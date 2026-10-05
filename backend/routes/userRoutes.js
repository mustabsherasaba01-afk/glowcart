const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getProfile, updateProfile, changePassword, getUserOrders, getQuizHistory } = require('../controllers/userController');

const router = express.Router();
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/orders', getUserOrders);
router.get('/quiz-history', getQuizHistory);

module.exports = router;
