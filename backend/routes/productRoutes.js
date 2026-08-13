import express from "express"
import { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js"; 
import admin from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const productRoutes = express.Router();

productRoutes.get("/", getAllProducts);
productRoutes.post("/", protect, admin, upload.single("image"), createProduct);
productRoutes.route("/:id").get(getProductById).put(protect, admin, upload.single("image"), updateProduct).delete(protect, admin, deleteProduct);

export default productRoutes;