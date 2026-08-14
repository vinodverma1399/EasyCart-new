import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes  from "./routes/productRoutes.js"; 
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";




dotenv.config();

const app = express();
app.use(cors({ origin: '*', credentials: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 8000;
app.get("/home",(req,res)=>{
    console.log("this is home page");
    res.send("this is home page");
})

app.use("/api/auth", routes);
app.use("/api/product", productRoutes);
app.use("/api/orders",  orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
// app.use("/api/cart", cartRoutes);

app.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})
