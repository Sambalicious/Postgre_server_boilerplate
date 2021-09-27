module.exports = function (req, res, next) {
  if (!["admin", "superAdmin"].includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "You do no have enough permission for this operation" });
  }

  return next();
};
