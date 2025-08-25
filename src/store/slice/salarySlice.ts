import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
// --- CHANGE HERE: Use the custom axios instance ---
import { axiosInstance } from "../../services"; // Adjust this path if necessary

// 1. --- DEFINE TYPES ---
// Describes a single salary item (e.g., Basic, Provident Fund)
interface SalaryComponent {
  name: string;
  code: string;
  value: string;
  amount: string;
}

// Describes the structure of the entire API response
interface SalaryComponentsResponse {
  EARNING: SalaryComponent[];
  STATUTORIES: SalaryComponent[];
}

// Describes the state shape for this slice
interface SalaryState {
  components: SalaryComponentsResponse | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

// 2. --- SET INITIAL STATE ---
const initialState: SalaryState = {
  components: null,
  loading: "idle",
  error: null,
};

// 3. --- CREATE ASYNC THUNK FOR API CALL ---
// This function handles the asynchronous logic of fetching the data.
export const fetchSalaryComponents = createAsyncThunk<
  SalaryComponentsResponse, // This is what the thunk will return on success
  string,                   // This is the type of the argument we pass in (the groupname)
  { rejectValue: string }   // This is the type for the error payload on failure
>(
  "salary/fetchComponents",
  async (groupname, { rejectWithValue }) => {
    try {
      // --- CHANGE HERE: Use the custom axios instance for the API call ---
      const response = await axiosInstance.get<SalaryComponentsResponse>(
        `/employees/component/${groupname}`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "An unexpected error occurred while fetching salary components";
      // The rejected value will be available in the action.payload of the .rejected case
      return rejectWithValue(errorMessage);
    }
  }
);

// 4. --- CREATE THE SLICE ---
const salarySlice = createSlice({
  name: "salary",
  initialState,
  // No regular reducers needed for this case
  reducers: {},
  // 'extraReducers' handle actions from createAsyncThunk
  extraReducers: (builder) => {
    builder
      // Case for when the API call is in progress
      .addCase(fetchSalaryComponents.pending, (state) => {
        state.loading = "pending";
        state.components = null;
        state.error = null;
      })
      // Case for when the API call succeeds
      .addCase(
        fetchSalaryComponents.fulfilled,
        (state, action: PayloadAction<SalaryComponentsResponse>) => {
          state.loading = "succeeded";
          state.components = action.payload;
        }
      )
      // Case for when the API call fails
      .addCase(fetchSalaryComponents.rejected, (state, action) => {
        state.loading = "failed";
        // The error message comes from the `rejectWithValue` call in the thunk
        state.error = action.payload ?? "Failed to fetch data";
      });
  },
});

export default salarySlice.reducer;
