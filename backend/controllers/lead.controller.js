const Lead = require("../models/Lead");

/* =====================================================
   CREATE LEAD (ADMIN)
===================================================== */
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      assignedTo: req.body.assignedTo || req.user._id,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =====================================================
   GET ALL LEADS
   Admin → all
   User  → assigned only
===================================================== */
exports.getLeads = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role !== "admin") {
      filter.assignedTo = req.user._id;
    }

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name email")
      .populate("notes.createdBy", "name email");

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   GET SINGLE LEAD
===================================================== */
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
      lead.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   UPDATE LEAD (ADMIN)
===================================================== */
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
    )
      .populate("assignedTo", "name email")
      .populate("notes.createdBy", "name email");

    res.json(updatedLead);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =====================================================
   DELETE LEAD (ADMIN)
===================================================== */
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

/* =====================================================
   ADD NOTE
===================================================== */
exports.addNote = async (req, res) => {
  try {
    if (!req.body.content) {
      return res.status(400).json({ message: "Note content is required" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
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

/* =====================================================
   EDIT NOTE
===================================================== */
exports.editNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Note content is required" });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = lead.notes.id(req.params.noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.content = content;
    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate("notes.createdBy", "name email");

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Failed to update note" });
  }
};

/* =====================================================
   DELETE NOTE
===================================================== */
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

    note.deleteOne();
    await lead.save();

    const updatedLead = await Lead.findById(req.params.id)
      .populate("notes.createdBy", "name email");

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note" });
  }
};

/* =====================================================
   EXPORT LEADS TO CSV (ADMIN)
===================================================== */
exports.exportLeadsCSV = async (req, res) => {
  try {
    const { status, priority } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name")
      .lean();

    if (!leads.length) {
      return res.status(404).json({ message: "No leads found" });
    }

    let csv =
      "Name,Email,Phone,Company,Status,Priority,Assigned To,Created At\n";

    leads.forEach((lead) => {
      csv += `"${lead.name}","${lead.email}","${lead.phone}","${lead.company || ""}","${lead.status}","${lead.priority}","${lead.assignedTo?.name || ""}","${lead.createdAt}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=leads_export.csv"
    );

    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: "CSV export failed" });
  }
};
