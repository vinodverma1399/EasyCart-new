import User from "../model/user.js";
import Order from "../model/order.js";
import Product from "../model/product.js";

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: "user"});
        const totalProducts = await Product.countDocuments({});
        const totalOrders = await Order.countDocuments({});

        const totalDeliveredOrders = await Order.countDocuments({ status: "delivered" });
        const totalCancelledOrders = await Order.countDocuments({ status: "cancelled" });
        const totalPendingOrders = await Order.countDocuments({ status: "pending" });
        const totalShippedOrders = await Order.countDocuments({ status: "shipped" });
        
       const totalRevenue = await Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]); 
        const totalRevenueAmount = totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;
        const responseData = {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue:totalRevenueAmount,
            totalDeliveredOrders,
            totalCancelledOrders,
            totalPendingOrders,
            totalShippedOrders
          
        };
        res.status(200).json({ message: "Admin stats retrieved successfully", responseData });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export default getAdminStats;