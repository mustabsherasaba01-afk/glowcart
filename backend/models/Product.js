const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    skinTypes: [{ type: String }],
    concerns: [{ type: String }],
    sensitivityLevels: [{ type: String }],
    ingredients: [{ type: String }],
    benefits: [{ type: String }],
    howToUse: { type: String, default: '' },
    productType: { type: String, default: 'Routine' },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
