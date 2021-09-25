const { User } = require("../models");
const Joi = require("joi");
const { asyncMiddleware } = require("../middleware/async");
const bcrypt = require("bcryptjs");

const validateUsers = (requestBody) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3).max(50),
    role: Joi.string(),
  });
  return schema.validate(requestBody);
};

async function encryptPassword(password) {
  try {
    let SALT = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, SALT);
  } catch (error) {
    console.log(error.message);
  }
}

exports.addNewUser = asyncMiddleware(async (req, res) => {
  let { name, email, password } = req.body;
  let { error } = validateUsers(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ where: { email } });

  if (user) {
    return res.status(400).json({ error: "This user is already registered" });
  }

  password = await encryptPassword(password);

  user = await User.create({
    name,
    email,
    password,
  });
  return res.json({ user });
});

exports.getUsers = asyncMiddleware(async (req, res) => {
  let users = await User.findAll({});
  res.json(users);
});
