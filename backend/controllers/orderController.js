import Order from "../model/order.js";
import sendEmail from "../utils/sendEmail.js";

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    const userId = req.user._id;
    if (items.length == 0 || !totalAmount || !address || !paymentId) {
      return res.status(400).json({ message: 'invalid order data' });
    }
    const order = new Order({
      user: userId,
      items,
      totalAmount,
      address,
      paymentId
    });
    await order.save();

    const message = `Dear ${req.user.name}\n\nThank you for placing your order with EasyCart!\n\nYour order has been successfully placed.\n\nOrder ID: ${order._id}\nTotal Amount: ₹${totalAmount}\n\nWe will keep you updated about your order status.\n\nThank you for shopping with us!\n\nRegards,\nEasyCart Team`;

    try {
      await sendEmail(req.user.email, "Order placed successfully --EasyCart!", message);
    } catch (emailError) {
      console.error("Failed to send order email:", emailError.message);
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.productID', 'name price');
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', '_id name').populate('items.productID', 'name price');
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;
    await order.save();

    res.json({ message: "Order status updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { createOrder, getOrders, myOrders, updateOrderStatus }