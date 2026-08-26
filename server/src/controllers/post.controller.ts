import type { Request, Response } from "express";
import {
  commentPostService,
  createPostService,
  deletePostService,
  editPostService,
  getAllPostsService,
  likePostService,
  unlikePostService,
} from "../services/post.service.js";

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const allPosts = await getAllPostsService(userId);

    return res.status(200).json({ success: true, message: "Successfully fetched all posts", data: allPosts });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const postData = req.body;
    const user = req.user!;

    const newPost = await createPostService(postData, user!);

    return res.status(201).json({ success: true, message: "Successfully created a new post", data: newPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id as string;
    const userId = req.user!.id;

    const deletedPost = await deletePostService(postId, userId);

    return res.status(201).json({ success: true, message: "Successfully deleted post", data: deletedPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const postId = req.params.id as string;

    const likedPost = await likePostService(userId, postId);

    return res.status(200).json({ success: true, message: "You liked a post", data: likedPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const unlikePost = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const postId = req.params.id as string;

    const unlikedPost = await unlikePostService(userId, postId);

    return res.status(200).json({ success: true, message: "You uniked a post", data: unlikedPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const commentPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const postId = req.params.id as string;
    const { content } = req.body;

    const commentPost = await commentPostService(userId, postId, content);

    return res.status(200).json({ success: true, message: "You commented on a post", data: commentPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const postData = req.body;
    const postId = req.params.id as string;

    const editedPost = await editPostService(postData, userId, postId);

    return res
      .status(200)
      .json({ success: true, message: "Successfully edited your post", data: editedPost });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
