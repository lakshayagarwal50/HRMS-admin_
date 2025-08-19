// // src/features/auth/authSlice.ts

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { loginAPI, logoutAPI, refreshTokenAPI } from '../../services/authService';
// import type { LoginCredentials, User } from '../../types/auth';

// interface AuthState {
//   user: User | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: AuthState = {
//   user: null,
//   accessToken: null,
//   refreshToken: null,
//   isAuthenticated: false,
//   isLoading: true, // Start with loading true to handle initial auth check
//   error: null,
// };

// // Async thunk for logging in
// export const loginUser = createAsyncThunk(
//   'auth/login',
//   async (credentials: LoginCredentials, { rejectWithValue }) => {
//     try {
//       const data = await loginAPI(credentials);
//       const user: User = { uid: data.uid, displayName: data.displayName, role: data.role };
//       localStorage.setItem('user', JSON.stringify(user));
//       localStorage.setItem('accessToken', data.accessToken);
//       localStorage.setItem('refreshToken', data.refreshToken);
//       return { ...data, user };
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || 'Failed to login. Please check your credentials.';
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Async thunk for refreshing the token
// export const refreshToken = createAsyncThunk(
//   'auth/refreshToken',
//   async (token: string, { rejectWithValue }) => {
//     try {
//       const data = await refreshTokenAPI(token);
//       localStorage.setItem('accessToken', data.accessToken);
//       return data;
//     } catch (error: any) {
//       // If refresh fails, the user will be logged out by the interceptor
//       return rejectWithValue('Session expired. Please log in again.');
//     }
//   }
// );

// // Async thunk for logging out
// export const logoutUser = createAsyncThunk(
//   'auth/logout',
//   async (_, { rejectWithValue }) => {
//     try {
//       await logoutAPI();
//     } catch (error: any) {
//       // Even if logout API fails, we clear client-side data
//       console.error("Logout API failed, but clearing session locally.", error);
//     } finally {
//         localStorage.removeItem('user');
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     checkAuthStatus: (state) => {
//       const accessToken = localStorage.getItem('accessToken');
//       const refreshToken = localStorage.getItem('refreshToken');
//       const userString = localStorage.getItem('user');

//       if (accessToken && refreshToken && userString) {
//         state.isAuthenticated = true;
//         state.accessToken = accessToken;
//         state.refreshToken = refreshToken;
//         state.user = JSON.parse(userString);
//       }
//       state.isLoading = false; // Auth check is complete
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Login cases
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload.user;
//         state.accessToken = action.payload.accessToken;
//         state.refreshToken = action.payload.refreshToken;
//         state.error = null;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload as string;
//       })
//       // Logout cases
//       .addCase(logoutUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.isLoading = false;
//         state.isAuthenticated = false;
//         state.user = null;
//         state.accessToken = null;
//         state.refreshToken = null;
//         state.error = null;
//       })
//       // Refresh token cases
//       .addCase(refreshToken.fulfilled, (state, action) => {
//         state.accessToken = action.payload.accessToken;
//       })
//       .addCase(refreshToken.rejected, (state) => {
//         // If refresh fails, clear auth state
//         state.isAuthenticated = false;
//         state.user = null;
//         state.accessToken = null;
//         state.refreshToken = null;
//       });
//   },
// });

// export const { checkAuthStatus } = authSlice.actions;
// export default authSlice.reducer;

// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginAPI,
  logoutAPI,
  refreshTokenAPI,
} from "../../services/authService";
import type { LoginCredentials, User } from "../../types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // app starts with auth check
  error: null,
};

// ✅ Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await loginAPI(credentials);
      const user: User = {
        uid: data.uid,
        displayName: data.displayName,
        role: data.role,
      };
      return { ...data, user };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        (typeof error === "string"
          ? error
          : "Failed to login. Please try again.");
      return rejectWithValue(message);
    }
  }
);

// ✅ Refresh token thunk
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await refreshTokenAPI(token);
      return data; // { accessToken }
    } catch {
      return rejectWithValue("Session expired. Please log in again.");
    }
  }
);

// ✅ Logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutAPI();
    } catch (error) {
      console.warn("Logout API failed, clearing session locally.", error);
    }
    // reducers will clear state + localStorage anyway
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuthStatus: (state) => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const userString = localStorage.getItem("user");

      if (accessToken && refreshToken && userString) {
        state.isAuthenticated = true;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = JSON.parse(userString);
      }
      state.isLoading = false; // auth check done
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔑 Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;

        // ✅ save in localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔑 Refresh
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;

        // ✅ update in localStorage
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;

        // ✅ clear storage
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })

      // 🔑 Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;

        // ✅ clear storage
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      });
  },
});

export const { checkAuthStatus } = authSlice.actions;
export default authSlice.reducer;
