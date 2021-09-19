const router = require("express").Router();

const UserService = require("./../controllers/users");

router.post("/", UserService.addNewUser);
router.get("/", UserService.getUsers);

module.exports = router;
