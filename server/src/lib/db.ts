import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

export const initDb = async (): Promise<void> => {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS postgis`;

    const TRANSIENT_PLACES_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS transient_places (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        geo_shape JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const USERS_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        current_place_id UUID REFERENCES transient_places(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const POSTS_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        place_id UUID REFERENCES transient_places(id) ON DELETE CASCADE,
        creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const POST_COMMENTS_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS post_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const PROFILES_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id REFERENCES users(id) ON DELETE CASCADE,
        profile_following REFERENCES profile_following(profile_following_id) ON DELETE CASCADE,
        profile_followers REFERENCES profile_follower(profile_follower_id) ON DELETE CASCADE,
        -- profile_posts REFERENCES posts()
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const PROFILE_FOLLOWING_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS profile_following (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        profile_id REFERENCES profiles(id) ON DELETE CASCADE,
        profile_following_id REFERENCES profiles(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const PROFILE_FOLLOWER_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS profile_follower (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        profile_id REFERENCES profiles(id) ON DELETE CASCADE,
        profile_follower_id REFERENCES profiles(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const POST_LIKES_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS post_likes (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, post_id)
      )
    `;

    console.log("Database Initialized successfully.");
  } catch (error) {
    console.error("Database query failed:", error);
  }
};
