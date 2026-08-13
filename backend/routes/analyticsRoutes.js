import  express from "express";
import { protect } from "../middleware/authMiddleware.js";
import  admin  from "../middleware/adminMiddleware.js";
import getAdminStats from "../controllers/analyticsController.js";
const analyticsRoutes = express.Router();

analyticsRoutes.get("/", protect, admin, getAdminStats);

export default analyticsRoutes;
