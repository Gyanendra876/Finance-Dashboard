const jwt = require('jsonwebtoken');

const ensureAuth = (req, res, next) => {
  try {
    let token = req.header('Authorization') || req.cookies?.token;
    if (!token) return res.status(401).json({ msg: 'No token, access denied' });

    token = token.replace('Bearer ', '');
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = ensureAuth ;
