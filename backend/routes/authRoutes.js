import express from "express";
import { registerUser, loginUser, getUser, forgotPassword, resetPassword } from "../controllers/authController.js";
import admin from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const routes = express.Router();

routes.post("/register", registerUser);
routes.post("/login", loginUser);
routes.get("/getAll", protect, admin, getUser);
routes.post("/forgot-password", forgotPassword);
routes.post("/reset-password", resetPassword);

export default routes;