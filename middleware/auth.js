const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-access-token");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token found" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); ///the configToken should be accessed secretly

    req.user = decodedToken.user;

    return next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
