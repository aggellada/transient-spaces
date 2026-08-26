import { sql } from "../lib/db.js";
import * as argon2 from "argon2";
import type { CreateUserDTO, LoginUserDTO } from "../types/user.types.js";
import type { AuthUser, User } from "../types/auth.types.js";

export const createUserService = async (userData: CreateUserDTO) => {
  const { name, username, email, password } = userData;

  if (!name || !username || !email || !password) {
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

  const newUser = await sql`
    INSERT INTO users (name, username, email, password)
    VALUES (${name}, ${username}, ${email}, ${hashedPassword})
    RETURNING username, name, email`;

  return newUser[0];
};

export const loginService = async (userData: LoginUserDTO) => {
  const { username, password } = userData;

  const user = (await sql`
        SELECT * FROM users 
        WHERE username=${username}
    `) as User[];

  if (user.length === 0) {
    throw new Error("User does not exist");
  }

  const verifiedPassword = await argon2.verify(user[0]?.password!, password);

  if (!verifiedPassword) {
    throw new Error("Credentials do not match");
  }

  const { password: _, ...loggedInUser } = user[0]!;

  return loggedInUser;
};

export const getUserById = async (id: string): Promise<AuthUser | null> => {
  const users = await sql`
      SELECT id, username, name, current_place_id FROM users 
      WHERE id=${id}
  `;

  if (users.length === 0) {
    throw new Error("User not found");
  }

  return users[0] as AuthUser;
};
