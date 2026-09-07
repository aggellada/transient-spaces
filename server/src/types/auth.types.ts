import type { JwtPayload } from "jsonwebtoken";

export interface DecodedToken extends JwtPayload {
  id: string;
}

export interface AuthUser {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  current_place_id: string | null;
  profile_id: string;
}

export interface User {
  id: string;
  name: string;
  password: string;
  username: string;
  email: string;
  current_place_id: string;
  created_at: string;
}
