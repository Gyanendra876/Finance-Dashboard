const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});

// Logout
router.get('/logout', authController.logout);

// Email/password login & register
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
