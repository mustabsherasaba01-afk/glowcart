const Product = require('../models/Product');
const calculateRecommendationScore = require('../utils/calculateRecommendationScore');

const getRecommendations = async (req, res, next) => {
  try {
    const quiz = req.body;
    const products = await Product.find({ isActive: true });

    const ranked = products
      .map((product) => ({
        product,
        score: calculateRecommendationScore(product, quiz),
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    res.status(200).json({
      success: true,
      message: 'Recommendations generated successfully',
      data: {
        recommendations: ranked.map((entry) => ({
          ...entry.product.toObject(),
          match: `${entry.score}% Match for You`,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMyRecommendations = async (req, res, next) => {
  try {
    const latestQuiz = await Product.find({ isActive: true }).limit(3);
    res.status(200).json({ success: true, message: 'Suggested products fetched successfully', data: { recommendations: latestQuiz } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendations, getMyRecommendations };
