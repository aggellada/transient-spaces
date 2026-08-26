import express from "express";
import {
  commentPost,
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  likePost,
  unlikePost,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { checkLocationMiddleware } from "../middlewares/location.middleware.js";

const router = express.Router();

// GET /    Feature: should still be able to see all posts even if not logged in
router.get("/", protectRoute, checkLocationMiddleware, getAllPosts);
router.post("/", protectRoute, checkLocationMiddleware, createPost);
router.patch("/:id/edit", protectRoute, checkLocationMiddleware, editPost);
router.delete("/:id/delete", protectRoute, checkLocationMiddleware, deletePost);
router.post("/:id/like", protectRoute, checkLocationMiddleware, likePost);
router.post("/:id/unlike", protectRoute, checkLocationMiddleware, unlikePost);
router.post("/:id/comment", protectRoute, checkLocationMiddleware, commentPost);

export default router;
