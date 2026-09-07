import type { Request, Response } from "express";
import {
  commentPostService,
  createPostService,
  deleteCommentService,
  deletePostService,
  editPostService,
  getAllPostsService,
  getPostService,
  likePostService,
  unlikePostService,
} from "../services/post.service.js";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const placeId = req.query.placeId as string;

    const profile_id = req.user?.profile_id;

    const allPosts = await getAllPostsService(placeId, profile_id);

    return res.status(200).json({
      success: true,
      message: "Successfully fetched all posts",
      data: allPosts,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const postData = req.body;
    const user = req.user!;

    const newPost = await createPostService(postData, user);

    return res.status(201).json({ success: true, message: "Successfully created a new post", data: newPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id as string;
    const profileId = req.user!.profile_id;

    const deletedPost = await deletePostService(postId, profileId);

    return res.status(201).json({ success: true, message: "Successfully deleted post", data: deletedPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const profileId = req.user!.profile_id;
    const postId = req.params.id as string;

    const wasFreshlyLiked = await likePostService(profileId, postId);

    if (wasFreshlyLiked) {
      return res.status(201).json({ success: true, message: "Post liked" });
    } else {
      return res.status(200).json({ success: true, message: "Post was already liked" });
    }
  } catch (error: any) {
    console.error("Like Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const profileId = req.user!.profile_id;
    const postId = req.params.id as string;

    const wasUnliked = await unlikePostService(profileId, postId);

    if (wasUnliked) {
      return res.status(200).json({ success: true, message: "Post unliked" });
    } else {
      return res.status(200).json({ success: true, message: "Post was already unliked" });
    }
  } catch (error: any) {
    console.error("Unlike Error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const commentPost = async (req: Request, res: Response) => {
  try {
    const profileId = req.user!.profile_id;
    const postId = req.params.id as string;
    const { content } = req.body;

    const commentPost = await commentPostService(profileId, postId, content);

    return res.status(200).json({ success: true, message: "You commented on a post", data: commentPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const profileId = req.user!.profile_id;
    const postData = req.body;
    const postId = req.params.id as string;

    const editedPost = await editPostService(postData, profileId, postId);

    return res
      .status(200)
      .json({ success: true, message: "Successfully edited your post", data: editedPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as {
      id: string;
    };

    const post = await getPostService(id);

    return res.status(200).json({ success: true, message: "Successfully fetched post", data: post });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const profileId = req.user!.profile_id;
    const { id: commentId } = req.params as {
      id: string;
    };

    const deletedComment = await deleteCommentService(profileId, commentId);

    return res
      .status(200)
      .json({ success: true, message: "Successfully deleted your comment", data: deletedComment });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
