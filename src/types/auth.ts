// src/types/auth.ts
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  // Add other Firebase User properties as needed
}