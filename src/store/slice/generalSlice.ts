// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { fetchEmployeeDetails } from './employeeSlice';


// interface GeneralInfoPayload {
  
//   [key: string]: any;
// }

// interface ApiResponse {
//     message: string;
// }

// interface GeneralState {
//   submitting: boolean;
//   error: string | null;
// }

// const initialState: GeneralState = {
//   submitting: false,
//   error: null,
// };

// export const updateGeneralInfo = createAsyncThunk<
//   ApiResponse,
//   { generalId: string; empCode: string; generalData: GeneralInfoPayload },
//   { rejectValue: string }
// >(
//   'general/updateDetails',
//   async ({ generalId, empCode, generalData }, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await axios.patch(
//         `http://localhost:3000/employees/general/${generalId}`,
//         generalData
//       );
//       // On success, refresh all employee data
//       dispatch(fetchEmployeeDetails(empCode));
//       return response.data as ApiResponse;
//     } catch (error) {
//        if (axios.isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to update general info.');
//       }
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// const generalSlice = createSlice({
//   name: 'general',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(updateGeneralInfo.pending, (state) => { state.submitting = true; state.error = null; })
//       .addCase(updateGeneralInfo.fulfilled, (state) => { state.submitting = false; })
//       .addCase(updateGeneralInfo.rejected, (state, action) => { state.submitting = false; state.error = action.payload as string; });
//   },
// });

// export default generalSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';
import { fetchEmployeeDetails } from './employeeSlice';

// --- CONSTANTS ---
const API_BASE_URL = 'http://172.50.5.49:3000/employees';

// --- HELPER FUNCTION ---
/**
 * Retrieves the Firebase ID token from local storage.
 * @returns {string | null} The token or null if not found.
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('token'); // Ensure the key matches your auth logic
};

// --- INTERFACES ---
interface GeneralInfoPayload {
  [key: string]: any;
}

interface ApiResponse {
  message: string;
}

interface GeneralState {
  submitting: boolean;
  error: string | null;
}

const initialState: GeneralState = {
  submitting: false,
  error: null,
};

// --- ASYNC THUNKS ---
export const updateGeneralInfo = createAsyncThunk<
  ApiResponse,
  { generalId: string; empCode: string; generalData: GeneralInfoPayload },
  { rejectValue: string }
>(
  'general/updateDetails',
  async ({ generalId, empCode, generalData }, { dispatch, rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/general/${generalId}`,
        generalData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // On success, refresh all employee data
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update general info.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// --- SLICE DEFINITION ---
const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateGeneralInfo.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateGeneralInfo.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateGeneralInfo.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export default generalSlice.reducer;