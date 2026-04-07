const express = require("express");
const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const validate = require("../middleware/validate");
const { postSchema, updatePostSchema } = require("../utils/validators");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", optionalAuth, postController.getPosts);
router.get("/user/:userId", postController.getPostsByUser);

router.post(
  "/",
  authMiddleware,
  upload.array("images"),
  validate(postSchema),
  postController.createPost,
);
router.put(
  "/:id",
  authMiddleware,
  validate(updatePostSchema),
  postController.updatePost,
);
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;
