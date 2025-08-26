// import {
//   createSlice,
//   createAsyncThunk,
//   isPending,
//   isRejected,
//   type PayloadAction,
// } from "@reduxjs/toolkit";
// import { isAxiosError } from "axios";
// import { axiosInstance } from "../../services";

// // --- CONSTANTS ---
// const API_BASE_URL = "/employees";

// // --- TYPE DEFINITIONS ---
// export interface Employee {
//   id: string;
//   title: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   gender: string;
//   joiningDate: string;
//   department: string;
//   designation: string;
//   role: string;
//   ctc: string;
//   phone: string;
//   leaveType: string;
//   reportingManager: string;
//   location: string;
//   payslipComponent: string;
//   workingPattern: string;
//   holidayGroup: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export type NewEmployee = Omit<Employee, "id" | "createdAt" | "updatedAt">;

// export interface CreateEmployeeState {
//   employees: Employee[];
//   status: "idle" | "loading" | "succeeded" | "failed" | "mutating";
//   error: string | null;
//   createStatus: "idle" | "loading" | "succeeded" | "failed";
//   createError: string | null;
// }

// // --- INITIAL STATE ---
// const initialState: CreateEmployeeState = {
//   employees: [],
//   status: "idle",
//   error: null,
//   createStatus: "idle",
//   createError: null,
// };

// // --- ASYNC THUNKS ---

// // GET /employees - Fetch all employees
// export const fetchEmployees = createAsyncThunk(
//   "createEmployee/fetchEmployees",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(API_BASE_URL);
//       return response.data as Employee[];
//     } catch (error) {
//       if (isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to fetch employees"
//         );
//       }
//       return rejectWithValue("An unknown error occurred.");
//     }
//   }
// );

// // POST /employees - Create a new employee
// export const createEmployee = createAsyncThunk(
//   "createEmployee/createEmployee",
//   async (employeeData: NewEmployee, { rejectWithValue }) => {
//     try {
//       // const response = await axiosInstance.post(API_BASE_URL, employeeData);
//       const response = await axiosInstance.post(`${API_BASE_URL}/create`, employeeData);

//       return response.data as Employee;
//     } catch (error) {
//       if (isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to create employee"
//         );
//       }
//       return rejectWithValue("An unknown error occurred.");
//     }
//   }
// );

// // GET /employees/:id - Fetch single employee
// export const fetchEmployeeById = createAsyncThunk(
//   "createEmployee/fetchEmployeeById",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
//       return response.data as Employee;
//     } catch (error) {
//       if (isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to fetch employee"
//         );
//       }
//       return rejectWithValue("An unknown error occurred.");
//     }
//   }
// );

// // PUT /employees/:id - Update employee
// export const updateEmployee = createAsyncThunk(
//   "createEmployee/updateEmployee",
//   async (employee: Employee, { rejectWithValue }) => {
//     try {
//       const { id, ...updateData } = employee;
//       const response = await axiosInstance.put(
//         `${API_BASE_URL}/${id}`,
//         updateData
//       );
//       return response.data as Employee;
//     } catch (error) {
//       if (isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to update employee"
//         );
//       }
//       return rejectWithValue("An unknown error occurred.");
//     }
//   }
// );

// // DELETE /employees/:id - Delete employee
// export const deleteEmployee = createAsyncThunk(
//   "createEmployee/deleteEmployee",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(`${API_BASE_URL}/${id}`);
//       return id;
//     } catch (error) {
//       if (isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to delete employee"
//         );
//       }
//       return rejectWithValue("An unknown error occurred.");
//     }
//   }
// );

// // --- THE SLICE ---
// const createEmployeeSlice = createSlice({
//   name: "createEmployee",
//   initialState,
//   reducers: {
//     // Reset create status and error
//     resetCreateStatus: (state) => {
//       state.createStatus = "idle";
//       state.createError = null;
//     },
//     // Reset all state
//     resetEmployeeState: (state) => {
//       state.employees = [];
//       state.status = "idle";
//       state.error = null;
//       state.createStatus = "idle";
//       state.createError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Define matchers for mutation operations (create, update, delete)
//     const isMutationPending = (action: PayloadAction<unknown>) =>
//       (action.type.includes("createEmployee/createEmployee") ||
//         action.type.includes("createEmployee/updateEmployee") ||
//         action.type.includes("createEmployee/deleteEmployee")) &&
//       action.type.endsWith("/pending");

//     const isMutationRejected = (action: PayloadAction<unknown>) =>
//       (action.type.includes("createEmployee/createEmployee") ||
//         action.type.includes("createEmployee/updateEmployee") ||
//         action.type.includes("createEmployee/deleteEmployee")) &&
//       action.type.endsWith("/rejected");

//     builder
//       // --- Fetch Employees Cases ---
//       .addCase(fetchEmployees.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(
//         fetchEmployees.fulfilled,
//         (state, action: PayloadAction<Employee[]>) => {
//           state.status = "succeeded";
//           state.employees = action.payload;
//         }
//       )
//       .addCase(fetchEmployees.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       })

//       // --- Fetch Single Employee Cases ---
//       .addCase(fetchEmployeeById.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(
//         fetchEmployeeById.fulfilled,
//         (state, action: PayloadAction<Employee>) => {
//           state.status = "succeeded";
//           const existingIndex = state.employees.findIndex(
//             (emp) => emp.id === action.payload.id
//           );
//           if (existingIndex !== -1) {
//             state.employees[existingIndex] = action.payload;
//           } else {
//             state.employees.push(action.payload);
//           }
//         }
//       )
//       .addCase(fetchEmployeeById.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload as string;
//       })

//       // --- Create Employee Cases ---
//       .addCase(createEmployee.pending, (state) => {
//         state.createStatus = "loading";
//         state.createError = null;
//       })
//       .addCase(
//         createEmployee.fulfilled,
//         (state, action: PayloadAction<Employee>) => {
//           state.createStatus = "succeeded";
//           state.employees.unshift(action.payload); // Add to beginning of array
//         }
//       )
//       .addCase(createEmployee.rejected, (state, action) => {
//         state.createStatus = "failed";
//         state.createError = action.payload as string;
//       })

//       // --- Update Employee Cases ---
//       .addCase(
//         updateEmployee.fulfilled,
//         (state, action: PayloadAction<Employee>) => {
//           state.status = "succeeded";
//           const index = state.employees.findIndex(
//             (emp) => emp.id === action.payload.id
//           );
//           if (index !== -1) {
//             state.employees[index] = action.payload;
//           }
//         }
//       )

//       // --- Delete Employee Cases ---
//       .addCase(
//         deleteEmployee.fulfilled,
//         (state, action: PayloadAction<string>) => {
//           state.status = "succeeded";
//           state.employees = state.employees.filter(
//             (emp) => emp.id !== action.payload
//           );
//         }
//       )

//       // --- Shared Cases for Mutations using matchers ---
//       .addMatcher(isMutationPending, (state) => {
//         if (!state.createStatus || state.createStatus === "idle") {
//           state.status = "mutating";
//           state.error = null;
//         }
//       })
//       .addMatcher(isMutationRejected, (state, action) => {
//         if (!action.type.includes("createEmployee/createEmployee")) {
//           state.status = "failed";
//           state.error = action.payload as string;
//         }
//       });
//   },
// });

// // Export actions
// export const { resetCreateStatus, resetEmployeeState } =
//   createEmployeeSlice.actions;

// // Export reducer
// export default createEmployeeSlice.reducer;

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { axiosInstance } from "../../services";
import type { Employee, NewEmployee } from "./types";

interface CreateEmployeeState {
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError: string | null;
}

const initialState: CreateEmployeeState = {
  createStatus: "idle",
  createError: null,
};

export const createEmployee = createAsyncThunk(
  "employee/create",
  async (employeeData: NewEmployee, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/employees/create", employeeData);
      return response.data as Employee;
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to create employee");
      }
      return rejectWithValue("An unknown error occurred.");
    }
  }
);

const createEmployeeSlice = createSlice({
  name: "createEmployee",
  initialState,
  reducers: {
    resetCreateState: (state) => {
      state.createStatus = "idle";
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmployee.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.createStatus = "succeeded";
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload as string;
      });
  },
});

export const { resetCreateState } = createEmployeeSlice.actions;
export default createEmployeeSlice.reducer;
