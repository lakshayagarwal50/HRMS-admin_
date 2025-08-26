// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios, { isAxiosError } from 'axios';
// import type { RootState } from '../store'; // Adjust path if needed

// const API_BASE_URL = 'http://172.50.5.49:3000/api/dsr';

// const getAuthToken = (): string | null => {
//   return localStorage.getItem('accessToken'); 
// };

// // --- TYPE DEFINITIONS ---
// export interface DsrEntry {
//   id: string;
//   empId: string;
//   employeeName: string;
//   date: string;
//   email: string;
//   department: string;
//   designation: string;
//   description: string;
//   totalLoggedHours: string;
//   submissionStatus: string;
//   myApprovalStatus: string;
//   projects: string;
//   createdAt: number;
//   updatedAt: number;
//   declineReason?: string;
// }

// export interface DsrFilterState {
//   date: string;
//   projects: string;
//   submissionStatuses: string[];
//   approvalStatuses: string[];
// }

// interface DsrState {
//   dsrList: DsrEntry[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
//   filters: DsrFilterState;
// }

// const initialFilters: DsrFilterState = {
//   date: '',
//   projects: '',
//   submissionStatuses: [],
//   approvalStatuses: [],
// };

// const initialState: DsrState = {
//   dsrList: [],
//   status: 'idle',
//   error: null,
//   filters: initialFilters,
// };

// // --- ASYNC THUNKS ---

// export const fetchAllDsrs = createAsyncThunk<
//   DsrEntry[],
//   void,
//   { state: RootState; rejectValue: string }
// >(
//   'dsr/fetchAll',
//   async (_, { getState, rejectWithValue }) => {
//     // ... (This thunk remains the same, handling server-side filtering)
//     const token = getAuthToken();
//     if (!token) return rejectWithValue('Authentication token not found.');
//     const filters = getState().dsr.filters;
//     const params: { [key: string]: any } = {};
//     if (filters.date) {
//         const [year, month, day] = filters.date.split('-');
//         params.date = `${day}-${month}-${year}`;
//     }
//     if (filters.projects) params.projects = filters.projects;
//     if (filters.submissionStatuses.length > 0) params.submissionStatus = filters.submissionStatuses.join(',');
//     if (filters.approvalStatuses.length > 0) params.myApprovalStatus = filters.approvalStatuses.join(',');

//     try {
//       const response = await axios.get(`${API_BASE_URL}/get`, {
//           headers: { Authorization: `Bearer ${token}` },
//           params: params
//       });
//       return response.data as DsrEntry[];
//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to fetch DSR list.');
//     }
//   }
// );

// export const approveDsr = createAsyncThunk<
//   DsrEntry,
//   DsrEntry, // Argument is the full DSR object
//   { rejectValue: string }
// >(
//   'dsr/approve',
//   async (originalDsr, { rejectWithValue }) => {
//     const token = getAuthToken();
//     if (!token) return rejectWithValue('Authentication token not found.');
    
//     const requestBody = {
//       ...originalDsr,
//       myApprovalStatus: 'Approved',
//     };

//     try {
//       await axios.put(
//         `${API_BASE_URL}/update/${originalDsr.id}`,
//         requestBody,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return requestBody; // Return the manually updated object for the reducer
//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to approve DSR.');
//     }
//   }
// );

// export const declineDsr = createAsyncThunk<
//   DsrEntry,
//   { dsr: DsrEntry; reason: string }, // Argument includes the full DSR object
//   { rejectValue: string }
// >(
//   'dsr/decline',
//   async ({ dsr, reason }, { rejectWithValue }) => {
//     const token = getAuthToken();
//     if (!token) return rejectWithValue('Authentication token not found.');
    
//     const requestBody = {
//       ...dsr,
//       myApprovalStatus: 'Declined',
//       declineReason: reason,
//     };

//     try {
//       await axios.put(
//         `${API_BASE_URL}/update/${dsr.id}`,
//         requestBody,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return requestBody; // Return the manually updated object for the reducer
//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to decline DSR.');
//     }
//   }
// );

// // --- SLICE DEFINITION ---
// const dsrSlice = createSlice({
//   name: 'dsr',
//   initialState,
//   reducers: {
//     setDsrFilters: (state, action: PayloadAction<Partial<DsrFilterState>>) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },
//     clearDsrFilters: (state) => {
//       state.filters = initialFilters;
//     },
//   },
//   extraReducers: (builder) => {
//     const updateDsrInList = (state: DsrState, action: PayloadAction<DsrEntry>) => {
//         const updatedDsr = action.payload;
//         const index = state.dsrList.findIndex(dsr => dsr.id === updatedDsr.id);
//         if (index !== -1) {
//           state.dsrList[index] = updatedDsr;
//         }
//         state.status = 'succeeded';
//     };

//     builder
//       .addCase(fetchAllDsrs.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchAllDsrs.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.dsrList = action.payload;
//       })
//       .addCase(fetchAllDsrs.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       })
//       .addCase(approveDsr.fulfilled, updateDsrInList)
//       .addCase(declineDsr.fulfilled, updateDsrInList)
//       .addMatcher(
//           (action) => action.type.endsWith('/pending') && !action.type.startsWith('dsr/fetchAll'),
//           (state) => { state.status = 'loading'; }
//       )
//       .addMatcher(
//           (action) => action.type.endsWith('/rejected'),
//           (state, action) => {
//             state.status = 'failed';
//             state.error = action.payload as string;
//           }
//       );
//   },
// });

// export const { setDsrFilters, clearDsrFilters } = dsrSlice.actions;
// export default dsrSlice.reducer;
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// 1. Import isAxiosError and the configured axios instance
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; // Adjust path if needed!
import type { RootState } from '../store';

// --- REMOVED ---
// API_BASE_URL and getAuthToken are no longer needed.

// --- TYPE DEFINITIONS (No changes needed here) ---
export interface DsrEntry {
  id: string;
  empId: string;
  employeeName: string;
  date: string;
  email: string;
  department: string;
  designation: string;
  description: string;
  totalLoggedHours: string;
  submissionStatus: string;
  myApprovalStatus: string;
  projects: string;
  createdAt: number;
  updatedAt: number;
  declineReason?: string;
}

export interface DsrFilterState {
  date: string;
  projects: string;
  submissionStatuses: string[];
  approvalStatuses: string[];
}

interface DsrState {
  dsrList: DsrEntry[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: DsrFilterState;
}

const initialFilters: DsrFilterState = {
  date: '',
  projects: '',
  submissionStatuses: [],
  approvalStatuses: [],
};

const initialState: DsrState = {
  dsrList: [],
  status: 'idle',
  error: null,
  filters: initialFilters,
};

// --- UPDATED ASYNC THUNKS ---

export const fetchAllDsrs = createAsyncThunk<
  DsrEntry[],
  void,
  { state: RootState; rejectValue: string }
>(
  'dsr/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    const filters = getState().dsr.filters;
    const params: { [key: string]: any } = {};
    if (filters.date) {
        const [year, month, day] = filters.date.split('-');
        params.date = `${day}-${month}-${year}`;
    }
    if (filters.projects) params.projects = filters.projects;
    if (filters.submissionStatuses.length > 0) params.submissionStatus = filters.submissionStatuses.join(',');
    if (filters.approvalStatuses.length > 0) params.myApprovalStatus = filters.approvalStatuses.join(',');

    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      const response = await axiosInstance.get('/api/dsr/get', { params });
      return response.data as DsrEntry[];
    } catch (error) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to fetch DSR list.');
    }
  }
);

export const approveDsr = createAsyncThunk<
  DsrEntry,
  DsrEntry,
  { rejectValue: string }
>(
  'dsr/approve',
  async (originalDsr, { rejectWithValue }) => {
    const requestBody = {
      ...originalDsr,
      myApprovalStatus: 'Approved',
    };

    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      await axiosInstance.put(
        `/api/dsr/update/${originalDsr.id}`,
        requestBody
      );
      return requestBody; // Return updated object for optimistic UI update
    } catch (error) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to approve DSR.');
    }
  }
);

export const declineDsr = createAsyncThunk<
  DsrEntry,
  { dsr: DsrEntry; reason: string },
  { rejectValue: string }
>(
  'dsr/decline',
  async ({ dsr, reason }, { rejectWithValue }) => {
    const requestBody = {
      ...dsr,
      myApprovalStatus: 'Declined',
      declineReason: reason,
    };

    try {
      // CHANGED: Use axiosInstance, relative URL, and no manual headers
      await axiosInstance.put(
        `/api/dsr/update/${dsr.id}`,
        requestBody
      );
      return requestBody; // Return updated object for optimistic UI update
    } catch (error) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to decline DSR.');
    }
  }
);

// --- SLICE DEFINITION (No changes needed here) ---
const dsrSlice = createSlice({
  name: 'dsr',
  initialState,
  reducers: {
    setDsrFilters: (state, action: PayloadA<Partial<DsrFilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearDsrFilters: (state) => {
      state.filters = initialFilters;
    },
  },
  extraReducers: (builder) => {
    const updateDsrInList = (state: DsrState, action: PayloadAction<DsrEntry>) => {
        const updatedDsr = action.payload;
        const index = state.dsrList.findIndex(dsr => dsr.id === updatedDsr.id);
        if (index !== -1) {
          state.dsrList[index] = updatedDsr;
        }
        state.status = 'succeeded';
    };

    builder
      .addCase(fetchAllDsrs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllDsrs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dsrList = action.payload;
      })
      .addCase(fetchAllDsrs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(approveDsr.fulfilled, updateDsrInList)
      .addCase(declineDsr.fulfilled, updateDsrInList)
      .addMatcher(
          (action) => action.type.endsWith('/pending') && !action.type.startsWith('dsr/fetchAll'),
          (state) => { state.status = 'loading'; }
      )
      .addMatcher(
          (action) => action.type.endsWith('/rejected'),
          (state, action) => {
            state.status = 'failed';
            state.error = action.payload as string;
          }
      );
  },
});

export const { setDsrFilters, clearDsrFilters } = dsrSlice.actions;
export default dsrSlice.reducer;