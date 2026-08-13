import product from "../model/product.js";
import cloudinary from "../config/cloudinary.js";

const getAllProducts = async (req, res) => {
  try {
    const Products = await product.find({});
    res.json(Products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const Products = await product.findById(req.params.id);
    if (!Products) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(Products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    // console.log(req.body)
    // console.log(req.file)
    let imageurl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageurl = result.secure_url;
    }
    const newProduct = await product.create({
      name,
      description,
      price,
      category,
      stock,
      imageurl
    });

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    console.error("ERROR MESSAGE:", error.message);
    console.error("ERROR STACK:", error.stack);

    res.status(500).json({
        message: error.message
    });
}
}



const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const updatedProduct = await product.findById(req.params.id);
    if (updatedProduct) {
        updatedProduct.name = name ?? updatedProduct.name;
        updatedProduct.description = description ?? updatedProduct.description;
        updatedProduct.price = price ?? updatedProduct.price;
        updatedProduct.category = category ?? updatedProduct.category;
        updatedProduct.stock = stock ?? updatedProduct.stock;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updatedProduct.imageurl = result.secure_url;
        }
        const savedProduct = await updatedProduct.save();
        return res.json({ message: "Product updated successfully", product: savedProduct });
    }

    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const DeletedProduct = await product.findById(req.params.id);
    if (!DeletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    await DeletedProduct.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
