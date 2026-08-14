import Razorpay from "razorpay";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const processPayment = async (req, res) => {
    try{
    const amount = req.body.amount;
 
    const options = {
        amount: amount * 100,
        currency:"INR",
        receipt: crypto.randomBytes(10).toString("hex"),
 
    };
    const order = await instance.orders.create(options); 
    res.status(200).json({ ...order, key_id: process.env.RAZORPAY_KEY_ID }); 
    
    }catch(error){
        console.log(error);
        res.status(500).json({ message: `server error : ${error.message}`});
    }
    
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log("Verifying payment payload:", { razorpay_order_id, razorpay_payment_id, hasSignature: !!razorpay_signature });

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            console.warn("RAZORPAY_KEY_SECRET is not set in environment variables. Accepting payment in test mode.");
            return res.status(200).json({ message: "Payment verified successfully (test mode)" });
        }

        const sign = crypto.createHmac("sha256", secret).update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");
        if (sign === razorpay_signature) {
            console.log("Payment verified successfully for order:", razorpay_order_id);
            res.status(200).json({ message: "Payment verified successfully" });
        } else {
            console.warn("Payment signature mismatch:", { expected: sign, received: razorpay_signature });
            res.status(400).json({ message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: `server error : ${error.message}` });
    }
};

export { processPayment, verifyPayment };