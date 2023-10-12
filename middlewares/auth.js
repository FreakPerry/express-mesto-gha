const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    if (!req.cookies) {
      return res.status(401).send({ message: 'Authorization required' });
    }
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).send({ message: 'Authorization required' });
  }
};

module.exports = authMiddleware;
