const router = require("express").Router();

const UserService = require("./../controllers/users");

router.post("/", UserService.addNewUser);
//router.get("/", UserService.getUsers);
router.get("/", UserService.getUsersWithPagination);
router.get("/:id", UserService.getUser);
router.put("/:id", UserService.editUser);

module.exports = router;
