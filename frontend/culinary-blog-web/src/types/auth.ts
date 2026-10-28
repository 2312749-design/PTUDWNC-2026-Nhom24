export type UserRole = "Admin" | "Author";

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface Profile extends AuthUser {
  bio: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresAt: string;
  user: AuthUser;
}

export interface UpdateProfileRequest {
  displayName: string;
  bio: string;
  avatarUrl: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
