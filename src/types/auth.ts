// src/types/auth.ts

/**
 * @description The shape of the credentials object sent to the login API.
 */
export interface LoginCredentials {
  email: string;
  password:string;
}

/**
 * @description The shape of the successful response from the backend's login API.
 */
export interface AuthResponse {
  message: string;
  uid: string;
  role: string;
  token: string;
}

/**
 * @description The shape of the user object we will store in our Redux state.
 * It's derived from the AuthResponse.
 */
export interface User {
  uid: string;
  role: string;
}

// NOTE: The full AuthState type is now defined directly inside `authSlice.ts`
// for better co-location with its slice. It includes:
// user: User | null;
// token: string | null;
// isAuthenticated: boolean;
// isLoading: boolean;
// error: string | null;