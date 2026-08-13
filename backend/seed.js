import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./model/user.js";
import Product from "./model/product.js";
import Order from "./model/order.js";

dotenv.config();

// --- Seed Data ----------------------------------------------------------------

const users = [
  {
    name: "Admin User",
    email: "admin@easycart.com",
    password: "admin123",
    roll: "admin",
    verified: true,
  },
  {
    name: "Riya Sharma",
    email: "riya@example.com",
    password: "user123",
    roll: "user",
    verified: true,
  },
  {
    name: "Arjun Mehta",
    email: "arjun@example.com",
    password: "user123",
    roll: "user",
    verified: true,
  },
  {
    name: "Priya Nair",
    email: "priya@example.com",
    password: "user123",
    roll: "user",
    verified: false,
  },
];

const products = [
  {
    name: "Apple iPhone 15",
    description: "Latest iPhone with A16 Bionic chip, 48MP camera, and USB-C.",
    price: 79999,
    category: "Electronics",
    imageurl: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500",
    stock: 50,
  },
  {
    name: "Samsung Galaxy S24",
    description: "Flagship Android phone with AI features and 200MP camera.",
    price: 74999,
    category: "Electronics",
    imageurl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
    stock: 40,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancelling wireless headphones.",
    price: 29999,
    category: "Electronics",
    imageurl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    stock: 30,
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Max Air cushioning.",
    price: 9999,
    category: "Footwear",
    imageurl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    stock: 100,
  },
  {
    name: "Levi s 511 Slim Jeans",
    description: "Classic slim-fit jeans in stretch denim fabric.",
    price: 3499,
    category: "Clothing",
    imageurl: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500",
    stock: 80,
  },
  {
    name: "Prestige Electric Kettle",
    description: "1.5L stainless steel electric kettle with auto shut-off.",
    price: 1299,
    category: "Kitchen",
    imageurl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
    stock: 60,
  },
  {
    name: "The Alchemist - Paulo Coelho",
    description: "A philosophical novel about following your dreams.",
    price: 299,
    category: "Books",
    imageurl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    stock: 200,
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip 6mm thick yoga mat with carrying strap.",
    price: 1799,
    category: "Fitness",
    imageurl: "https://images.unsplash.com/photo-1601925228952-df96c428ca44?w=500",
    stock: 75,
  },
];

// --- Seeder -------------------------------------------------------------------

const seedDB = async () => {
  try {
    await connectDB();
    console.log("\n Seeding database...\n");

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("  Cleared existing data");

    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log("  Created " + createdUsers.length + " users");

    const createdProducts = await Product.insertMany(products);
    console.log("  Created " + createdProducts.length + " products");

    const [adminUser, riya, arjun] = createdUsers;
    const [iphone, samsung, headphones, nike, levis] = createdProducts;

    const orders = [
      {
        user: riya._id,
        items: [
          { productID: iphone._id, qty: 1, price: iphone.price },
          { productID: headphones._id, qty: 1, price: headphones.price },
        ],
        totalAmount: iphone.price + headphones.price,
        address: {
          fullName: "Riya Sharma",
          street: "12, Rose Apartments, MG Road",
          city: "Bangalore",
          postalCode: "560001",
          state: "Karnataka",
          country: "India",
        },
        paymentId: "pay_seed_001",
        status: "delivered",
      },
      {
        user: arjun._id,
        items: [
          { productID: samsung._id, qty: 1, price: samsung.price },
          { productID: nike._id, qty: 2, price: nike.price },
        ],
        totalAmount: samsung.price + nike.price * 2,
        address: {
          fullName: "Arjun Mehta",
          street: "45, Sector 17",
          city: "Chandigarh",
          postalCode: "160017",
          state: "Punjab",
          country: "India",
        },
        paymentId: "pay_seed_002",
        status: "shipped",
      },
      {
        user: riya._id,
        items: [{ productID: levis._id, qty: 2, price: levis.price }],
        totalAmount: levis.price * 2,
        address: {
          fullName: "Riya Sharma",
          street: "12, Rose Apartments, MG Road",
          city: "Bangalore",
          postalCode: "560001",
          state: "Karnataka",
          country: "India",
        },
        paymentId: "pay_seed_003",
        status: "pending",
      },
      {
        user: arjun._id,
        items: [{ productID: headphones._id, qty: 1, price: headphones.price }],
        totalAmount: headphones.price,
        address: {
          fullName: "Arjun Mehta",
          street: "45, Sector 17",
          city: "Chandigarh",
          postalCode: "160017",
          state: "Punjab",
          country: "India",
        },
        paymentId: "pay_seed_004",
        status: "cancelled",
      },
    ];

    const createdOrders = await Order.insertMany(orders);
    console.log("  Created " + createdOrders.length + " orders");

    console.log("\n Seeding complete!\n");
    console.log("-------------------------------------");
    console.log("Seeded Credentials:");
    console.log("-------------------------------------");
    console.log("  Admin  -> admin@easycart.com  / admin123");
    console.log("  User 1 -> riya@example.com    / user123");
    console.log("  User 2 -> arjun@example.com   / user123");
    console.log("  User 3 -> priya@example.com   / user123");
    console.log("-------------------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
