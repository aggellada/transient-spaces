import { create } from "zustand";
import type { CreatePostDTO, PostDTO } from "../types/posts.types";
import api from "../lib/utils";

interface PostState {
  posts: PostDTO[] | [];
  isGettingAllPosts: boolean;
  isCreatingPost: boolean;
  createPost: (postData: CreatePostDTO, placeId: string) => Promise<void>;
  getAllPosts: (placeId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  isGettingAllPosts: false,
  isCreatingPost: false,

  getAllPosts: async (placeId: string) => {
    set({ isGettingAllPosts: true });
    try {
      const response = await api.get(`/posts?placeId=${placeId}`);

      set({ posts: response.data.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isGettingAllPosts: false });
    }
  },

  createPost: async (postData: CreatePostDTO, placeId: string) => {
    set({ isCreatingPost: true });
    try {
      await api.post("/posts", postData);
      await get().getAllPosts(placeId);
    } catch (error) {
      console.error(error);
    } finally {
      set({ isCreatingPost: false });
    }
  },

  likePost: async (postId: string) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
    } catch (error) {
      console.error(error);
    }
  },

  unlikePost: async (postId: string) => {
    try {
      const response = await api.post(`/posts/${postId}/unlike`);
    } catch (error) {
      console.error(error);
    }
  },
}));
