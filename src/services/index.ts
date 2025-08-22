// // src/services/index.ts

// import axios, { AxiosError } from "axios";
// import type { Store } from "@reduxjs/toolkit";
// import type { RootState } from "../store/store";
// import { refreshToken, logoutUser } from "../features/auth/authSlice";

// // The base URL for your API
// const API_BASE_URL = "http://172.50.5.116:3000/";

// // Create the Axios instance
// export const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
// });

// // A flag to prevent multiple token refresh requests
// let isRefreshing = false;
// // A queue to hold requests that failed due to 401
// let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void }> = [];

// const processQueue = (error: AxiosError | null, token: string | null = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// /**
//  * @description Sets up Axios interceptors to handle token injection and refresh logic.
//  * @param store The Redux store instance.
//  */
// export const setupAxiosInterceptors = (store: Store<RootState>) => {
//   // Request interceptor to add the access token to headers
//   axiosInstance.interceptors.request.use(
//     (config) => {
//       const accessToken = store.getState().auth.accessToken;
//       if (accessToken) {
//         config.headers["Authorization"] = `Bearer ${accessToken}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   // Response interceptor to handle 401 errors
//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//       const originalRequest = error.config;

//       // Check for 401 error and ensure it's not a retry request
//       if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
//         if (isRefreshing) {
//           // If a refresh is already in progress, queue the request
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//           .then(token => {
//               originalRequest.headers['Authorization'] = 'Bearer ' + token;
//               return axiosInstance(originalRequest);
//           })
//           .catch(err => {
//               return Promise.reject(err);
//           });
//         }

//         originalRequest.headers['X-Retry'] = 'true';
//         isRefreshing = true;

//         const refreshTokenValue = store.getState().auth.refreshToken;

//         if (refreshTokenValue) {
//           try {
//             // Dispatch the refreshToken thunk
//             const resultAction = await store.dispatch(refreshToken(refreshTokenValue));

//             if (refreshToken.fulfilled.match(resultAction)) {
//               const newAccessToken = resultAction.payload.accessToken;
//               originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//               processQueue(null, newAccessToken);
//               return axiosInstance(originalRequest);
//             } else {
//               // If refresh fails, logout the user
//               store.dispatch(logoutUser());
//               processQueue(error, null);
//               return Promise.reject(error);
//             }
//           } catch (refreshError) {
//             store.dispatch(logoutUser());
//             processQueue(refreshError as AxiosError, null);
//             return Promise.reject(refreshError);
//           } finally {
//             isRefreshing = false;
//           }
//         } else {
//           // No refresh token available, logout
//           store.dispatch(logoutUser());
//           return Promise.reject(error);
//         }
//       }

//       return Promise.reject(error);
//     }
//   );
// };

// src/services/index.ts
// src/services/index.ts

import axios, { AxiosError } from "axios";
import type { AppDispatch, RootState } from "../store/store";
import { refreshToken, logoutUser } from "../features/auth/authSlice";

// Base URL (your API uses the /api prefix)
const API_BASE_URL = "http://172.50.5.49:3000/";

// Create the Axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Prevent multiple refresh calls
let isRefreshing = false;

// Queue requests while token is refreshing
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/**
 * Set up Axios interceptors to inject token and handle refresh flow.
 */
export const setupAxiosInterceptors = (store: {
  dispatch: AppDispatch;
  getState: () => RootState;
}) => {
  // REQUEST: attach access token (but not for login/refresh)
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = store.getState().auth.accessToken;

      const url = config.url ?? "";
      // Avoid sending Authorization on login/refresh
      if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
        return config;
      }

      if (accessToken) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE: handle 401/403 with refresh + queued retries
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;

      const status = error.response?.status;
      const isAuthError = status === 401 || status === 403;

      if (
        isAuthError &&
        originalRequest &&
        !originalRequest.headers?.["X-Retry"]
      ) {
        if (isRefreshing) {
          // Wait for the ongoing refresh to finish
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers["X-Retry"] = "true";
        isRefreshing = true;

        const refreshTokenValue = store.getState().auth.refreshToken;

        if (!refreshTokenValue) {
          store.dispatch(logoutUser());
          return Promise.reject(error);
        }

        try {
          // Refresh the access token
          const resultAction = await store.dispatch(
            refreshToken(refreshTokenValue)
          );

          if (refreshToken.fulfilled.match(resultAction)) {
            const newAccessToken = resultAction.payload.accessToken;

            // Update header for the original request and process the queue
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);

            return axiosInstance(originalRequest);
          } else {
            store.dispatch(logoutUser());
            processQueue(error, null);
            return Promise.reject(error);
          }
        } catch (refreshError) {
          store.dispatch(logoutUser());
          processQueue(refreshError as AxiosError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Not an auth error or already retried
      return Promise.reject(error);
    }
  );
};
