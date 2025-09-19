// import axios, { AxiosError } from "axios";
// import type { AppDispatch, RootState } from "../store/store";
// import { refreshToken, logoutUser } from "../features/auth/authSlice";


// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// export const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
// });

// // Prevent multiple refresh calls
// let isRefreshing = false;

// // Queue requests while token is refreshing
// let failedQueue: Array<{
//   resolve: (value: unknown) => void;
//   reject: (reason?: any) => void;
// }> = [];

// const processQueue = (
//   error: AxiosError | null,
//   token: string | null = null
// ) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

// /**
//  * Set up Axios interceptors to inject token and handle refresh flow.
//  */
// export const setupAxiosInterceptors = (store: {
//   dispatch: AppDispatch;
//   getState: () => RootState;
// }) => {
//   // REQUEST: attach access token (but not for login/refresh)
//   axiosInstance.interceptors.request.use(
//     (config) => {
//       const accessToken = store.getState().auth.accessToken;

//       const url = config.url ?? "";
//       // Avoid sending Authorization on login/refresh
//       if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
//         return config;
//       }

//       if (accessToken) {
//         config.headers = config.headers ?? {};
//         (config.headers as Record<string, string>)[
//           "Authorization"
//         ] = `Bearer ${accessToken}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   // RESPONSE: handle 401/403 with refresh + queued retries
//   axiosInstance.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//       const originalRequest = error.config as any;

//       const status = error.response?.status;
//       const isAuthError = status === 401 || status === 403;

//       if (
//         isAuthError &&
//         originalRequest &&
//         !originalRequest.headers?.["X-Retry"]
//       ) {
//         if (isRefreshing) {
//           // Wait for the ongoing refresh to finish
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//             .then((token) => {
//               originalRequest.headers["Authorization"] = "Bearer " + token;
//               return axiosInstance(originalRequest);
//             })
//             .catch((err) => Promise.reject(err));
//         }

//         originalRequest.headers = originalRequest.headers ?? {};
//         originalRequest.headers["X-Retry"] = "true";
//         isRefreshing = true;

//         const refreshTokenValue = store.getState().auth.refreshToken;

//         if (!refreshTokenValue) {
//           store.dispatch(logoutUser());
//           return Promise.reject(error);
//         }

//         try {
//           // Refresh the access token
//           const resultAction = await store.dispatch(
//             refreshToken(refreshTokenValue)
//           );

//           if (refreshToken.fulfilled.match(resultAction)) {
//             const newAccessToken = resultAction.payload.accessToken;

//             // Update header for the original request and process the queue
//             originalRequest.headers[
//               "Authorization"
//             ] = `Bearer ${newAccessToken}`;
//             processQueue(null, newAccessToken);

//             return axiosInstance(originalRequest);
//           } else {
//             store.dispatch(logoutUser());
//             processQueue(error, null);
//             return Promise.reject(error);
//           }
//         } catch (refreshError) {
//           store.dispatch(logoutUser());
//           processQueue(refreshError as AxiosError, null);
//           return Promise.reject(refreshError);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       // Not an auth error or already retried
//       return Promise.reject(error);
//     }
//   );
// };

// // import axios, { AxiosError } from "axios";
// // import type { AppDispatch, RootState } from "../store/store";
// // import { refreshToken, logoutUser } from "../features/auth/authSlice";


// // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// // export const axiosInstance = axios.create({
// //   baseURL: API_BASE_URL,
// // });

// // // Prevent multiple refresh calls
// // let isRefreshing = false;

// // // Queue requests while token is refreshing
// // let failedQueue: Array<{
// //   resolve: (value: unknown) => void;
// //   reject: (reason?: any) => void;
// // }> = [];

// // const processQueue = (
// //   error: AxiosError | null,
// //   token: string | null = null
// // ) => {
// //   failedQueue.forEach((prom) => {
// //     if (error) prom.reject(error);
// //     else prom.resolve(token);
// //   });
// //   failedQueue = [];
// // };

// // /**
// //  * Set up Axios interceptors to inject token and handle refresh flow.
// //  */
// // export const setupAxiosInterceptors = (store: {
// //   dispatch: AppDispatch;
// //   getState: () => RootState;
// // }) => {
// //   // REQUEST: attach access token (but not for login/refresh)
// //   axiosInstance.interceptors.request.use(
// //     (config) => {
// //       const accessToken = store.getState().auth.accessToken;

// //       const url = config.url ?? "";
// //       // Avoid sending Authorization on login/refresh
// //       if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
// //         return config;
// //       }

// //       if (accessToken) {
// //         config.headers = config.headers ?? {};
// //         (config.headers as Record<string, string>)[
// //           "Authorization"
// //         ] = `Bearer ${accessToken}`;
// //       }
// //       return config;
// //     },
// //     (error) => Promise.reject(error)
// //   );

// //   // RESPONSE: handle 401/403 with refresh + queued retries
// //   axiosInstance.interceptors.response.use(
// //     (response) => response,
// //     async (error: AxiosError) => {
// //       const originalRequest = error.config as any;

// //       const status = error.response?.status;
// //       const isAuthError = status === 401 || status === 403;

// //       // Avoid infinite loop: do not attempt refresh for login or refresh endpoints
// //       const url = originalRequest?.url ?? "";
// //       if (isAuthError && (url.includes("/auth/login") || url.includes("/auth/refresh"))) {
// //         console.log('Auth error on login or refresh - rejecting');
// //         return Promise.reject(error);
// //       }

// //       if (
// //         isAuthError &&
// //         originalRequest &&
// //         !originalRequest.headers?.["X-Retry"]
// //       ) {
// //         if (isRefreshing) {
// //           // Wait for the ongoing refresh to finish
// //           return new Promise((resolve, reject) => {
// //             failedQueue.push({ resolve, reject });
// //           })
// //             .then((token) => {
// //               originalRequest.headers["Authorization"] = "Bearer " + token;
// //               return axiosInstance(originalRequest);
// //             })
// //             .catch((err) => Promise.reject(err));
// //         }

// //         originalRequest.headers = originalRequest.headers ?? {};
// //         originalRequest.headers["X-Retry"] = "true";
// //         isRefreshing = true;

// //         const refreshTokenValue = store.getState().auth.refreshToken;

// //         if (!refreshTokenValue) {
// //           console.log('No refresh token - logging out');
// //           store.dispatch(logoutUser());
// //           return Promise.reject(error);
// //         }

// //         try {
// //           console.log('Attempting refresh');
// //           // Refresh the access token
// //           const payload = await store.dispatch(
// //             refreshToken(refreshTokenValue)
// //           );
// //           // Since it's fulfilled, payload is the successful result
// //           const newAccessToken = payload.accessToken;

// //           console.log('Refresh successful');
// //           // Update header for the original request and process the queue
// //           originalRequest.headers[
// //             "Authorization"
// //           ] = `Bearer ${newAccessToken}`;
// //           processQueue(null, newAccessToken);

// //           return axiosInstance(originalRequest);
// //         } catch (refreshError) {
// //           console.log('Refresh failed - clearing storage and reloading', refreshError);
// //           // Clear storage manually in case logout fails
// //           localStorage.removeItem("accessToken");
// //           localStorage.removeItem("refreshToken");
// //           localStorage.removeItem("user");
// //           // Optionally dispatch logout, but it may fail
// //           store.dispatch(logoutUser());
// //           window.location.reload();
// //           processQueue(refreshError as AxiosError, null);
// //           return Promise.reject(refreshError);
// //         } finally {
// //           isRefreshing = false;
// //         }
// //       }

// //       // Not an auth error or already retried
// //       return Promise.reject(error);
// //     }
// //   );
// // };


// src/services/index.ts
import axios, { AxiosError } from "axios";
import type { AppDispatch, RootState } from "../store/store";
import { refreshToken, logoutUser } from "../features/auth/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

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

      const url = originalRequest?.url ?? "";

      // FIX: don't trigger refresh/logout if this is a login or refresh request
      if (isAuthError && (url.includes("/auth/login") || url.includes("/auth/refresh"))) {
        return Promise.reject(error);
      }

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
