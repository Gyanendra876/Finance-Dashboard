const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.render('index', { error: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists) return res.render('index', { error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, passwordHash });

    // Redirect to login tab
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('index', { error: 'Server error' });
  }
};


// Login
exports.login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
};

// Logout
exports.logout = (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect('/');
  });
};
