require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

app.disable("x-powered-by");

app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use("/api", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false
}));

app.get("/api/health", (req, res) => {
    res.json({
        application: "SecureVault",
        status: "OK",
        message: "SecureVault backend is running"
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found"
    });
});

async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, "127.0.0.1", () => {
            console.log(`SecureVault running at http://127.0.0.1:${PORT}`);
        });
    } catch (error) {
    console.error("MongoDB connection failed");
    console.error("Error type:", error.name);
    console.error("Error message:", error.message.replace(
        /mongodb(?:\+srv)?:\/\/[^\s]+/gi,
        "[REDACTED_CONNECTION_STRING]"
    ));
    process.exit(1);
    }
    }

startServer();
