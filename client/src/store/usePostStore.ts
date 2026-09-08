import { create } from "zustand";
import type { CreateCommentDTO, CreatePostDTO, PostDTO } from "../types/posts.types";
import api from "../lib/utils";
import type { AuthUser } from "../types/auth.types";

interface PostState {
  posts: PostDTO[] | [];
  post: PostDTO | null;
  isGettingAllPosts: boolean;
  isGettingPost: boolean;
  isDeletingComment: boolean;
  isDeletingPost: boolean;
  isCreatingPost: boolean;
  isCommenting: boolean;
  createPost: (postData: CreatePostDTO, placeId: string) => Promise<void>;
  getAllPosts: (placeId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  commentPost: (postId: string, commentData: CreateCommentDTO, authUser: AuthUser) => Promise<void>;
  getPost: (postId: string) => Promise<void>;
  deleteComment: (commentId: string, postId: string) => Promise<void>;
  resetPost: () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  post: null,
  isGettingAllPosts: false,
  isGettingPost: false,
  isDeletingPost: false,
  isCreatingPost: false,
  isDeletingComment: false,
  isCommenting: false,

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
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, is_liked_by_user: true, like_count: p.like_count + 1 } : p,
      ),
      post:
        state.post?.id === postId
          ? { ...state.post, is_liked_by_user: true, like_count: state.post.like_count + 1 }
          : state.post,
    }));

    try {
      await api.post(`/posts/${postId}/like`);
    } catch (error) {
      console.error("Failed to like post", error);
    }
  },

  unlikePost: async (postId: string) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, is_liked_by_user: false, like_count: p.like_count - 1 } : p,
      ),
      post:
        state.post?.id === postId
          ? { ...state.post, is_liked_by_user: false, like_count: state.post.like_count - 1 }
          : state.post,
    }));

    try {
      await api.delete(`/posts/${postId}/unlike`);
    } catch (error) {
      console.error("Failed to unlike post", error);
    }
  },

  deletePost: async (postId: string) => {
    try {
      set({ isDeletingPost: true });
      await api.delete(`/posts/${postId}/delete`);

      set((state) => ({
        posts: state.posts.filter((p) => p.id !== postId),
      }));
    } catch (error) {
      console.error(error);
    } finally {
      set({ isDeletingPost: false });
    }
  },

  getPost: async (postId: string) => {
    try {
      set({ isGettingPost: true });
      const response = await api.get(`/posts/${postId}`);
      set({ post: response.data.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isGettingPost: false });
    }
  },

  commentPost: async (postId: string, commentData: any, authUser: AuthUser) => {
    try {
      set({ isCommenting: true });
      const response = await api.post(`/posts/${postId}/comment`, commentData);

      const newComment = {
        comment_id: response.data.data.id,
        content: response.data.data.content,
        comment_creator_first_name: authUser.first_name,
        comment_creator_last_name: authUser.last_name,
        comment_creator_profile_id: authUser.profile_id,
      };

      set((state) => ({
        post:
          state.post && String(state.post.id) === String(postId)
            ? ({
                ...state.post,
                comments_count: state.post.comments_count + 1,
                post_comments: [newComment, ...(state.post.post_comments || [])] as any,
              } as PostDTO)
            : state.post,

        posts: state.posts.map((p) =>
          String(p.id) === String(postId) ? { ...p, comments_count: p.comments_count + 1 } : p,
        ),
      }));
    } catch (error) {
      console.error(error);
    } finally {
      set({ isCommenting: false });
    }
  },

  deleteComment: async (commentId: string, postId: string) => {
    set({ isDeletingComment: true });
    try {
      await api.delete(`/posts/comment/${commentId}/delete-comment`);

      set((state) => ({
        post:
          state.post && String(state.post.id) === String(postId)
            ? ({
                ...state.post,
                comments_count: Math.max(0, state.post.comments_count - 1),
                post_comments: (state.post.post_comments || []).filter(
                  (comment) => String(comment.comment_id) !== String(commentId),
                ),
              } as PostDTO)
            : state.post,

        posts: state.posts.map((p) =>
          String(p.id) === String(postId) ? { ...p, comments_count: Math.max(0, p.comments_count - 1) } : p,
        ),
      }));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      set({ isDeletingComment: false });
    }
  },

  resetPost: () => {
    set({ post: null });
  },
}));
