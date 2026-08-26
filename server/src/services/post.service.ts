import { sql } from "../lib/db.js";
import type { AuthUser } from "../types/auth.types.js";
import type { CreatePostDTO } from "../types/posts.types.js";

export const getAllPostsService = async (currentUserId: string) => {
  const posts = await sql`
    SELECT 
      posts.id,
      posts.title, 
      posts.description, 
      posts.created_at,
      users.username AS creator_username,
      users.name AS creator_name,
      
      (SELECT COUNT(*)::int FROM post_likes WHERE post_likes.post_id = posts.id) AS like_count,
      
      EXISTS (
        SELECT 1 FROM post_likes 
        WHERE post_likes.post_id = posts.id AND post_likes.user_id = ${currentUserId}
      ) AS is_liked_by_user,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'content', post_comments.content,
              'comment_creator_name', comment_authors.name
            )
          ) 
          FROM post_comments 
          JOIN users AS comment_authors ON post_comments.user_id = comment_authors.id
          WHERE post_comments.post_id = posts.id
        ), 
        '[]'::json
      ) AS post_comments

    FROM posts
    JOIN users ON posts.creator_id = users.id
    ORDER BY posts.created_at DESC
    LIMIT 10;
`;

  return posts;
};

export const createPostService = async (postData: CreatePostDTO, user: AuthUser) => {
  const { title, description } = postData;
  const { id, current_place_id } = user;

  if (!title || !description) {
    throw new Error("Title and description are required");
  }

  if (!id || !current_place_id) {
    throw new Error("Unauthorized: Creator ID and transient place is required");
  }

  const newPost = await sql`
    INSERT INTO posts ( creator_id, title, description, place_id)
        VALUES (${user.id}, ${title}, ${description}, ${user.current_place_id})
        RETURNING *
    `;

  if (newPost.length === 0) {
    throw new Error("Failed to create a new post");
  }

  return newPost[0];
};

export const deletePostService = async (postId: string, userId: string) => {
  const [deletedPost] = await sql`
    DELETE FROM posts
    WHERE id=${postId} AND creator_id=${userId}
    RETURNING *
  `;

  if (!deletedPost) {
    throw new Error("Post not found or you do not have permission to delete it");
  }

  return deletedPost;
};

export const editPostService = async (postData: CreatePostDTO, userId: string, postId: string) => {
  const { title, description } = postData;

  const [editedPost] = await sql`
    UPDATE posts
    SET title=${title}, description=${description}
    WHERE id=${postId} AND creator_id=${userId}
    RETURNING *;
  `;

  if (!editedPost) {
    throw new Error("Post not found or you do not have permission to edit it");
  }

  return editedPost;
};

export const likePostService = async (userId: string, postId: string) => {
  const likePost = await sql`
    INSERT INTO post_likes (user_id, post_id)
    VALUES (${userId}, ${postId})
  `;

  if (!likePost) {
    throw new Error("Failed to like post");
  }
};

export const unlikePostService = async (userId: string, postId: string) => {
  const unlikePost = await sql`
    DELETE FROM post_likes
    WHERE user_id = ${userId} AND post_id = ${postId}
  `;

  if (!unlikePost) {
    throw new Error("Failed to unlike post");
  }
};

export const commentPostService = async (userId: string, postId: string, content: string) => {
  const commentPost = await sql`
    INSERT INTO post_comments (user_id, post_id, content)
    VALUES (${userId}, ${postId}, ${content})
  `;

  if (!commentPost) {
    throw new Error("Failed to comment on post");
  }
};
