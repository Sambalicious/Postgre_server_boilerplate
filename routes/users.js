const router = require("express").Router();

const auth = require("../middleware/auth");
const UserService = require("./../controllers/users");

router.post("/", UserService.addNewUser);
router.get("/", UserService.getUsers);

module.exports = router;
