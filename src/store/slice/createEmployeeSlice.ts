

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
