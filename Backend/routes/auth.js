
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

// ==========================================
// 1. USER REGISTRATION
// ==========================================

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        // Validate registration details
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

        // Check for an existing account
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                error: "Account already exists"
            });
        }

        // Hash the password using bcrypt
        const passwordHash = await bcrypt.hash(password, 12);

        // Create a standard user account
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: passwordHash,
            role: "user"
        });

        // Return safe user details only
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

// ==========================================
// 2. SECURE LOGIN + JWT GENERATION
// ==========================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        // Validate login input
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

        // Find user and include the password hash
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Verify the submitted password
        const isValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isValid) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Ensure the JWT secret exists
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured");
        }

        // Generate a signed, short-lived JWT
        const token = jwt.sign(
            {
                sub: user._id.toString()
            },
            process.env.JWT_SECRET,
            {
                algorithm: "HS256",
                expiresIn: "15m",
                issuer: "securevault"
            }
        );

        // Return JWT and safe user details
        return res.status(200).json({
            message: "Login successful",
            token,
            tokenType: "Bearer",
            expiresIn: "15m",
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

// ==========================================
// 3. PROTECTED USER PROFILE
// ==========================================

router.get("/me", authenticate, (req, res) => {
    return res.status(200).json({
        message: "Protected profile accessed successfully",
        user: req.user
    });
});

// ==========================================
// EXPORT AUTHENTICATION ROUTER
// ==========================================
router.get (
    "/admin",
    authenticate,
    authorize("admin"),
    (req,res) => {
        return res.status(200).json({
            message: "Admin access granted",
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            }
        });
    }

);
module.exports = router;
