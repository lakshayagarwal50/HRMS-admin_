// src/services/authService.ts

import axios from 'axios';
import type { LoginCredentials, AuthResponse } from '../types/auth'; // We will define these types next

// const API_URL = 'http://localhost:3000/api';
const API_URL = 'http://172.50.5.49:3000/api';

/**
 * @description Sends a POST request to the login endpoint.
 * @param {LoginCredentials} credentials - The user's email and password.
 * @returns {Promise<AuthResponse>} The response from the backend, containing the user's data and token.
 */
export const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

// You can add other auth-related API calls here later, like forgotPassword, etc.


/**
 * @description Sends a POST request to the logout endpoint.
 * @param {string} token - The user's authentication token.
 * @returns {Promise<{ message: string }>} The response from the backend.
 */
export const logoutAPI = async (token: string): Promise<{ message: string }> => {
  const response = await axios.post(
    `${API_URL}/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};