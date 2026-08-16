const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (token === adminPassword) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Invalid Admin Password' });
  }
};

module.exports = adminAuth;
