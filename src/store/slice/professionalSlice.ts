// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { fetchEmployeeDetails } from './employeeSlice';


// interface ProfessionalInfoPayload {
//   [key: string]: any;
// }

// interface ApiResponse {
//     message: string;
// }

// interface ProfessionalState {
//   submitting: boolean;
//   error: string | null;
// }

// const initialState: ProfessionalState = {
//   submitting: false,
//   error: null,
// };

// export const updateProfessionalInfo = createAsyncThunk<
//   ApiResponse,
//   { professionalId: string; empCode: string; professionalData: ProfessionalInfoPayload },
//   { rejectValue: string }
// >(
//   'professional/updateDetails',
//   async ({ professionalId, empCode, professionalData }, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await axios.patch(
//         `http://localhost:3000/employees/professional/${professionalId}`,
//         professionalData
//       );
//       dispatch(fetchEmployeeDetails(empCode));
//       return response.data as ApiResponse;
//     } catch (error) {
//        if (axios.isAxiosError(error) && error.response) {
//         return rejectWithValue(error.response.data?.message || 'Failed to update professional info.');
//       }
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// const professionalSlice = createSlice({
//   name: 'professional',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(updateProfessionalInfo.pending, (state) => { state.submitting = true; state.error = null; })
//       .addCase(updateProfessionalInfo.fulfilled, (state) => { state.submitting = false; })
//       .addCase(updateProfessionalInfo.rejected, (state, action) => { state.submitting = false; state.error = action.payload as string; });
//   },
// });

// export default professionalSlice.reducer;


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
interface ProfessionalInfoPayload {
  [key: string]: any;
}

interface ApiResponse {
  message: string;
}

interface ProfessionalState {
  submitting: boolean;
  error: string | null;
}

const initialState: ProfessionalState = {
  submitting: false,
  error: null,
};

// --- ASYNC THUNKS ---
export const updateProfessionalInfo = createAsyncThunk<
  ApiResponse,
  { professionalId: string; empCode: string; professionalData: ProfessionalInfoPayload },
  { rejectValue: string }
>(
  'professional/updateDetails',
  async ({ professionalId, empCode, professionalData }, { dispatch, rejectWithValue }) => {
    const token = getAuthToken();
    if (!token) {
      return rejectWithValue('Authentication token not found.');
    }

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/professional/${professionalId}`,
        professionalData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchEmployeeDetails(empCode));
      return response.data as ApiResponse;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data?.message || 'Failed to update professional info.');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

// --- SLICE DEFINITION ---
const professionalSlice = createSlice({
  name: 'professional',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfessionalInfo.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateProfessionalInfo.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateProfessionalInfo.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      });
  },
});

export default professionalSlice.reducer;