const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { type: String, required: true },  // <— CHANGE HERE

  balance: { type: Number, default: 0 },
  monthlyIncome: { type: Number, default: 0 },

}, { timestamps: true });

// Match password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
