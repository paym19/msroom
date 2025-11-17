/*const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = passport.authenticate('google', { failureRedirect: '/login' });

exports.authSuccess = (req, res) => {
  res.status(200).json({
    message: 'Login success',
    user: req.user,
  });
};*/
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleVerifyToken = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ message: "Missing id_token" });
    }

    // ✅ verify token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    // 🔍 หา user หรือสร้างใหม่
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
      });
    }

    // 🔑 สร้าง JWT ของ backend
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ส่ง JWT กลับไป front (หรือใช้ cookie ก็ได้)
    res.json({
      message: "Google login success",
      user,
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "Not logged in" });

  res.json({ user: req.user });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out" });
};


