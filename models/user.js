const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  googleId: String,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: String,
  passwordHash: String,
  balance: { type: Number, default: 0 },
  monthlyIncome: { type: Number, default: 0 },
}, { timestamps: true });

// Password compare helper
userSchema.methods.comparePassword = async function(password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
