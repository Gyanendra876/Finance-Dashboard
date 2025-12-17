
const express = require("express");
const router = express.Router();
const axios = require("axios");
const ensureAuth = require("../middleware/auth");


router.get("/latest", ensureAuth, async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ msg: "schemeCode is required" });
    }

    const url = `https://api.mfapi.in/mf/${code}`;

    const response = await axios.get(url);

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.status(404).json({ msg: "No NAV data found for this scheme code" });
    }

    const latest = response.data.data[0];

    res.json({
      schemeCode: code,
      schemeName: response.data.meta.scheme_name,
      nav: parseFloat(latest.nav),
      date: latest.date
    });

  } catch (err) {
    console.error("NAV fetch error:", err.message);

    return res.status(500).json({
      msg: "Unable to fetch NAV from MFAPI",
      error: err.message
    });
  }
});



router.get("/history", ensureAuth, async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ msg: "schemeCode is required" });
    }

    const url = `https://api.mfapi.in/mf/${code}`;

    const response = await axios.get(url);

    if (!response.data) {
      return res.status(404).json({ msg: "Scheme not found" });
    }

    res.json(response.data);

  } catch (err) {
    console.error("NAV history error:", err.message);
    res.status(500).json({ msg: "Unable to fetch NAV history", error: err.message });
  }
});

module.exports = router;
