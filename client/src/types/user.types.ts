export interface CreateUserDTO {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  username: string;
  password: string;
}
