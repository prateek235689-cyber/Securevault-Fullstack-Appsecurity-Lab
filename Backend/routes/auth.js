
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (
            typeof name !== "string" ||
            !name.trim() ||
            name.length > 100 ||
            typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            email.length > 254 ||
            typeof password !== "string" ||
            password.length < 12 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                error: "Invalid registration details"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                error: "Account already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: passwordHash,
            role: "user"
        });

        return res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "Account already exists"
            });
        }

        console.error("Registration failed:", error.name);

        return res.status(500).json({
            error: "Unable to create account"
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password ||
            email.length > 254 ||
            Buffer.byteLength(password, "utf8") > 72
        ) {
            return res.status(400).json({
                error: "Invalid login details"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const isValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isValid) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login failed:", error.name);

        return res.status(500).json({
            error: "Unable to process login"
        });
    }
});
module.exports = router;
