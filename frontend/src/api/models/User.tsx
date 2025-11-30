export interface User {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  full_name: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  password_confirm: string;
  full_name: string;
  email: string;
  phone_number: string;
}

export interface RegisterResponse {
  user: User;
  access: string;
  refresh: string;
}
