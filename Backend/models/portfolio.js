const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schemeCode: { type: String },
  fundName: { type: String, required: true },
  units: { type: Number, required: true },
  investedAmount: { type: Number },
  buyNav: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Portfolio", PortfolioSchema);
