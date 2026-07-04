const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect("/auth/login");
};

const isAuthenticatedApi = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
};

module.exports = { isAuthenticated, isAuthenticatedApi };
