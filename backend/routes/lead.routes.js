const express = require("express");
const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addNote,
  exportLeadsCSV,
} = require("../controllers/lead.controller");

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");

const router = express.Router();

// 🔥 EXPORT CSV — MUST BE BEFORE :id
router.get("/export/csv", protect, exportLeadsCSV);

// Create lead (Admin only)
router.post("/", protect, adminOnly, createLead);

// Get all leads
router.get("/", protect, getLeads);

// Get single lead
router.get("/:id", protect, getLeadById);

// Update lead
router.put("/:id", protect, updateLead);

// Delete lead (Admin only)
router.delete("/:id", protect, adminOnly, deleteLead);

// Add note
router.post("/:id/notes", protect, addNote);

module.exports = router;

