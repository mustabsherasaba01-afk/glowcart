const Product = require('../models/Product');

const getFeaturedProducts = async () => Product.find({ featured: true }).limit(6);

module.exports = { getFeaturedProducts };
