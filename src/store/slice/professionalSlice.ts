// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios, { isAxiosError } from 'axios';
// import { fetchEmployeeDetails } from './employeeSlice';


// const API_BASE_URL = 'http://172.50.5.49:3000/employees';

// const getAuthToken = (): string | null => {
//   return localStorage.getItem('accessToken'); // Ensure the key matches your auth logic
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
// CHANGED: Import isAxiosError and the configured axios instance
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; // Adjust path if needed
import { fetchEmployeeDetails } from './employeeSlice';

// REMOVED: API_BASE_URL and getAuthToken are no longer needed.

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

export const updateProfessionalInfo = createAsyncThunk<
  ApiResponse,
  { professionalId: string; empCode: string; professionalData: ProfessionalInfoPayload },
  { rejectValue: string }
>(
  'professional/updateDetails',
  async ({ professionalId, empCode, professionalData }, { dispatch, rejectWithValue }) => {
    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      const response = await axiosInstance.patch(
        `/employees/professional/${professionalId}`,
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

// No changes are needed for the slice definition itself
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