const express = require("express");

const commentController = require("../controllers/comment");

const multer = require("../middleware/multer-config");
const auth = require("../middleware/authentification");
const limiter = require("../middleware/limiter");

const router = express.Router();

router.post("/comment/:postId", auth, limiter.globalLimiter ,multer, commentController.createComment);
router.delete("/comment/:commentId", auth, limiter.globalLimiter,commentController.deleteComment);

//non utilisée pour le front
router.get("/comment/:postId", auth, limiter.globalLimiter, commentController.getAllCommentForPost);

module.exports = router;