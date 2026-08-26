import { sql } from "../lib/db.js";

export const searchProfileService = async (profileId: string) => {
  // Get following, followers, posts table in this query
  const [userProfile] = await sql`
        SELECT first_name, last_name, created_at
        JOIN follows f, posts p ON f.profile_id=profiles.id, p.profile_id=profiles.id
        FROM profiles 
        WHERE id=${profileId}
    `;

  if (!userProfile) {
    throw new Error("Profile does not exists");
  }

  return userProfile;
};

export const followProfileService = async (follower_id: string, following_id: string) => {
  const [followedUser] = await sql`
    INSERT INTO follows (follower_id, following_id)
    VALUES (${follower_id}, ${following_id})
    ON CONFLICT (follower_id, following_id) DO NOTHING
    RETURNING *;
    `;

  return !!followedUser;
};

export const unfollowProfileService = async (follower_id: string, following_id: string) => {
  const [unfollowedUser] = await sql`
    DELETE FROM follows
    WHERE follower_id=${follower_id} AND following_id=${following_id}
    RETURNING *;
    `;

  return !!unfollowedUser;
};
