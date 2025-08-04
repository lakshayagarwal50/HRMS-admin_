// // src/features/auth/authSlice.ts
// import { createSlice } from '@reduxjs/toolkit';
// import type { AuthState } from '../../types/auth';

// const initialState: AuthState = {
//   user: null,
//   loading: true,
//   error: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//       state.loading = false;
//     },
//     setLoading: (state) => {
//       state.loading = true;
//     },
//   },
// });

// export const { setUser, setError, setLoading } = authSlice.actions;
// export default authSlice.reducer;

// src/features/auth/authSlice.ts


// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, logoutAPI } from '../../services/authService';
import type { LoginCredentials, User } from '../../types/auth';

// Define the shape of our authentication state
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// The initial state when the app loads
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunk for logging in
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials);
      // On successful login, store user info and token in localStorage
      localStorage.setItem('user', JSON.stringify({ uid: data.uid, role: data.role }));
      localStorage.setItem('token', data.token);
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to login. Please check your credentials.';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for logging out
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      if (!token) {
        throw new Error('No token found');
      }
      const data = await logoutAPI(token);
      // Clear localStorage on successful logout
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to logout. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to check auth status on app load
    checkAuthStatus: (state) => {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      // If token and user data exist in localStorage, we consider the user logged in
      if (token && userString) {
        state.isAuthenticated = true;
        state.token = token;
        state.user = JSON.parse(userString);
      }
      // This is to stop any initial loading spinners
      state.isLoading = false;
    },
  },
  // Handles the state changes based on the async thunk's lifecycle
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = { uid: action.payload.uid, role: action.payload.role };
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { checkAuthStatus } = authSlice.actions;
export default authSlice.reducer;