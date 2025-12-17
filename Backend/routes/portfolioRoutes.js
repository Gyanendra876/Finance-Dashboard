const express = require("express");
const router = express.Router();
const Portfolio = require("../models/portfolio");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  console.log("POST /portfolio hit, body:", req.body);

  try {
    const {
      fundName,
      schemeCode,
      units,
      investedAmount,
      buyNav,
      investmentDate, 
    } = req.body;

    if (!fundName || !buyNav || (!units && !investedAmount)) {
      return res.status(400).json({
        error: "Provide fundName, buyNav and units or investedAmount",
      });
    }

    const portfolio = new Portfolio({
      userId: req.user.id, 
      fundName,
      schemeCode,
      units,
      investedAmount,
      buyNav,

      createdAt: investmentDate
        ? new Date(investmentDate)
        : new Date(),
    });

    const saved = await portfolio.save();
    res.json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save portfolio" });
  }
});


router.get("/user", auth, async (req, res) => {
  try {
    const { date } = req.query;

    const query = { userId: req.user.id };

    if (date) {
      query.createdAt = {
        $lte: new Date(date),
      };
    }

    const portfolio = await Portfolio.find(query).sort({
      createdAt: 1,
    });

    res.json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch portfolio" });
  }
});



router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Portfolio.deleteOne({ _id: id, userId: req.user.id });
    if (deleted.deletedCount === 0)
      return res.status(404).json({ error: "Portfolio item not found" });
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete portfolio item" });
  }
});

module.exports = router;
