import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../services'; // Adjust the import path as needed
import { fetchEmployeeDetails } from './employeeSlice'; // To refresh data on success

// --- (Interfaces and initial state are the same) ---

export interface CreateLoginDetailsPayload {
  username: string;
  password: string;
  loginEnable?: boolean;
  accLocked?: boolean;
}

export interface LoginDetails extends CreateLoginDetailsPayload {
  role: string;
}

interface UpdateLoginDetailsResponse {
    message: string;
    updated: LoginDetails;
}

interface LoginDetailsState {
  details: LoginDetails | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LoginDetailsState = {
  details: null,
  loading: 'idle',
  error: null,
};

export const addLoginDetails = createAsyncThunk<
  LoginDetails,
  // --- CHANGE 1: Added empCode to the arguments ---
  { employeeId: string; empCode: string; payload: CreateLoginDetailsPayload },
  { rejectValue: string }
>(
  'loginDetails/add',
  async ({ employeeId, empCode, payload }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<LoginDetails>(
        `/employees/general/login-details/${employeeId}`,
        payload
      );
      // --- CHANGE 2: Use the correct empCode to refresh ---
      dispatch(fetchEmployeeDetails(empCode)); 
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to add login details.';
      return rejectWithValue(errorMessage);
    }
  }
);


export const updateLoginDetails = createAsyncThunk<
  LoginDetails,
  // --- CHANGE 3: Added empCode to the arguments ---
  { employeeId: string; empCode: string; payload: Partial<CreateLoginDetailsPayload> },
  { rejectValue: string }
>(
    'loginDetails/update',
    async ({ employeeId, empCode, payload }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch<UpdateLoginDetailsResponse>(
                `/employees/general/login-details/${employeeId}`,
                payload
            );
            // --- CHANGE 4: Use the correct empCode to refresh ---
            dispatch(fetchEmployeeDetails(empCode));
            return response.data.updated;
        } catch (error: any) {
            console.error("Full server error response:", error.response);
            
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                'Failed to update login details.';
            return rejectWithValue(errorMessage);
        }
    }
);


const loginDetailsSlice = createSlice({
  name: 'loginDetails',
  initialState,
  reducers: {
    setLoginDetails: (state, action: PayloadAction<LoginDetails | null>) => {
        state.details = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLoginDetails.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(addLoginDetails.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.details = action.payload;
      })
      .addCase(addLoginDetails.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload ?? 'An unknown error occurred.';
      })
      .addCase(updateLoginDetails.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateLoginDetails.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.details = action.payload;
      })
      .addCase(updateLoginDetails.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload ?? 'An unknown error occurred.';
      });
  },
});

export const { setLoginDetails } = loginDetailsSlice.actions;
export default loginDetailsSlice.reducer;
