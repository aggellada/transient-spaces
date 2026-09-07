import { sql } from "../lib/db.js";
import type { AuthUser } from "../types/auth.types.js";
import type { CreatePostDTO } from "../types/posts.types.js";

export const getAllPostsService = async (placeId: string, profile_id?: string) => {
  // Convert undefined to a SQL-safe null for guests
  const safeProfileId = profile_id || null;

  const posts = await sql`
    SELECT 
      posts.id,
      posts.title, 
      posts.description, 
      posts.created_at,
      profiles.first_name AS creator_first_name,
      profiles.last_name AS creator_last_name,
      
      (SELECT COUNT(*)::int FROM post_likes WHERE post_likes.post_id = posts.id) AS like_count,
      (SELECT COUNT(*)::int FROM post_comments WHERE post_comments.post_id = posts.id) as comments_count,
      -- Added ::uuid cast to prevent Postgres type errors when safeProfileId is null
      EXISTS (
        SELECT 1 FROM post_likes 
        WHERE post_likes.post_id = posts.id AND post_likes.profile_id = ${safeProfileId}::uuid
      ) AS is_liked_by_user,

      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'content', post_comments.content,
              'comment_creator_first_name', comment_authors.first_name,
              'comment_creator_last_name', comment_authors.last_name
            )
          ) 
          FROM post_comments 
          JOIN profiles AS comment_authors ON post_comments.profile_id = comment_authors.id
          WHERE post_comments.post_id = posts.id
        ), 
        '[]'::json
      ) AS post_comments

    FROM posts
    JOIN profiles ON posts.creator_id = profiles.id
    
    -- Added the filter to only fetch posts for the current transient place
    WHERE posts.place_id = ${placeId}
    
    ORDER BY posts.created_at DESC
    LIMIT 10;
  `;

  return posts;
};

export const createPostService = async (postData: CreatePostDTO, user: AuthUser) => {
  const { title, description } = postData;
  const { profile_id, current_place_id } = user;

  if (!title || !description) {
    throw new Error("Title and description are required");
  }

  if (!profile_id || !current_place_id) {
    throw new Error("Unauthorized: Creator ID and transient place is required");
  }

  const [newPost] = await sql`
    INSERT INTO posts (creator_id, title, description, place_id)
        VALUES (${profile_id}, ${title}, ${description}, ${current_place_id})
        RETURNING *
    `;

  if (!newPost) {
    throw new Error("Failed to create a new post");
  }

  return newPost;
};

export const deletePostService = async (postId: string, profileId: string) => {
  const [deletedPost] = await sql`
    DELETE FROM posts
    WHERE id=${postId} AND creator_id=${profileId}
    RETURNING *
  `;

  if (!deletedPost) {
    throw new Error("Post not found or you do not have permission to delete it");
  }

  return deletedPost;
};

export const editPostService = async (postData: CreatePostDTO, profileId: string, postId: string) => {
  const { title, description } = postData;

  const [editedPost] = await sql`
    UPDATE posts
    SET title=${title}, description=${description}
    WHERE id=${postId} AND creator_id=${profileId}
    RETURNING *;
  `;

  if (!editedPost) {
    throw new Error("Post not found or you do not have permission to edit it");
  }

  return editedPost;
};

export const likePostService = async (profileId: string, postId: string) => {
  const [like] = await sql`
    INSERT INTO post_likes (profile_id, post_id)
    VALUES (${profileId}, ${postId})
    ON CONFLICT (profile_id, post_id) DO NOTHING
    RETURNING *;
  `;

  return !!like;
};

export const unlikePostService = async (profileId: string, postId: string) => {
  const [unlike] = await sql`
    DELETE FROM post_likes
    WHERE profile_id = ${profileId} AND post_id = ${postId}
    RETURNING *;
  `;

  return !!unlike;
};

export const commentPostService = async (profileId: string, postId: string, content: string) => {
  const [commentPost] = await sql`
    INSERT INTO post_comments (profile_id, post_id, content)
    VALUES (${profileId}, ${postId}, ${content})
    RETURNING *
  `;

  if (!commentPost) {
    throw new Error("Failed to comment on post");
  }

  return commentPost;
};

export const getPostService = async (postId: string) => {
  const [post] = await sql`
    SELECT 
      posts.id,
      posts.title,
      posts.description,
      profiles.id AS profile_id,
      (SELECT COUNT(*)::int FROM post_likes WHERE post_likes.post_id = posts.id) AS like_count,
      (SELECT COUNT(*)::int FROM post_comments WHERE post_comments.post_id = posts.id) as comments_count,
      profiles.first_name as creator_first_name,
      profiles.last_name creator_last_name,
      profiles.avatar_url,
      COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'comment_id', post_comments.id,
              'content', post_comments.content,
              'comment_creator_first_name', comment_authors.first_name,
              'comment_creator_last_name', comment_authors.last_name
            )
          ) 
          FROM post_comments 
          JOIN profiles AS comment_authors ON post_comments.profile_id = comment_authors.id
          WHERE post_comments.post_id = posts.id
        ), 
        '[]'::json
      ) AS post_comments
    FROM posts
    JOIN profiles ON posts.creator_id = profiles.id
    WHERE posts.id = ${postId} 
  `;

  if (!post) {
    throw new Error("Failed to fetch post.");
  }

  return post;
};
