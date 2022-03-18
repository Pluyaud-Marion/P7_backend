const express = require("express");

const postController = require("../controllers/post");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/authentification");
const limiter = require("../middleware/limiter");
const router = express.Router();


router.post("/:userId", auth, limiter.globalLimiter, multer, postController.createPost);
router.get("/", auth, limiter.globalLimiter, postController.getAllPost);
router.put("/:postId", auth, limiter.globalLimiter, multer, postController.updatePost);
router.delete("/:postId", auth, limiter.globalLimiter, postController.deletePost);

//non utilisée pour le front
router.get("/:userId", auth, limiter.globalLimiter, postController.getUserPost);

module.exports = router;