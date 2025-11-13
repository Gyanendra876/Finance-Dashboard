const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");

const { ensureAuth } = require('../middleware/auth');


// 🟢 Add new bill
router.post("/add", ensureAuth, async (req, res) => {
  try {
    const { title, amount, dueDate } = req.body;
    await Bill.create({
      userId: req.user._id,
      title,
      amount,
      dueDate
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding bill");
  }
});

// 🔴 Delete bill
router.post("/delete/:id", ensureAuth, async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting bill");
  }
});

module.exports = router;
