const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const seedAdmin = require('./seedAdmin');

const categories = [
  { name: 'Cleansers', description: 'Gentle daily cleansing essentials.', slug: 'cleansers' },
  { name: 'Moisturizers', description: 'Hydration and barrier support.', slug: 'moisturizers' },
  { name: 'Serums', description: 'Targeted treatment for glow goals.', slug: 'serums' },
  { name: 'Sunscreen', description: 'Daily UV protection.', slug: 'sunscreen' },
  { name: 'Masks', description: 'Weekly treatment masks.', slug: 'masks' },
  { name: 'Toners', description: 'Balance and prep your skin.', slug: 'toners' },
  { name: 'Eye Care', description: 'Gentle care for the eye area.', slug: 'eye-care' },
  { name: 'Lip Care', description: 'Hydrating lip essentials.', slug: 'lip-care' },
  { name: 'Body Care', description: 'Glow-from-head-to-toe care.', slug: 'body-care' },
  { name: 'Makeup', description: 'Clean, easy beauty finishing touch.', slug: 'makeup' },
];

const products = [
  {
    name: 'Gentle Hydrating Cleanser', brand: 'GlowLab', category: 'Cleansers', price: 1800, discountPrice: 1499, stock: 30,
    description: 'A creamy cleanser that refreshes and hydrates without stripping the skin barrier.', shortDescription: 'Hydrating daily cleanser',
    skinTypes: ['Dry', 'Sensitive', 'Normal'], concerns: ['Dryness', 'Redness'], sensitivityLevels: ['Slightly Sensitive', 'Very Sensitive'],
    ingredients: ['Hyaluronic Acid', 'Ceramides', 'Oat Extract'], benefits: ['hydrates', 'gentle cleansing', 'supports barrier'], howToUse: 'Massage onto damp skin and rinse thoroughly.', productType: 'Cleanser', tags: ['hydrating', 'gentle', 'daily use'], rating: 4.8, reviewCount: 112, featured: true, bestseller: true, newArrival: false, isActive: true,
  },
  {
    name: 'Oil Control Gel Cleanser', brand: 'GlowLab', category: 'Cleansers', price: 2200, discountPrice: 1899, stock: 25,
    description: 'A lightweight gel cleanser formulated to reduce excess oil and leave skin refreshed.', shortDescription: 'Oil-control cleanser',
    skinTypes: ['Oily', 'Combination'], concerns: ['Excess Oil', 'Acne'], sensitivityLevels: ['Not Sensitive', 'Slightly Sensitive'],
    ingredients: ['Salicylic Acid', 'Tea Tree', 'Niacinamide'], benefits: ['controls oil', 'refines pores', 'preps skin'], howToUse: 'Use twice daily', productType: 'Cleanser', tags: ['oily skin', 'acne'], rating: 4.7, reviewCount: 88, featured: true, bestseller: false, newArrival: true, isActive: true,
  },
  {
    name: 'Hydrating Moisturizer', brand: 'Rose & Dew', category: 'Moisturizers', price: 2600, discountPrice: 2199, stock: 36,
    description: 'A soothing moisturizer with humectants and ceramides for supple, dewy skin.', shortDescription: 'Comforting daily moisturizer',
    skinTypes: ['Dry', 'Normal', 'Sensitive'], concerns: ['Dryness', 'Redness'], sensitivityLevels: ['Slightly Sensitive', 'Very Sensitive'],
    ingredients: ['Glycerin', 'Ceramides', 'Panthenol'], benefits: ['deep hydration', 'comforting', 'barrier repair'], howToUse: 'Apply to damp skin after cleansing.', productType: 'Moisturizer', tags: ['hydration', 'cream'], rating: 4.9, reviewCount: 140, featured: true, bestseller: true, newArrival: false, isActive: true,
  },
  {
    name: 'Barrier Repair Cream', brand: 'Luma Care', category: 'Moisturizers', price: 3200, discountPrice: 2899, stock: 18,
    description: 'Rich barrier support cream designed to reduce moisture loss and soothe discomfort.', shortDescription: 'Barrier support face cream',
    skinTypes: ['Dry', 'Sensitive'], concerns: ['Dryness', 'Redness', 'Uneven Texture'], sensitivityLevels: ['Very Sensitive'],
    ingredients: ['Shea Butter', 'Squalane', 'Centella'], benefits: ['soothe', 'repair', 'hydrating'], howToUse: 'Apply a pea-sized amount evening and morning.', productType: 'Moisturizer', tags: ['repair', 'sensitive'], rating: 4.6, reviewCount: 63, featured: false, bestseller: false, newArrival: true, isActive: true,
  },
  {
    name: 'Vitamin C Serum', brand: 'Luma Care', category: 'Serums', price: 3500, discountPrice: 3099, stock: 24,
    description: 'Brightening vitamin C serum that supports an even-looking complexion.', shortDescription: 'Glow-boosting brightening serum',
    skinTypes: ['Normal', 'Combination', 'Sensitive'], concerns: ['Dark Spots', 'Dullness'], sensitivityLevels: ['Not Sensitive', 'Slightly Sensitive'],
    ingredients: ['Vitamin C', 'Ferulic Acid', 'Niacinamide'], benefits: ['brightness', 'tone evenness', 'glow'], howToUse: 'Use 2–3 drops after cleansing and before moisturizer.', productType: 'Serum', tags: ['brightening', 'vitamin c'], rating: 4.8, reviewCount: 120, featured: true, bestseller: true, newArrival: true, isActive: true,
  },
  {
    name: 'Niacinamide Serum', brand: 'GlowLab', category: 'Serums', price: 2900, discountPrice: 2499, stock: 28,
    description: 'A balancing serum for refining pores and supporting a smoother-looking appearance.', shortDescription: 'Pore and tone balancing serum',
    skinTypes: ['Oily', 'Combination', 'Normal'], concerns: ['Acne', 'Uneven Texture', 'Dullness'], sensitivityLevels: ['Not Sensitive', 'Slightly Sensitive'],
    ingredients: ['Niacinamide', 'Zinc PCA', 'Panthenol'], benefits: ['balances oil', 'reduces look of pores', 'supports skin tone'], howToUse: 'Use morning and night before moisturizer.', productType: 'Serum', tags: ['niacinamide', 'pore care'], rating: 4.7, reviewCount: 94, featured: false, bestseller: true, newArrival: false, isActive: true,
  },
  {
    name: 'Hyaluronic Acid Serum', brand: 'Rose & Dew', category: 'Serums', price: 3100, discountPrice: 2799, stock: 27,
    description: 'A hydration serum with multi-weight hyaluronic acid for plump, cushiony skin.', shortDescription: 'Hydrator serum',
    skinTypes: ['Dry', 'Normal', 'Combination'], concerns: ['Dryness', 'Fine Lines', 'Dullness'], sensitivityLevels: ['Not Sensitive', 'Slightly Sensitive'],
    ingredients: ['Hyaluronic Acid', 'Polyglutamic Acid', 'Sodium PCA'], benefits: ['deep hydration', 'plumping', 'soft feel'], howToUse: 'Apply to damp skin before moisturizer.', productType: 'Serum', tags: ['hydration', 'plump'], rating: 4.9, reviewCount: 150, featured: true, bestseller: true, newArrival: true, isActive: true,
  },
  {
    name: 'Daily Sunscreen SPF 50', brand: 'Rose & Dew', category: 'Sunscreen', price: 3500, discountPrice: 2999, stock: 40,
    description: 'Lightweight broad-spectrum sunscreen with a non-greasy finish for every day.', shortDescription: 'Daily SPF 50 sunscreen',
    skinTypes: ['Normal', 'Oily', 'Dry', 'Combination'], concerns: ['Dullness', 'Uneven Texture'], sensitivityLevels: ['Not Sensitive', 'Slightly Sensitive'],
    ingredients: ['Zinc Oxide', 'Vitamin E', 'Mica'], benefits: ['UV protection', 'lightweight finish', 'daily essential'], howToUse: 'Apply generously over face and neck 15 minutes before sun exposure.', productType: 'Sunscreen', tags: ['spf', 'daily protection'], rating: 4.8, reviewCount: 190, featured: true, bestseller: true, newArrival: false, isActive: true,
  },
  {
    name: 'Soothing Toner', brand: 'GlowLab', category: 'Toners', price: 2200, discountPrice: 1899, stock: 19,
    description: 'A calm, hydrating toner to reduce discomfort and prep skin for treatment.', shortDescription: 'Comfort-enhancing facial toner',
    skinTypes: ['Sensitive', 'Dry', 'Normal'], concerns: ['Redness', 'Dryness'], sensitivityLevels: ['Slightly Sensitive', 'Very Sensitive'],
    ingredients: ['Chamomile', 'Centella', 'Glycerin'], benefits: ['soothes', 'hydrates', 'preps skin'], howToUse: 'Apply with hands or cotton pad after cleansing.', productType: 'Toner', tags: ['gentle', 'hydrating'], rating: 4.6, reviewCount: 72, featured: false, bestseller: false, newArrival: true, isActive: true,
  },
  {
    name: 'Clay Face Mask', brand: 'Luma Care', category: 'Masks', price: 2800, discountPrice: 2499, stock: 14,
    description: 'Detoxifying clay mask that helps absorb excess oil and refine texture.', shortDescription: 'Purifying clay mask',
    skinTypes: ['Oily', 'Combination'], concerns: ['Acne', 'Excess Oil', 'Uneven Texture'], sensitivityLevels: ['Not Sensitive', 'Slightly Sensitive'],
    ingredients: ['Kaolin Clay', 'Activated Charcoal', 'Salicylic Acid'], benefits: ['purifies', 'detoxifies', 'refines texture'], howToUse: 'Apply a thin layer and rinse after 10 minutes.', productType: 'Mask', tags: ['treatment', 'clay'], rating: 4.5, reviewCount: 55, featured: false, bestseller: false, newArrival: true, isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Category.insertMany(categories);
    await Product.insertMany(products.map((product) => ({ ...product, slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })));
    await seedAdmin();
    console.log('GlowCart seed data created successfully');
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = seedDatabase;
