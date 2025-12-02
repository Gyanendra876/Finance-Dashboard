// models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  savedAmount: { type: Number, default: 0 },
  deadline: { type: Date },
}, { timestamps: true });

// Virtual for progress
goalSchema.virtual('progress').get(function() {
  if (!this.targetAmount || this.targetAmount === 0) return 0;
  return Math.min((this.savedAmount / this.targetAmount) * 100, 100);
});

// Include virtuals
goalSchema.set('toObject', { virtuals: true });
goalSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Goal', goalSchema);
