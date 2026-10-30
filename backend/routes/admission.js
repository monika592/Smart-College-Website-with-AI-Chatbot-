// routes/admission.js
const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');

router.post('/apply', async (req, res) => {
  try {
    const admission = new Admission(req.body);
    await admission.save();
    res.status(200).json({ success: true, message: "Application submitted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error submitting application.", error });
  }
});

module.exports = router;
