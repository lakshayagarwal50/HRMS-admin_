// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios, { isAxiosError } from 'axios';
// import { fetchEmployeeDetails } from './employeeSlice';


// const API_BASE_URL = 'http://172.50.5.116:3000/employees';

// const getAuthToken = (): string | null => {
//   return localStorage.getItem('token'); // Ensure the key matches your auth logic
// };


// interface ProfessionalInfoPayload {
//   [key: string]: any;
// }

// interface ApiResponse {
//   message: string;
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
//     const token = getAuthToken();
//     if (!token) {
//       return rejectWithValue('Authentication token not found.');
//     }

//     try {
//       const response = await axios.patch(
//         `${API_BASE_URL}/professional/${professionalId}`,
//         professionalData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       dispatch(fetchEmployeeDetails(empCode));
//       return response.data as ApiResponse;
//     } catch (error: unknown) {
//       if (isAxiosError(error) && error.response) {
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
//       .addCase(updateProfessionalInfo.pending, (state) => {
//         state.submitting = true;
//         state.error = null;
//       })
//       .addCase(updateProfessionalInfo.fulfilled, (state) => {
//         state.submitting = false;
//       })
//       .addCase(updateProfessionalInfo.rejected, (state, action) => {
//         state.submitting = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default professionalSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; // Import the centralized instance
import { fetchEmployeeDetails } from './employeeSlice';

// The base path for employee-related API calls
const API_BASE_PATH = '/employees';

// --- TYPE DEFINITIONS ---
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

// --- ASYNC THUNK ---
export const updateProfessionalInfo = createAsyncThunk<
  ApiResponse,
  { professionalId: string; empCode: string; professionalData: ProfessionalInfoPayload },
  { rejectValue: string }
>(
  'professional/updateDetails',
  async ({ professionalId, empCode, professionalData }, { dispatch, rejectWithValue }) => {
    try {
      // Use axiosInstance; auth headers are handled automatically by the interceptor.
      const response = await axiosInstance.patch(
        `${API_BASE_PATH}/professional/${professionalId}`,
        professionalData
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