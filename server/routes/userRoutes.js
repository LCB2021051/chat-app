const {
  register,
  login,
  setAvatar,
  getAllUser,
} = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);

router.get("/getAllUser/:id", getAllUser);

module.exports = router;
