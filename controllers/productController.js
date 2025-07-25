const Product = require("../models/productModel");

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find().populate("userId");
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("userId");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { title, details, price, category } = req.body;
    const coverImage = req.file ? req.file.path : undefined;

    const product = await Product.create({
      title,
      details,
      price,
      category,
      coverImage,
      userId: req.user.id,
    });

    const populated = await Product.findById(product._id).populate("userId");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Create Product error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const { title, details, price, category } = req.body;
    const coverImage = req.file ? req.file.path : req.body.coverImage;

    const updateData = {};

    if (title) updateData.title = title.trim();
    if (details) updateData.details = details;
    if (price) updateData.price = Number(price);
    if (category) updateData.category = category.trim();
    if (coverImage) updateData.coverImage = coverImage.trim();

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
      }
    ).populate("userId");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({ message: "Server error while updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error("Delete Product error:", error);

    res.status(500).json({ message: error.message });
  }
};


const searchProducts = async (req, res) => {
  try {
    const { title, category } = req.query;
    const filter = {};
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    if (category) {
      filter.category = {$regex:category, $options: "i"};
    }

    const products = await Product.find(filter);

    res.status(200).json(products);
  } catch (error) {
    console.error("Search Product error:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};
