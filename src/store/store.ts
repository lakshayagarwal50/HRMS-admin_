// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import employeeReducer from "./slice/employeeSlice";
import bankReducer from "./slice/bankSlice";
import generalReducer from "./slice/generalSlice"; // 1. Import
import professionalReducer from "./slice/professionalSlice"; // 2. Import
import departmentReducer from "./slice/departmentSlice";
import designationReducer from "./slice/designationSlice";
import organizationReducer from "./slice/organizationSlice";
import workingPatternsReducer from "./slice/workingPatternsSlice";
import locationsReducer from "./slice/locationSlice";
import holidayConfigurationReducer from "./slice/holidayconfigurationSlice";
import holidayCalendarReducer from "./slice/holidayCalendarSlice";
import employeeDesignationReducer from "./slice/employeeDesignationSlice";
import leaveSetupReducer from "./slice/leaveSetupSlice";
import leaveRequestReducer from "./slice/leaveRequestSlice";

import previousJobReducer from "./slice/previousJobSlice";
import loansReducer from "./slice/loanAndAdvancesSlice";

import projectReducer from "./slice/projectSlice";
import webCheckinSettingsReducer from "./slice/webCheckinSettingsSlice";
import sequenceNumberReducer from "./slice/sequenceNumberSlice";
import dsrReducer from "./slice/dsrSlice";
import ratingScaleReducer from "./slice/ratingScaleSlice";
import ratingCriteriaReducer from "./slice/ratingCriteriaSlice";
import salaryStructureReducer from "./slice/salaryStructureSlice";
import salaryComponentReducer from "./slice/salaryComponentSlice";
import payrollReducer from "./slice/payrollSlice";
import attendanceReducer from "./slice/attendanceSlice";
import salaryReducer from './slice/salarySlice';
import recordReducer from './slice/recordSlice';
import employeesRatingReducer from './slice/employeesRatingSlice'
import payrollConfigReducer from './slice/payrollConfigSlice'; //
import loginDetailsReducer from './slice/loginDetailsSlice'; 
import yearlyAttendanceReducer from "./slice/yearlyAttendanceSlice";
import createEmployeeReducer from "./slice/createEmployeeSlice"; 
import roleReducer from './slice/roleSlice';
import reportReducer from "./slice/reportSlice";
import notificationReducer from "./slice/notificationSlice";
import eventsReducer from './slice/eventsSlice';
import employeeSnapshotReducer from './slice/employeeSnapshotSlice';
import employeeRatingDetailReducer from './slice/employeeRatingDetailSlice'
import dashboardReducer from "./slice/dashboardSlice";
import attendanceReportReducer from './slice/attendanceReportSlice';
import payslipSummaryReducer from './slice/payslipSummarySlice';
import leaveReportReducer from "./slice/leaveReportSlice";
import auditHistoryReducer from "./slice/auditHistorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    bank: bankReducer,
    general: generalReducer, // 3. Add
    professional: professionalReducer, // 4. Add
    employee: employeeReducer,
    departments: departmentReducer,
    designations: designationReducer,
    organizationSettings: organizationReducer,
    workingPatterns: workingPatternsReducer,
    locations: locationsReducer,
    holidayConfigurations: holidayConfigurationReducer,
    holidayCalendar: holidayCalendarReducer,
    employeeDesignations: employeeDesignationReducer,
    leaveSetups: leaveSetupReducer,
    previousJobs: previousJobReducer,
    loans: loansReducer,
    project: projectReducer,
    webCheckinSettings: webCheckinSettingsReducer,
    sequenceNumbers: sequenceNumberReducer,
    dsr: dsrReducer,
    ratingScale: ratingScaleReducer,
    ratingCriteria: ratingCriteriaReducer,
    salaryStructures: salaryStructureReducer,
    salaryComponents: salaryComponentReducer,
    payroll: payrollReducer,
    leaveRequests: leaveRequestReducer,
    salary: salaryReducer,
    attendance: attendanceReducer,
    records: recordReducer,
    employeesRating: employeesRatingReducer,
    payrollConfig: payrollConfigReducer,
    loginDetails: loginDetailsReducer,
    yearlyAttendance: yearlyAttendanceReducer,
    createEmployee: createEmployeeReducer,
    roles: roleReducer, 
    reports: reportReducer,
    notifications: notificationReducer, 
    events: eventsReducer, 
    employeeSnapshot: employeeSnapshotReducer,
    employeeRatingDetail: employeeRatingDetailReducer, 
    dashboard: dashboardReducer,
    attendanceReport: attendanceReportReducer,
    payslipSummary: payslipSummaryReducer,
    leaveReport: leaveReportReducer,
    auditHistory: auditHistoryReducer,
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
