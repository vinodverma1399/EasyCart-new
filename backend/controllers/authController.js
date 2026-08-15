import user from "../model/user.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await user.create({ name, email, password: hashedPassword });
        if (newUser) {
            // Email send karo, lekin agar fail ho toh registration rok mat
            try {
                const otp = Math.floor(100000 + Math.random() * 900000);
                const message = `Welcome to EasyCart ${name}! Thank you for registering with us. Your OTP is ${otp}`;
                await sendEmail(email, "Welcome to EasyCart Registration", message);
            } catch (emailError) {
                console.error("Welcome email send karne mein error (registration still successful):", emailError.message);
            }

            res.status(201).json({
                message: "User registered successfully", user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    token: generateToken(newUser._id)
                }
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                token: generateToken(existingUser._id)
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user", error });
    }
};

const getUser = async (req, res) => {
    try {
        const users = await user.find({}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "No account found with this email" });
        }

        // 6-digit OTP generate karo
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        existingUser.resetPasswordToken = otp;
        existingUser.resetPasswordExpire = expire;
        await existingUser.save();

        const message = `Hi ${existingUser.name},\n\nYour EasyCart password reset OTP is:\n\n${otp}\n\nThis OTP is valid for 10 minutes only.\n\nIf you did not request this, please ignore this email.`;

        try {
            await sendEmail(email, "EasyCart - Password Reset OTP", message);
        } catch (emailError) {
            console.error("Reset OTP email send error:", emailError.message);
        }

        res.status(200).json({ message: "OTP sent to your email successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const existingUser = await user.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpire: { $gt: new Date() }
        });

        if (!existingUser) {
            return res.status(400).json({ message: "Invalid or expired OTP. Please try again." });
        }

        const salt = await bcrypt.genSalt(10);
        existingUser.password = await bcrypt.hash(password, salt);
        existingUser.resetPasswordToken = null;
        existingUser.resetPasswordExpire = null;
        await existingUser.save();

        res.status(200).json({ message: "Password reset successfully! Please login." });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error });
    }
};

export { registerUser, loginUser, getUser, forgotPassword, resetPassword };
