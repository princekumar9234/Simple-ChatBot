const ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  // Return JSON 401 for API calls (React will handle redirect)
  return res.status(401).json({ success: false, error: 'Unauthorized' });
};

const ensureAdmin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ success: false, error: 'Unauthorized' });
};

module.exports = { ensureAuthenticated, ensureAdmin };
