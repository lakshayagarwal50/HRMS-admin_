// import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services'; 


// const API_BASE_URL = '/holidayCalendar/';

// export interface HolidayCalendarEntry {
//   id: string;
//   name: string;
//   type: string;
//   date: string; 
//   holidayGroups: string[];
//   createdBy: string;
//   createdAt: string;
// }

// export type NewHolidayCalendarEntry = Omit<HolidayCalendarEntry, 'id' | 'createdBy' | 'createdAt'>;

// export interface HolidayCalendarState {
//   items: HolidayCalendarEntry[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: HolidayCalendarState = {
//   items: [],
//   status: 'idle',
//   error: null,
// };


// export const fetchHolidayCalendar = createAsyncThunk('holidayCalendar/fetch', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get(`${API_BASE_URL}get`);
//     return response.data as HolidayCalendarEntry[];
//   } catch (error) {
//     if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch holiday calendar');
//     return rejectWithValue('An unknown error occurred.');
//   }
// });


// export const addHolidayCalendarEntry = createAsyncThunk('holidayCalendar/add', async (newEntry: NewHolidayCalendarEntry, { rejectWithValue }) => {
//     const apiRequestBody = {
//         name: newEntry.name,
//         type: newEntry.type,
//         date: newEntry.date,
//         holidayGroups: newEntry.holidayGroups,
//     };

//     try {
        
//         const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
//         return { 
//             ...newEntry, 
//             id: response.data.id,
//             createdBy: 'current-user-id', 
//             createdAt: new Date().toISOString(), 
//         } as HolidayCalendarEntry;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to create holiday');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });


// export const updateHolidayCalendarEntry = createAsyncThunk('holidayCalendar/update', async (entry: HolidayCalendarEntry, { rejectWithValue }) => {
//     const { id, name, type, date, holidayGroups } = entry;
//     const apiRequestBody = { name, type, date, holidayGroups };

//     try {
        
//         await axiosInstance.put(`${API_BASE_URL}update/${id}`, apiRequestBody);
//         return entry;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update holiday');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });


// export const deleteHolidayCalendarEntry = createAsyncThunk('holidayCalendar/delete', async (id: string, { rejectWithValue }) => {
//     try {
        
//         await axiosInstance.delete(`${API_BASE_URL}delete/${id}`);
//         return id;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete holiday');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });


// const holidayCalendarSlice = createSlice({
//   name: 'holidayCalendar',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
    
//       .addCase(fetchHolidayCalendar.fulfilled, (state, action: PayloadAction<HolidayCalendarEntry[]>) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(addHolidayCalendarEntry.fulfilled, (state, action: PayloadAction<HolidayCalendarEntry>) => {
//         state.status = 'succeeded';
//         state.items.push(action.payload);
//       })
//       .addCase(updateHolidayCalendarEntry.fulfilled, (state, action: PayloadAction<HolidayCalendarEntry>) => {
//           state.status = 'succeeded';
//           const index = state.items.findIndex(item => item.id === action.payload.id);
//           if (index !== -1) {
//               state.items[index] = action.payload;
//           }
//       })
//       .addCase(deleteHolidayCalendarEntry.fulfilled, (state, action: PayloadAction<string>) => {
//           state.status = 'succeeded';
//           state.items = state.items.filter(item => item.id !== action.payload);
//       })
//       .addMatcher(isPending(fetchHolidayCalendar, addHolidayCalendarEntry, updateHolidayCalendarEntry, deleteHolidayCalendarEntry), (state) => {
//           state.status = 'loading';
//           state.error = null;
//       })
//       .addMatcher(isRejected(fetchHolidayCalendar, addHolidayCalendarEntry, updateHolidayCalendarEntry, deleteHolidayCalendarEntry), (state, action) => {
//           state.status = 'failed';
//           state.error = action.payload as string;
//       });
//   },
// });

// export default holidayCalendarSlice.reducer;

import { createSlice, createAsyncThunk, isPending, isRejected } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

const API_BASE_URL = '/holidayCalendar/';

export interface HolidayCalendarEntry {
  id: string;
  name: string;
  type: string;
  date: string;
  holidayGroups: string[];
  createdBy: string;
  createdAt: string;
}

export type NewHolidayCalendarEntry = Omit<HolidayCalendarEntry, 'id' | 'createdBy' | 'createdAt'>;

// ✅ Correct type: only changed data
export type UpdateHolidayCalendarPayload = { id: string } & Partial<NewHolidayCalendarEntry>;

interface ApiSuccessResponse<T> {
  data: T;
  message: string;
}

export interface HolidayCalendarState {
  items: HolidayCalendarEntry[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HolidayCalendarState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---
export const fetchHolidayCalendar = createAsyncThunk('holidayCalendar/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{ data: HolidayCalendarEntry[] }>(`${API_BASE_URL}get`);
    return response.data.data || response.data;
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch holiday calendar');
    return rejectWithValue('An unknown error occurred.');
  }
});

export const addHolidayCalendarEntry = createAsyncThunk(
  'holidayCalendar/add',
  async (newEntry: NewHolidayCalendarEntry, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<ApiSuccessResponse<HolidayCalendarEntry>>(`${API_BASE_URL}create`, newEntry);
      dispatch(fetchHolidayCalendar());
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data);
      return rejectWithValue({ message: 'An unknown error occurred.' });
    }
  }
);

// ✅ PATCH/PUT with only changed fields
export const updateHolidayCalendarEntry = createAsyncThunk(
  'holidayCalendar/update',
  async (payload: UpdateHolidayCalendarPayload, { dispatch, rejectWithValue }) => {
    const { id, ...updateData } = payload;
    try {
      const response = await axiosInstance.put<ApiSuccessResponse<HolidayCalendarEntry>>(`${API_BASE_URL}update/${id}`, updateData);
      dispatch(fetchHolidayCalendar());
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data);
      return rejectWithValue({ message: 'Failed to update holiday.' });
    }
  }
);

export const deleteHolidayCalendarEntry = createAsyncThunk(
  'holidayCalendar/delete',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete<ApiSuccessResponse<null>>(`${API_BASE_URL}delete/${id}`);
      dispatch(fetchHolidayCalendar());
      return { ...response.data, id };
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data);
      return rejectWithValue({ message: 'An unknown error occurred.' });
    }
  }
);

// --- SLICE ---
const holidayCalendarSlice = createSlice({
  name: 'holidayCalendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidayCalendar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addHolidayCalendarEntry.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateHolidayCalendarEntry.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(deleteHolidayCalendarEntry.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addMatcher(
        isPending(fetchHolidayCalendar, addHolidayCalendarEntry, updateHolidayCalendarEntry, deleteHolidayCalendarEntry),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        isRejected(fetchHolidayCalendar, addHolidayCalendarEntry, updateHolidayCalendarEntry, deleteHolidayCalendarEntry),
        (state, action) => {
          state.status = 'failed';
          state.error = (action.payload as { message?: string })?.message || 'An error occurred.';
        }
      );
  },
});

export default holidayCalendarSlice.reducer;
