import  Jwt  from "jsonwebtoken";
import user from "../model/user.js";

const protect = async (req, res, next) => { 
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        req.user = await user.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
}

export { protect };