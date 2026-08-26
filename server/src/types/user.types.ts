export interface CreateUserDTO {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  username: string;
  password: string;
}
