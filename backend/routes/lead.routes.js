const express = require("express");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  addNote,
  editNote,     // ✅ ADD THIS
  deleteNote,
  exportLeadsCSV
} = require("../controllers/lead.controller");

const protect = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/role.middleware");

const router = express.Router();

// EXPORT CSV
router.get("/export/csv", protect, adminOnly, exportLeadsCSV);

// CREATE LEAD
router.post("/", protect, adminOnly, createLead);

// GET ALL LEADS
router.get("/", protect, getLeads);

// GET SINGLE LEAD
router.get("/:id", protect, getLeadById);

// UPDATE LEAD
router.put("/:id", protect, adminOnly, updateLead);

// DELETE LEAD
router.delete("/:id", protect, adminOnly, deleteLead);

// ADD NOTE
router.post("/:id/notes", protect, adminOnly, addNote);

// EDIT NOTE ✅
router.put("/:id/notes/:noteId", protect, adminOnly, editNote);

// DELETE NOTE
router.delete("/:id/notes/:noteId", protect, adminOnly, deleteNote);

module.exports = router;
