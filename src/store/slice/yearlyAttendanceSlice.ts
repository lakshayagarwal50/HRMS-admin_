//import
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//interface
interface YearlyAttendanceState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: YearlyAttendanceState = {
  data: null,
  loading: false,
  error: null,
};

//thunk for yearly attendance fetch
export const fetchYearlyAttendance = createAsyncThunk(
  "yearlyAttendance/fetchYearlyAttendance",
  async ({ year, empCode }: { year: number; empCode: string }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://172.50.5.49:3000/employees/getYearly/${year}/${empCode}`
      );
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch yearly attendance");
    }
  }
);

//slice
const yearlyAttendanceSlice = createSlice({
  name: "yearlyAttendance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchYearlyAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchYearlyAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchYearlyAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default yearlyAttendanceSlice.reducer;
