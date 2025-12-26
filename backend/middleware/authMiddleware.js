import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // DEBUG LOGS 
            console.log("--- AUTH DEBUG ---");
            console.log("1. Token Received:", token.substring(0, 10) + "...");
            console.log("2. Secret Length:", process.env.JWT_SECRET ? process.env.JWT_SECRET.length : "UNDEFINED/MISSING");
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("3. Token Verified. ID:", decoded.id);

            // Get user from the token
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                console.log("❌ User ID not found in DB");
                res.status(401);
                throw new Error("Not authorized, user not found");
            }

            console.log("✅ Success. User:", req.user.username);
            next();
        } catch (err) {
            console.error("❌ Auth Error:", err.message);
            res.status(401).json({ message: "Not authorized, token failed: " + err.message });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `User role "${req.user.role}" is not authorized to access this route` });
        }
        next();
    };
};