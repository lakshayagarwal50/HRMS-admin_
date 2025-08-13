// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import employeeReducer from "./slice/employeeSlice";
import bankReducer from './slice/bankSlice';
import generalReducer from './slice/generalSlice'; // 1. Import
import professionalReducer from './slice/professionalSlice'; // 2. Import
import departmentReducer from "./slice/departmentSlice"
import designationReducer from './slice/designationSlice'; 
import organizationReducer from './slice/organizationSlice';
import workingPatternsReducer from "./slice/workingPatternsSlice"
import locationsReducer from './slice/locationSlice';
import holidayConfigurationReducer from './slice/holidayconfigurationSlice';
import holidayCalendarReducer from './slice/holidayCalendarSlice';
import  employeeDesignationReducer from './slice/employeeDesignationSlice';
import previousJobReducer from './slice/previousJobSlice';
import loansReducer from './slice/loanAndAdvancesSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees:employeeReducer,
    bank: bankReducer,
    general: generalReducer, // 3. Add
    professional: professionalReducer, // 4. Add
    employee:employeeReducer,
    departments: departmentReducer,
    designations: designationReducer,
    organizationSettings: organizationReducer,
    workingPatterns: workingPatternsReducer,
    locations: locationsReducer,
    holidayConfigurations: holidayConfigurationReducer,
    holidayCalendar: holidayCalendarReducer, 
    employeeDesignations: employeeDesignationReducer,
    previousJobs: previousJobReducer,
    loans: loansReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


