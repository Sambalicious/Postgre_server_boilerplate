const router = require("express").Router();
const authService = require("./../controllers/auth");

router.post("/", authService.loginUser);

module.exports = router;
