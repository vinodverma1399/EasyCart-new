import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {processPayment,verifyPayment} from "../controllers/paymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/process-payment",protect,processPayment);
paymentRoutes.post("/verify-payment",protect,verifyPayment);


export default paymentRoutes;