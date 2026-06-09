function roleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Brak użytkownika" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Brak uprawnień" });
    }

    next();
  };
}

module.exports = roleMiddleware;