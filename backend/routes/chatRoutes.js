const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(authMiddleware, accessChat);
router.route("/").get(authMiddleware, fetchChat);
router.route("/group").post(authMiddleware, createGroupChat);
router.route("/renameGroup").put(authMiddleware, renameGroup);
router.route("/removeUser").put(authMiddleware, removeGroup);
router.route("/addToGroup").put(authMiddleware, addToGroup);

module.exports = router;
