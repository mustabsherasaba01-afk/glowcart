const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    res.status(200).json({ success: true, message: 'Wishlist fetched', data: { wishlist: wishlist || { user: req.user._id, products: [] } } });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    if (!wishlist.products.some((id) => id.toString() === productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.status(200).json({ success: true, message: 'Added to wishlist', data: { wishlist } });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter((id) => id.toString() !== req.params.productId);
    await wishlist.save();
    res.status(200).json({ success: true, message: 'Removed from wishlist', data: { wishlist } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
