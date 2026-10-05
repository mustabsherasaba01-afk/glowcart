const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getQuizQuestions, submitQuiz, getQuizHistory, getQuizResultById } = require('../controllers/quizController');

const router = express.Router();

router.get('/questions', getQuizQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/history', protect, getQuizHistory);
router.get('/history/:id', protect, getQuizResultById);

module.exports = router;
