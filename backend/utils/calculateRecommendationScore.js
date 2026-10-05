const calculateRecommendationScore = (product, quiz) => {
  let score = 0;

  if (!product || !quiz) return 0;

  if (quiz.skinType && product.skinTypes && product.skinTypes.includes(quiz.skinType)) {
    score += 30;
  }

  if (quiz.primaryConcern && product.concerns && product.concerns.includes(quiz.primaryConcern)) {
    score += 30;
  }

  if (quiz.secondaryConcern && quiz.secondaryConcern !== 'None' && product.concerns && product.concerns.includes(quiz.secondaryConcern)) {
    score += 15;
  }

  if (quiz.sensitivity && product.sensitivityLevels && product.sensitivityLevels.includes(quiz.sensitivity)) {
    score += 10;
  }

  if (quiz.preferredProducts && Array.isArray(quiz.preferredProducts) && quiz.preferredProducts.length > 0) {
    const productTypeMatch = quiz.preferredProducts.some((type) => {
      return product.productType === type || product.category === type;
    });

    if (productTypeMatch) score += 5;
  }

  if (quiz.budget) {
    const budgetValue = Number(String(quiz.budget).replace(/[^0-9]/g, '')) || 0;
    if (product.price <= budgetValue) score += 10;
  }

  return Math.min(score, 100);
};

module.exports = calculateRecommendationScore;
