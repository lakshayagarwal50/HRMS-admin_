// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
// import employeeReducer from "../features/employee/employeeSlice";
import employeeReducer from "./slice/employeeSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee:employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;