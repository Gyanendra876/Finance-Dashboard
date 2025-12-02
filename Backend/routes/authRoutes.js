// routes/authRoutes.js
const router = require('express').Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.me);
router.post('/logout', auth, authController.logout);  // <-- ADD THIS

module.exports = router;
