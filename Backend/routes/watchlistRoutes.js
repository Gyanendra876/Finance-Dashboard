const express = require("express");
const router = express.Router();
const Watchlist = require("../models/Watchlist");

// Get by user
router.get("/:userId", async (req, res) => {
  const items = await Watchlist.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(items);
});

// Add
router.post("/", async (req, res) => {
  const item = new Watchlist(req.body); // include userId from frontend
  await item.save();
  res.json(item);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Watchlist.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;
