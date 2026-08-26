import { sql } from "../lib/db.js";
import * as argon2 from "argon2";
import type { CreateUserDTO, LoginUserDTO } from "../types/user.types.js";
import type { AuthUser, User } from "../types/auth.types.js";

export const createUserService = async (userData: CreateUserDTO) => {
  const { first_name, last_name, username, email, password } = userData;

  if (!first_name || !last_name || !username || !email || !password) {
    throw new Error("All fields are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be 6 characters or more");
  }

  if (!email.includes("@")) {
    throw new Error("Invalid email format");
  }

  const existingUsers = await sql`
    SELECT * FROM users 
    WHERE email=${email} or username=${username}
  `;

  if (existingUsers.length > 0) {
    const conflict = existingUsers[0];
    if (conflict?.email === email) {
      throw new Error("User already exists");
    }
    if (conflict?.username === username) {
      throw new Error("Username already exists");
    }
  }

  const hashedPassword = await argon2.hash(password);

  const [newUser] = await sql`
    INSERT INTO users (first_name, last_name, username, email, password)
    VALUES (${first_name}, ${last_name}, ${username}, ${email}, ${hashedPassword})
    RETURNING id, username, email
    `;

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  const newProfile = await sql`
    INSERT INTO profiles (user_id, first_name, last_name)
    VALUES (${newUser.id}, ${first_name}, ${last_name})
  `;

  if (!newProfile) {
    throw new Error("Failed to create profile");
  }

  return newUser;
};

export const loginService = async (userData: LoginUserDTO) => {
  const { username, password } = userData;

  if (!username || !password) {
    throw new Error("Invalid credentials");
  }

  const [user] = await sql`
        SELECT * FROM users 
        WHERE username=${username}
    `;

  if (!user) {
    throw new Error("User does not exist");
  }

  const verifiedPassword = await argon2.verify(user.password, password);

  if (!verifiedPassword) {
    throw new Error("Credentials do not match");
  }

  const { password: _, ...loggedInUser } = user;

  return loggedInUser;
};

export const getUserById = async (id: string) => {
  const [user] = await sql`
  SELECT 
    u.id, 
    u.username,
    p.current_place_id,
    p.id AS profile_id
  FROM users u
  JOIN profiles p ON u.id = p.user_id
  WHERE u.id = ${id}
`;

  if (!user) {
    throw new Error("User not found");
  }

  return user as AuthUser;
};
