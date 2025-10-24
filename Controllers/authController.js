const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = passport.authenticate('google', { failureRedirect: '/login' });

exports.authSuccess = (req, res) => {
  res.status(200).json({
    message: 'Login success',
    user: req.user,
  });
};

