const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(authMiddleware, allUsers);
router.post("/login", authUser);

module.exports = router;
