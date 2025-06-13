const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const publicOperations = ['register', 'login'];

  if (req.method === 'POST' && req.body.query) {
    const isPublic = publicOperations.some(op => req.body.query.includes(op));
    if (isPublic) return next();
  }

  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = auth;
