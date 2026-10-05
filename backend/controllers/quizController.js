const QuizResult = require('../models/QuizResult');
const Product = require('../models/Product');
const calculateRecommendationScore = require('../utils/calculateRecommendationScore');

const quizQuestions = [
  { id: 'skinType', question: "What's your skin type?", type: 'single', options: ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'] },
  { id: 'primaryConcern', question: 'What is your main skin concern?', type: 'single', options: ['Acne', 'Dryness', 'Dark Spots', 'Dullness', 'Fine Lines', 'Redness', 'Uneven Texture', 'Excess Oil'] },
  { id: 'secondaryConcern', question: 'Any other concern?', type: 'single', options: ['None', 'Acne', 'Dryness', 'Dark Spots', 'Dullness', 'Fine Lines', 'Redness', 'Uneven Texture'] },
  { id: 'sensitivity', question: 'How sensitive is your skin?', type: 'single', options: ['Not Sensitive', 'Slightly Sensitive', 'Very Sensitive'] },
  { id: 'budget', question: "What's your skincare budget?", type: 'single', options: ['Under Rs. 1,500', 'Rs. 1,500 – Rs. 3,000', 'Rs. 3,000 – Rs. 5,000', 'Rs. 5,000 – Rs. 10,000', 'Above Rs. 10,000'] },
  { id: 'preferredProducts', question: 'What type of products are you looking for?', type: 'multi', options: ['Cleanser', 'Moisturizer', 'Serum', 'Sunscreen', 'Toner', 'Mask', 'Complete Routine'] },
];

const getQuizQuestions = async (req, res) => {
  res.status(200).json({ success: true, message: 'Quiz questions fetched', data: { questions: quizQuestions } });
};

const submitQuiz = async (req, res, next) => {
  try {
    const { skinType, primaryConcern, secondaryConcern, sensitivity, budget, preferredProducts } = req.body;

    const products = await Product.find({ isActive: true });
    const recommended = products
      .map((product) => {
        const score = calculateRecommendationScore(product, {
          skinType,
          primaryConcern,
          secondaryConcern,
          sensitivity,
          budget,
          preferredProducts,
        });
        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.product._id);

    const result = await QuizResult.create({
      user: req.user?._id || null,
      skinType,
      primaryConcern,
      secondaryConcern,
      sensitivity,
      budget,
      preferredProducts: preferredProducts || [],
      recommendations: recommended,
      resultSummary: `Skin type: ${skinType} | Concern: ${primaryConcern}`,
    });

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        result,
        recommendations: recommended,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getQuizHistory = async (req, res, next) => {
  try {
    const history = await QuizResult.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('recommendations');
    res.status(200).json({ success: true, message: 'Quiz history fetched', data: { history } });
  } catch (error) {
    next(error);
  }
};

const getQuizResultById = async (req, res, next) => {
  try {
    const result = await QuizResult.findById(req.params.id).populate('recommendations');
    if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
    res.status(200).json({ success: true, message: 'Quiz result fetched', data: { result } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getQuizQuestions, submitQuiz, getQuizHistory, getQuizResultById };
