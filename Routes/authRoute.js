const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// ✅ ใช้ GET สำหรับ redirect ไป Google OAuth
router.get('/google', authController.googleAuth);

// ✅ Callback จาก Google
router.get('/google/callback', authController.googleCallback, authController.authSuccess);

router.post('/google/verify', authController.googleVerifyToken);

// ✅ อื่นๆ
/*router.post('/logout', (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: 'Logged out' });
  });
});

router.get('/profile', (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  res.status(200).json({ user: req.user });
});*/

// ใช้ JWT cookie
router.get('/profile', protect, authController.getProfile);

// logout
router.post('/logout', authController.logout);

module.exports = router;

