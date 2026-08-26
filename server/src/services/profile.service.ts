import { sql } from "../lib/db.js";

export const getProfileService = async (profileId: string) => {
  const [userProfile] = await sql`
        SELECT name, username, created_at FROM users
        WHERE id=${profileId}
    `;

  if (!userProfile) {
    throw new Error("Profile does not exists");
  }

  return userProfile;
};

export const followProfile = async (profileId:string) => {
    await sql`
        UPDATE users
        SET
    `
}
