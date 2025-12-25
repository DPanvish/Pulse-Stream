import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = async(req, res) => {
    const { username, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists){
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        _id,
        username,
        email,
        password,
        role: role || "viewer",
    });

    if(user){
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    }else{
        res.status(400).json({ message: "Invalid user data" });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    }else{
        res.status(401).json({ message: "Invalid email or password" });
    }
}