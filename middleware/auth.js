const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).send("Access denied. No token found");
  }

  try {
    const decodedToken = jwt.verify(token, "ConfigToken"); ///the configToken should be accessed secretly

    req.user = decodedToken;
    return  next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};
