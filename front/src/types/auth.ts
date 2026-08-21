export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}
