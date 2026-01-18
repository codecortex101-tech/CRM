require("dotenv").config();
console.log("JWT_SECRET =", process.env.JWT_SECRET);
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

const leadRoutes = require("./routes/lead.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const csvRoutes = require("./routes/csv.routes"); // ✅ ADD THIS

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/csv", csvRoutes); // ✅ ADD THIS

// Test route
app.get("/", (req, res) => {
  res.send("CRM Backend is running 🚀");
});

// DB connect
connectDB();

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
