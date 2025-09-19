// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services'; 

// const API_BASE_URL = '/leaveRequest';

// export interface LeaveBalanceDetails {
//     leaveTaken: number;
//     balance: number;
//     allowedLeave: number;
//     unpaidLeave: number;
// }
// export type LeaveBalance = Record<string, LeaveBalanceDetails>;
// export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

// export interface LeaveRequest {
//   id: string;
//   empCode: string;
//   employeeName: string;
//   department: string;
//   startDate: string;
//   endDate: string;
//   leaveType: string;
//   reason: string;
//   appliedOn: string;
//   myApprovalStatus: ApprovalStatus;
//   finalApprovalStatus: ApprovalStatus;
//   duration: number;
//   uploadedDocument: string;
//   createdAt: string;
//   updatedAt: string;
//   leaveBalance: LeaveBalance;
// }


// export interface LeaveFilters {
//   leaveTypes: string[];
//   approvalStatus: string[];
//   departments: string[];
// }

// export interface UpdateLeaveStatusPayload {
//     id: string;
//     status: 'Approved' | 'Rejected';
//     declineReason?: string;
// }

// export interface LeaveRequestState {
//   data: LeaveRequest[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   selectedRequest: LeaveRequest | null;
//   selectedRequestStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: LeaveRequestState = {
//   data: [],
//   status: 'idle',
//   selectedRequest: null,
//   selectedRequestStatus: 'idle',
//   error: null,
// };

// export const fetchLeaveRequests = createAsyncThunk(
//   'leaveRequests/fetch',
//   async (filters: LeaveFilters | null, { rejectWithValue }) => {
//     try {
//       const token = "YOUR_FIREBASE_ID_TOKEN";
      
    
//       const params: Record<string, string> = {};
//       if (filters) {
          
//           if (filters.leaveTypes.length > 0) params.leaveType = filters.leaveTypes[0];
//           if (filters.approvalStatus.length > 0) params.finalApprovalStatus = filters.approvalStatus[0];
//           if (filters.departments.length > 0) params.department = filters.departments[0];
//       }
      
//       const response = await axiosInstance.get(`${API_BASE_URL}/get`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//         params,
//       });
//       return response.data.data as LeaveRequest[];
//     } catch (error) {
//       if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// export const fetchLeaveRequestById = createAsyncThunk(
//   'leaveRequests/fetchById',
//   async (id: string, { rejectWithValue }) => {
//       try {
//           const token = "YOUR_FIREBASE_ID_TOKEN";
//           const response = await axiosInstance.get(`${API_BASE_URL}/get?id=${id}`, {
//               headers: { 'Authorization': `Bearer ${token}` },
//           });
//           return response.data.data[0] as LeaveRequest;
//       } catch (error) {
//           if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//           return rejectWithValue('Failed to fetch leave request details.');
//       }
//   }
// );


// export const updateLeaveStatus = createAsyncThunk(
//   'leaveRequests/updateStatus',
//   async ({ id, status, declineReason }: UpdateLeaveStatusPayload, { rejectWithValue }) => {
//     try {
//       const token = "YOUR_FIREBASE_ID_TOKEN";
//       const body: { myApprovalStatus: string, declineReason?: string } = { myApprovalStatus: status };
//       if (status === 'Rejected' && declineReason) {
//           body.declineReason = declineReason;
//       }
//       await axiosInstance.put(`${API_BASE_URL}/update/${id}`, body, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       return { id, status };
//     } catch (error) {
//       if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// const leaveRequestSlice = createSlice({
//   name: 'leaveRequests',
//   initialState,
//   reducers: {
//       clearLeaveRequests: (state) => {
//           state.data = [];
//           state.status = 'idle';
//           state.error = null;
//       },
//       clearSelectedLeaveRequest: (state) => {
//           state.selectedRequest = null;
//           state.selectedRequestStatus = 'idle';
//       }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchLeaveRequests.pending, (state) => { state.status = 'loading'; })
//       .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.data = action.payload;
//       })
//       .addCase(fetchLeaveRequests.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })
//       .addCase(fetchLeaveRequestById.pending, (state) => {
//           state.selectedRequestStatus = 'loading';
//       })
//       .addCase(fetchLeaveRequestById.fulfilled, (state, action) => {
//           state.selectedRequestStatus = 'succeeded';
//           state.selectedRequest = action.payload;
//       })
//       .addCase(fetchLeaveRequestById.rejected, (state, action) => {
//           state.selectedRequestStatus = 'failed';
//           state.error = action.payload as string;
//       })
//       .addCase(updateLeaveStatus.fulfilled, (state, action) => {
//           const { id, status } = action.payload;
//           const requestInList = state.data.find(req => req.id === id);
//           if (requestInList) {
//               requestInList.myApprovalStatus = status;
//               requestInList.finalApprovalStatus = status;
//           }
//           if (state.selectedRequest && state.selectedRequest.id === id) {
//               state.selectedRequest.myApprovalStatus = status;
//               state.selectedRequest.finalApprovalStatus = status;
//           }
//       });
//   },
// });

// export const { clearLeaveRequests, clearSelectedLeaveRequest } = leaveRequestSlice.actions;
// export default leaveRequestSlice.reducer;


import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';
import { type LeaveFilters } from '../../components/LeaveConfiguration/LeaveFilter'; // Assuming the type is exported

const API_BASE_URL = '/leaveRequest/';

// --- TYPE DEFINITIONS ---
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
  uploadedDocument?: string;
  leaveBalance?: Record<string, any>;
}

export interface LeaveRequestState {
  data: LeaveRequest[];
  selectedRequest: LeaveRequest | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedRequestStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LeaveRequestState = {
  data: [],
  selectedRequest: null,
  status: 'idle',
  selectedRequestStatus: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---
export const fetchLeaveRequests = createAsyncThunk(
  'leaveRequests/fetch',
  async (filters: LeaveFilters | null, { rejectWithValue }) => {
    try {
        // This correctly creates a query string that can handle multiple values for the same key.
        // e.g., ?leaveType=Sick&leaveType=Planned
        const params = new URLSearchParams();
        if (filters?.leaveTypes?.length) {
            filters.leaveTypes.forEach(type => params.append('leaveType', type));
        }
        if (filters?.approvalStatus?.length) {
            filters.approvalStatus.forEach(status => params.append('finalApprovalStatus', status));
        }
        if (filters?.departments?.length) {
            filters.departments.forEach(dept => params.append('department', dept));
        }

      const response = await axiosInstance.get(`${API_BASE_URL}get`, { params });
      return response.data.data as LeaveRequest[];
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch leave requests');
      }
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const fetchLeaveRequestById = createAsyncThunk(
    'leaveRequests/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
             const response = await axiosInstance.get(`${API_BASE_URL}get`, { params: { id } });
             return response.data.data[0] as LeaveRequest;
        } catch (error) {
             if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to fetch details');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

export const updateLeaveStatus = createAsyncThunk(
    'leaveRequests/updateStatus',
    async ({ id, status, reason }: { id: string; status: 'Approved' | 'Rejected'; reason?: string }, { rejectWithValue }) => {
        try {
            const payload: { myApprovalStatus: string, declineReason?: string } = { myApprovalStatus: status };
            if (status === 'Rejected' && reason) {
                payload.declineReason = reason;
            }
            await axiosInstance.put(`${API_BASE_URL}update/${id}`, payload);
            // Return the original data to the reducer for an optimistic update
            return { id, status };
        } catch (error) {
             if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to update status');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);


// --- SLICE DEFINITION ---
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
      // Reducers for the main list of leave requests
      .addCase(fetchLeaveRequests.pending, (state) => { 
        state.status = 'loading'; 
        state.error = null;
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action: PayloadAction<LeaveRequest[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Reducers for the single, selected leave request
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
      // Reducer to update the status in the UI after a successful API call
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
          const { id, status } = action.payload;
          const index = state.data.findIndex(req => req.id === id);
          if (index !== -1) {
              state.data[index].myApprovalStatus = status;
              state.data[index].finalApprovalStatus = status;
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

