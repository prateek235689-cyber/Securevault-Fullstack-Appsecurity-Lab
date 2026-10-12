const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (
            typeof authorization !== "string" ||
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        const token = authorization.slice(7);

        if (!token || token.includes(" ")) {
            return res.status(401).json({
                error: "Invalid authentication token"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"],
                issuer: "securevault"
            }
        );

        const user = await User.findById(decoded.sub);

        if (!user) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };

        next();

    } catch (error) {
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError" ||
            error.name === "CastError"
        ) {
            return res.status(401).json({
                error: "Invalid or expired authentication token"
            });
        }

        console.error("Authentication failed:", error.name);

        return res.status(500).json({
            error: "Authentication service unavailable"
        });
    }
};

module.exports = authenticate;
