const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function registerUser(req, res) {

    const { username, email, password, role = "user" } = req.body;

    const isUserExists = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserExists) {
        return res.status(409).json({ message: "User is already exists" })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,        // REQUIRED for HTTPS
        sameSite: "None"     // REQUIRED for cross-origin
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}


async function loginUser(req, res) {
    let { username, email, password } = req.body;

    let isEmail = username.includes("@");
    if (isEmail) {
        email = username;
        username = "";
    }

    const user = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        return res.status(401).json({ message: "Invaild Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role,
    }, process.env.JWT_SECRET)

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,        // REQUIRED for HTTPS
        sameSite: "None"     // REQUIRED for cross-origin
    });

    res.status(200).json({
        message: "user logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}


async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({message: "user logged out successfully"})
}


module.exports = { registerUser, loginUser, logoutUser}