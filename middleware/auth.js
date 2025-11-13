// Works for both email/password and Google login
function ensureAuth(req, res, next) {
  if ((req.session && req.session.userId) || req.isAuthenticated?.()) {
    return next();
  }
  res.redirect('/auth/login');
}

module.exports = { ensureAuth };
