const calculateRecommendationScore = require('../utils/calculateRecommendationScore');

const getRecommendationSummary = (product, quiz) => {
  const score = calculateRecommendationScore(product, quiz);
  return { ...product, score, matchLabel: `${score}% Match for You` };
};

module.exports = { getRecommendationSummary };
