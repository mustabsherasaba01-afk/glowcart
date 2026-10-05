const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skinType: { type: String, required: true },
    primaryConcern: { type: String, required: true },
    secondaryConcern: { type: String, default: '' },
    sensitivity: { type: String, required: true },
    budget: { type: String, required: true },
    preferredProducts: [{ type: String }],
    recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    resultSummary: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizResult', quizResultSchema);
