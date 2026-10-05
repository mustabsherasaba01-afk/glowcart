const Category = require('../models/Category');
const generateSlug = require('../utils/generateSlug');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: 'Categories fetched successfully', data: { categories } });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, message: 'Category fetched successfully', data: { category } });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const slug = generateSlug(name);
    const category = await Category.create({ name, description, image, slug });
    res.status(201).json({ success: true, message: 'Category created successfully', data: { category } });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const updates = { ...req.body };
    if (updates.name && !updates.slug) updates.slug = generateSlug(updates.name);

    const updated = await Category.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Category updated successfully', data: { category: updated } });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
