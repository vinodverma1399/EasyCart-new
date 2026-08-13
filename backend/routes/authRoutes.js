import express from "express";
import { registerUser, loginUser, getUser } from "../controllers/authController.js";
import admin from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const routes = express.Router();

routes.post("/register", registerUser);
routes.post("/login", loginUser);
routes.get("/getAll", protect, admin, getUser);

export default routes;