const mongoose = require('mongoose');

const NavSchema = new mongoose.Schema({
    
  schemeCode: String,
  schemeName: String,
  nav: Number,
  lastUpdated: Date
});

module.exports = mongoose.model('Nav', NavSchema);
