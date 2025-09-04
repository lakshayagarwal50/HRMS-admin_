// src/services/authService.ts

import { axiosInstance } from './index'; // Import the centralized axios instance
import type { LoginCredentials, AuthResponse, RefreshTokenResponse } from '../types/auth';

/**
 * @description Sends a POST request to the login endpoint.
 * @param credentials The user's email and password.
 */
export const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

/**
 * @description Sends a POST request to refresh the access token.
 * @param refreshToken The user's refresh token.
 */
export const refreshTokenAPI = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.post('/auth/refresh', { refreshToken });
  return response.data;
};


/**
 * @description Sends a POST request to the logout endpoint.
 */
export const logoutAPI = async (): Promise<{ message: string }> => {
  // The interceptor will add the Authorization header
  const response = await axiosInstance.post('/auth/logout', {});
  return response.data;
};