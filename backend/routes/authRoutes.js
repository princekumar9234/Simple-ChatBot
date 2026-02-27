const express = require('express');
const router = express.Router();
const { login, register, logout, updateProfile, mockSocialLogin, uploadAvatar, deleteAccount } = require('../controllers/authController');

// JSON API routes for React
router.post('/login', login);
router.post('/register', uploadAvatar, register);
router.post('/logout', logout);
router.get('/logout', logout);   // also support GET for legacy links
router.post('/update-profile', uploadAvatar, updateProfile);
router.delete('/delete-account', deleteAccount);

// Google Login Routes
const passport = require('passport');

router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.log('⚠️ Google keys not found. Using Mock Login for demonstration.');
    req.params.provider = 'google';
    return mockSocialLogin(req, res);
  }
  passport.authenticate('google', { scope: ['profile'] })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Mock Social Login Routes (GitHub/LinkedIn)
router.get('/github', (req, res) => {
  req.params.provider = 'github';
  mockSocialLogin(req, res);
});

router.get('/linkedin', (req, res) => {
  req.params.provider = 'linkedin';
  mockSocialLogin(req, res);
});

module.exports = router;
