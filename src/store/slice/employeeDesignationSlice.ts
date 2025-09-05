

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type PayloadAction } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import { axiosInstance } from "../../services"; // Use the configured axios instance

// 🔧 API URL for designations (relative path)
const API_URL = "/designations/get";



export interface Designation {
  designationName: string;
  id: string;
  name: string;
  code: string;
  description: string;
  department: string;
  status: "active" | "inactive";
  createdBy: string;
  createdAt: string;
}


export interface EmployeeDesignationsState {
  items: Designation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}


const initialState: EmployeeDesignationsState = {
  items: [],
  status: "idle",
  error: null,
};


export const fetchEmployeeDesignations = createAsyncThunk(
  "employeeDesignations/fetchEmployeeDesignations",
  async (department: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_URL, {
        params: { department },
      });
      return response.data as Designation[];
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch designations"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);


const employeeDesignationSlice = createSlice({
  name: "employeeDesignations",
  initialState,
  reducers: {
    resetEmployeeDesignations: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeDesignations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchEmployeeDesignations.fulfilled,
        (state, action: PayloadAction<Designation[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchEmployeeDesignations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetEmployeeDesignations } = employeeDesignationSlice.actions;
export default employeeDesignationSlice.reducer;
