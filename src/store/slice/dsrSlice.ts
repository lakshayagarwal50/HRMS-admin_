
// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services'; 
// import type { RootState } from '../store';

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


// export const fetchAllDsrs = createAsyncThunk<
//   DsrEntry[],
//   void,
//   { state: RootState; rejectValue: string }
// >(
//   'dsr/fetchAll',
//   async (_, { getState, rejectWithValue }) => {
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
//       const response = await axiosInstance.get('/dsr/get', { params });
//       return response.data as DsrEntry[];
//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to fetch DSR list.');
//     }
//   }
// );

// export const approveDsr = createAsyncThunk<
//   DsrEntry,
//   DsrEntry,
//   { rejectValue: string }
// >(
//   'dsr/approve',
//   async (originalDsr, { rejectWithValue }) => {
//     const requestBody = {
//       ...originalDsr,
//       myApprovalStatus: 'Approved',
//     };

//     try {
//       await axiosInstance.put(
//         `/dsr/update/${originalDsr.id}`,
//         requestBody
//       );
//       return requestBody; 
//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to approve DSR.');
//     }
//   }
// );

// export const declineDsr = createAsyncThunk<
//   DsrEntry,
//   { dsr: DsrEntry; reason: string },
//   { rejectValue: string }
// >(
//   'dsr/decline',
//   async ({ dsr, reason }, { rejectWithValue }) => {
//     const requestBody = {
//       ...dsr,
//       myApprovalStatus: 'Declined',
//       declineReason: reason,
//     };

//     try {
//       await axiosInstance.put(
//         `/dsr/update/${dsr.id}`,
//         requestBody
//       );
//       return requestBody;
//     } catch (error) {
//       return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to decline DSR.');
//     }
//   }
// );

// const dsrSlice = createSlice({
//   name: 'dsr',
//   initialState,
//   reducers: {
//     setDsrFilters: (state, action: PayloadA<Partial<DsrFilterState>>) => {
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
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 
import type { RootState } from '../store';

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


export const fetchAllDsrs = createAsyncThunk<
  DsrEntry[],
  void,
  { state: RootState; rejectValue: string }
>(
  'dsr/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    const filters = getState().dsr.filters;
    const params = new URLSearchParams();

    if (filters.date) {
        const [year, month, day] = filters.date.split('-');
        params.append('date', `${month}/${day}/${year}`);
    }
    
    if (filters.projects) {
        params.append('projects', filters.projects);
    }

    if (filters.submissionStatuses.length > 0) {
        filters.submissionStatuses.forEach(status => {
            params.append('submissionStatus', status);
        });
    }

    if (filters.approvalStatuses.length > 0) {
        filters.approvalStatuses.forEach(status => {
            params.append('myApprovalStatus', status);
        });
    }

    try {
      const response = await axiosInstance.get('/dsr/get', { params });
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
      await axiosInstance.put(
        `/dsr/update/${originalDsr.id}`,
        requestBody
      );
      return requestBody; 
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
      await axiosInstance.put(
        `/dsr/update/${dsr.id}`,
        requestBody
      );
      return requestBody;
    } catch (error) {
      return rejectWithValue(isAxiosError(error) ? error.response?.data?.message : 'Failed to decline DSR.');
    }
  }
);

const dsrSlice = createSlice({
  name: 'dsr',
  initialState,
  reducers: {
    setDsrFilters: (state, action: PayloadAction<Partial<DsrFilterState>>) => {
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