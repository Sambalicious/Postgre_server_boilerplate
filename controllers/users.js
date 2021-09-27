const { User } = require("../models");
const Joi = require("joi");
const { asyncMiddleware } = require("../middleware/async");
const bcrypt = require("bcryptjs");
const Op = require("sequelize").Op;

let defaultPageSize = 5;

const validateUsers = (requestBody) => {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3).max(50),
    role: Joi.string().optional(),
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
    return res
      .status(400)
      .send({ error: { message: "This user is already registered" } });
  }

  password = await encryptPassword(password);

  user = await User.create({
    name,
    email,
    password,
  });
  return res.json({ Data: { user } });
});

// exports.getUsers = asyncMiddleware(async (req, res) => {
//   let users = await User.findAll();
//   res.json({ Data: { users } });
// });

exports.getUsersWithPagination = asyncMiddleware(async (req, res) => {
  const { name, pageIndex, pageSize } = req.query;
  const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  const { limit, offset, pageNumber } = getPagination(pageIndex, pageSize);
  //how to retrieve data with condition
  let users = await User.findAndCountAll({ where: condition, limit, offset });

  const response = getPaginatedData({
    data: users,
    pageIndex: pageNumber,
    pageSize,
    dataKeyName: "Users",
  });

  return res.json(response);
});
exports.getUser = asyncMiddleware(async (req, res) => {
  const id = req.params.id;

  let users = await User.findOne({ where: { id } });
  return res.json({ Data: { users } });
});

exports.editUser = asyncMiddleware(async (req, res) => {
  let { email, password, name, role } = req.body;
  let { error } = validateUsers(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message);
  }

  let user = await User.findOne({ where: { id: req.params.id } });
  if (!user) {
    return res.status(404).json({ error: { message: "User not found" } });
  }

  password = await encryptPassword(password);

  (user.email = email), (user.password = password);
  user.name = name;
  user.role = role;

  await user.save();

  return res.json({ Data: { user } });
});

const getPagination = (pageIndex, pageSize) => {
  const limit = pageSize ? +pageSize : defaultPageSize;
  let pageNumber = pageIndex > 1 ? pageIndex - 1 : 0;
  const offset = pageIndex ? pageNumber * limit : 0;

  return { limit, offset, pageNumber };
};

const getPaginatedData = ({ data, pageNumber, pageSize, dataKeyName }) => {
  const { count: TotalCount, rows } = data;

  const CurrentPage = pageNumber >= 1 ? pageNumber + 1 : 1;

  const TotalPages = Math.ceil(
    TotalCount / (pageSize ? pageSize : defaultPageSize)
  );

  return { [dataKeyName]: rows, TotalCount, TotalPages, CurrentPage };
};
