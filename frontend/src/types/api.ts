export interface ApiResponse<T> {
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
  code?: string;
}

export interface ApiErrorResponse {
  message?: string;
  detail?: string;
  code?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresAt?: string;
  user?: UserProfile;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  captchaQuestion: string;
  captchaAnswer: string;
}

export interface RefreshRequest {
  /** Only used to migrate an old localStorage session; new sessions use an HttpOnly cookie. */
  refreshToken?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: UserProfile | null;
}
