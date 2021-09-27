const router = require("express").Router();

const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const UserService = require("./../controllers/users");

router.post("/", UserService.addNewUser);
//router.get("/", UserService.getUsers);
router.get("/", UserService.getUsersWithPagination);
router.get("/:id", UserService.getUser);
router.put("/:id", [auth, admin], UserService.editUser);

module.exports = router;
