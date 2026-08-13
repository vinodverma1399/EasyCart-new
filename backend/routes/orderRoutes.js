import express from "express";
import { createOrder,myOrders, getOrders,updateOrderStatus } from "../controllers/orderController.js";
import admin from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const orderRoutes = express.Router();

orderRoutes.route("/").post(protect,createOrder).get(protect,admin,getOrders);
orderRoutes.get("/myorders", protect,myOrders);
orderRoutes.route("/:id/status").put(protect,admin,updateOrderStatus);





export default orderRoutes;