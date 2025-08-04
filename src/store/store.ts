// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import employeeReducer from "./slice/employeeSlice";
import bankReducer from './slice/bankSlice';
import generalReducer from './slice/generalSlice'; // 1. Import
import professionalReducer from './slice/professionalSlice'; // 2. Import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees:employeeReducer,
    bank: bankReducer,
    general: generalReducer, // 3. Add
    professional: professionalReducer, // 4. Add
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


