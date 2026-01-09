const express = require("express");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");

const router = express.Router();

/* ========= Multer config ========= */
const upload = multer({
  dest: "uploads/",
});

/* ========= CSV Upload & Read ========= */
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file required" });
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      results.push(row);
    })
    .on("end", () => {
      // CSV read complete → temp file delete
      fs.unlinkSync(req.file.path);

      res.status(200).json({
        success: true,
        totalRows: results.length,
        data: results,
      });
    })
    .on("error", (error) => {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    });
});

module.exports = router;
