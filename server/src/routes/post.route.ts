import express from "express";
import {
  commentPost,
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
  likePost,
  unlikePost,
} from "../controllers/post.controller.js";
import { optionalAuth, protectRoute } from "../middlewares/auth.middleware.js";
import { checkLocationMiddleware } from "../middlewares/location.middleware.js";

const router = express.Router();

router.get("/", optionalAuth, getAllPosts);
router.post("/", protectRoute, checkLocationMiddleware, createPost);
router.get("/:id", optionalAuth, getPost);
router.patch("/:id/edit", protectRoute, checkLocationMiddleware, editPost);
router.delete("/:id/delete", protectRoute, deletePost);
router.post("/:id/like", protectRoute, likePost);
router.delete("/:id/unlike", protectRoute, unlikePost);
router.post("/:id/comment", protectRoute, checkLocationMiddleware, commentPost);

export default router;
