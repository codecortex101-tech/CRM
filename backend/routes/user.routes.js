const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");

const router = express.Router();

// GET ALL USERS (ADMIN ONLY)
router.get("/", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

module.exports = router;
