const winston = require("winston");
module.exports = function (err, req, res, next) {
  //error  //warn//info //verbose  //debug //silly
  winston.error(err.message);

  return res
    .status(500)
    .send({
      message: err.message || "Something doesn't seem right at the moment.",
    });
};
