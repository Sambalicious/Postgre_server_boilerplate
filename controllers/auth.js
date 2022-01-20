const Joi = require("joi");
const { asyncMiddleware } = require("../middleware/async");
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginUser = asyncMiddleware(async (req, res) => {
  let { email, password } = req.body;
  let { error } = validateAuth(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }
  let isValidatedPassword = await decryptPassword(password, user.password);

  if (!isValidatedPassword) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ user }, process.env.SECRET_TOKEN);
  return res.send({ user, accessToken: token });
});

function validateAuth(body) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(200).required(),
  });
  return schema.validate(body);
}

async function decryptPassword(requestBodyPassword, storedPassword) {
  try {
    return await bcrypt.compare(requestBodyPassword, storedPassword);
  } catch (error) {
    console.log(error.message);
  }
}
