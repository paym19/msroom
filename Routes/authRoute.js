const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// ✅ ใช้ GET สำหรับ redirect ไป Google OAuth
router.get('/google', authController.googleAuth);

// ✅ Callback จาก Google
router.get('/google/callback', authController.googleCallback, authController.authSuccess);

// ✅ อื่นๆ
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: 'Logged out' });
  });
});

router.get('/profile', (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not logged in' });
  res.status(200).json({ user: req.user });
});

module.exports = router;

/**
 * @openapi
 * /auth/google:
 *   get:
 *     summary: Login with Google OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google login
 */

/**
 * @openapi
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Login success
 */

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User profile returned
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout success
 */


