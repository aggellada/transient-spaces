export interface AuthUser {
  id: string;
  username: string;
  current_place_id: string | null;
  profile_id: string;
  first_name: string;
  last_name: string;
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

export interface LoginData {
  username: string;
  password: string;
}
