import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 

const API_BASE_URL = '/leaveRequest';

// --- TYPE DEFINITIONS ---
export interface LeaveBalanceDetails {
    leaveTaken: number;
    balance: number;
    allowedLeave: number;
    unpaidLeave: number;
}
export type LeaveBalance = Record<string, LeaveBalanceDetails>;
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  empCode: string;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  appliedOn: string;
  myApprovalStatus: ApprovalStatus;
  finalApprovalStatus: ApprovalStatus;
  duration: number;
  uploadedDocument: string;
  createdAt: string;
  updatedAt: string;
  leaveBalance: LeaveBalance;
}

// This type should match the one in your filter component
export interface LeaveFilters {
  leaveTypes: string[];
  approvalStatus: string[];
  departments: string[];
}

export interface UpdateLeaveStatusPayload {
    id: string;
    status: 'Approved' | 'Rejected';
    declineReason?: string;
}

export interface LeaveRequestState {
  data: LeaveRequest[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedRequest: LeaveRequest | null;
  selectedRequestStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LeaveRequestState = {
  data: [],
  status: 'idle',
  selectedRequest: null,
  selectedRequestStatus: 'idle',
  error: null,
};

// --- ASYNCHRONOUS THUNKS ---
export const fetchLeaveRequests = createAsyncThunk(
  'leaveRequests/fetch',
  async (filters: LeaveFilters | null, { rejectWithValue }) => {
    try {
      const token = "YOUR_FIREBASE_ID_TOKEN";
      
      // Correctly build query parameters for axios
      const params: Record<string, string> = {};
      if (filters) {
          // The API docs show single query params, so we'll take the first selected value for each filter.
          // If your API supports multiple values, you might need to adjust this.
          if (filters.leaveTypes.length > 0) params.leaveType = filters.leaveTypes[0];
          if (filters.approvalStatus.length > 0) params.finalApprovalStatus = filters.approvalStatus[0];
          if (filters.departments.length > 0) params.department = filters.departments[0];
      }
      
      const response = await axiosInstance.get(`${API_BASE_URL}/get`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params, // Pass the params object to axios
      });
      return response.data.data as LeaveRequest[];
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const fetchLeaveRequestById = createAsyncThunk(
  'leaveRequests/fetchById',
  async (id: string, { rejectWithValue }) => {
      try {
          const token = "YOUR_FIREBASE_ID_TOKEN";
          const response = await axiosInstance.get(`${API_BASE_URL}/get?id=${id}`, {
              headers: { 'Authorization': `Bearer ${token}` },
          });
          return response.data.data[0] as LeaveRequest;
      } catch (error) {
          if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
          return rejectWithValue('Failed to fetch leave request details.');
      }
  }
);


export const updateLeaveStatus = createAsyncThunk(
  'leaveRequests/updateStatus',
  async ({ id, status, declineReason }: UpdateLeaveStatusPayload, { rejectWithValue }) => {
    try {
      const token = "YOUR_FIREBASE_ID_TOKEN";
      const body: { myApprovalStatus: string, declineReason?: string } = { myApprovalStatus: status };
      if (status === 'Rejected' && declineReason) {
          body.declineReason = declineReason;
      }
      await axiosInstance.put(`${API_BASE_URL}/update/${id}`, body, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return { id, status };
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

const leaveRequestSlice = createSlice({
  name: 'leaveRequests',
  initialState,
  reducers: {
      clearLeaveRequests: (state) => {
          state.data = [];
          state.status = 'idle';
          state.error = null;
      },
      clearSelectedLeaveRequest: (state) => {
          state.selectedRequest = null;
          state.selectedRequestStatus = 'idle';
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveRequests.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchLeaveRequestById.pending, (state) => {
          state.selectedRequestStatus = 'loading';
      })
      .addCase(fetchLeaveRequestById.fulfilled, (state, action) => {
          state.selectedRequestStatus = 'succeeded';
          state.selectedRequest = action.payload;
      })
      .addCase(fetchLeaveRequestById.rejected, (state, action) => {
          state.selectedRequestStatus = 'failed';
          state.error = action.payload as string;
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
          const { id, status } = action.payload;
          const requestInList = state.data.find(req => req.id === id);
          if (requestInList) {
              requestInList.myApprovalStatus = status;
              requestInList.finalApprovalStatus = status;
          }
          if (state.selectedRequest && state.selectedRequest.id === id) {
              state.selectedRequest.myApprovalStatus = status;
              state.selectedRequest.finalApprovalStatus = status;
          }
      });
  },
});

export const { clearLeaveRequests, clearSelectedLeaveRequest } = leaveRequestSlice.actions;
export default leaveRequestSlice.reducer;
