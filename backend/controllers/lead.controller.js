const Lead = require("../models/Lead");

// ===============================
// CREATE LEAD
// ===============================
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===============================
// GET ALL LEADS
// ===============================
exports.getLeads = async (req, res) => {
  try {
    let leads;

    if (req.user.role === "admin") {
      leads = await Lead.find().populate("assignedTo", "name email");
    } else {
      leads = await Lead.find({ assignedTo: req.user._id });
    }

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET SINGLE LEAD
// ===============================
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("notes.createdBy", "name email");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (
      req.user.role !== "admin" &&
      lead.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// UPDATE LEAD
// ===============================
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (
      req.user.role !== "admin" &&
      lead.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ===============================
// DELETE LEAD
// ===============================
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    await lead.deleteOne();
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// ADD NOTE
// ===============================
exports.addNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (
      req.user.role !== "admin" &&
      lead.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    lead.notes.push({
      content: req.body.content,
      createdBy: req.user._id,
    });

    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate("notes.createdBy", "name email");

    res.status(201).json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// DELETE NOTE
// ===============================
exports.deleteNote = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = lead.notes.id(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (
      req.user.role !== "admin" &&
      note.createdBy?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    note.deleteOne();
    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate("notes.createdBy", "name email");

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note" });
  }
};

// ===============================
// 🔥 EXPORT LEADS TO CSV (FINAL)
// ===============================
exports.exportLeadsCSV = async (req, res) => {
  try {
    const { status, priority } = req.query;

    let filter = {};

    // 🔐 Role-based data
    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    // 🔍 Optional filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name")
      .lean();

    if (!leads.length) {
      return res.status(404).json({
        message: "No leads found to export",
      });
    }

    // 🧾 CSV HEADER
    let csv =
      "Name,Email,Phone,Company,Status,Priority,Assigned To,Created At\n";

    // 🧾 CSV ROWS
    leads.forEach((lead) => {
      csv += `"${lead.name}","${lead.email}","${lead.phone}","${lead.company || ""}","${lead.status}","${lead.priority}","${lead.assignedTo?.name || ""}","${lead.createdAt}"\n`;
    });

    // ⬇️ Auto-download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=leads_export.csv"
    );

    res.status(200).send(csv);
  } catch (error) {
    console.error("CSV EXPORT ERROR:", error);
    res.status(500).json({ message: "CSV export failed" });
  }
};
