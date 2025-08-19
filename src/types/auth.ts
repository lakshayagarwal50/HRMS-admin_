// src/types/auth.ts

/**
 * @description The shape of the credentials object sent to the login API.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * @description The shape of the successful response from the backend's login API.
 */
export interface AuthResponse {
  message: string;
  uid: string;
  displayName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * @description The shape of the response from the refresh token endpoint.
 */
export interface RefreshTokenResponse {
  accessToken: string;
}

/**
 * @description The shape of the user object we will store in our Redux state.
 * It's derived from the AuthResponse.
 */
export interface User {
  uid: string;
  displayName: string;
  role: string;
}