const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/mesageControllers");

const router = express.Router();

router.route("/").post(authMiddleware, sendMessage);
router.route("/:chatId").get(authMiddleware, allMessages);

module.exports = router;
