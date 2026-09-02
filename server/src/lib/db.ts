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
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // add username
    const PROFILES_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        bio TEXT,
        avatar_url TEXT,
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
        creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const POST_COMMENTS_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS post_comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content TEXT NOT NULL,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const FOLLOWS_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS follows (
        follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (follower_id, following_id)
      );
    `;

    const POST_LIKES_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS post_likes (
        profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (profile_id, post_id)
      )
    `;

    const CHAT_ROOMS_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS chat_rooms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        user2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        CHECK (user1_id < user2_id),
        UNIQUE (user1_id, user2_id)
      )
    `;

    const MESSAGES_TABLE = await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chat_room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
        content TEXT NOT NULL,

        sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
        receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Database Initialized successfully.");
  } catch (error) {
    console.error("Database query failed:", error);
  }
};
