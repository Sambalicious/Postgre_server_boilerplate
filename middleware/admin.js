module.exports = function (req, res, next) {
  
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .send("You do no have enough permission for this operation");
  }

  return next();
};
