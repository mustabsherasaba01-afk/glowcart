const Product = require('../models/Product');
const generateSlug = require('../utils/generateSlug');

const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const search = req.query.search || '';
    const category = req.query.category || '';
    const brand = req.query.brand || '';
    const skinType = req.query.skinType || '';
    const concern = req.query.concern || '';
    const rating = Number(req.query.rating) || 0;

    const filter = { isActive: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { concerns: { $in: [new RegExp(search, 'i')] } },
        { ingredients: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (skinType) filter.skinTypes = { $in: [skinType] };
    if (concern) filter.concerns = { $in: [concern] };
    if (rating > 0) filter.rating = { $gte: rating };

    let sort = { createdAt: -1 };
    switch (req.query.sort) {
      case 'price-low': sort = { price: 1 }; break;
      case 'price-high': sort = { price: -1 }; break;
      case 'rating': sort = { rating: -1 }; break;
      case 'popular': sort = { soldCount: -1 }; break;
      case 'newest': sort = { createdAt: -1 }; break;
      default: sort = { featured: -1, bestseller: -1, createdAt: -1 };
    }

    const products = await Product.find(filter).sort(sort).skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: {
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit) || 1,
        totalProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product fetched successfully', data: { product } });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const payload = req.body;
    const slug = payload.slug || generateSlug(payload.name);

    const product = await Product.create({
      ...payload,
      slug,
      images: payload.images || [],
      isActive: payload.isActive !== false,
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: { product } });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };
    if (updates.name && !updates.slug) updates.slug = generateSlug(updates.name);

    const updated = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Product updated successfully', data: { product: updated } });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
