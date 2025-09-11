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


import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- CONSTANTS ---
const API_BASE_URL = '/holidayCalendar/';

// --- TYPE DEFINITIONS ---

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

// ✨ NEW: Type for the update payload, requiring an ID and allowing partial data for other fields.
export type UpdateHolidayCalendarPayload = { id: string } & Partial<NewHolidayCalendarEntry>;

// ✨ NEW: Type for the success response from the API, including a message for toasts.
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
    // Assuming the GET endpoint returns the array directly.
    const response = await axiosInstance.get<HolidayCalendarEntry[]>(`${API_BASE_URL}get`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch holiday calendar');
    return rejectWithValue('An unknown error occurred.');
  }
});


// ✨ UPDATED: The thunk now dispatches fetch on success and returns the full API response.
export const addHolidayCalendarEntry = createAsyncThunk('holidayCalendar/add', async (newEntry: NewHolidayCalendarEntry, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.post<ApiSuccessResponse<HolidayCalendarEntry>>(`${API_BASE_URL}create`, newEntry);
        // After a successful creation, dispatch the fetch action to get the latest list.
        dispatch(fetchHolidayCalendar());
        return response.data; // This now includes { data: HolidayCalendarEntry, message: string }
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to create holiday');
        return rejectWithValue('An unknown error occurred.');
    }
});


// ✨ UPDATED: Accepts a partial payload, dispatches fetch, and returns the API response.
export const updateHolidayCalendarEntry = createAsyncThunk('holidayCalendar/update', async (entry: UpdateHolidayCalendarPayload, { dispatch, rejectWithValue }) => {
    const { id, ...updateData } = entry;
    try {
        const response = await axiosInstance.put<ApiSuccessResponse<HolidayCalendarEntry>>(`${API_BASE_URL}update/${id}`, updateData);
        // After a successful update, dispatch the fetch action to get the latest list.
        dispatch(fetchHolidayCalendar());
        // We return the updated data from the server and the success message.
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update holiday');
        return rejectWithValue('An unknown error occurred.');
    }
});


// ✨ UPDATED: Returns an object with the ID and a success message.
export const deleteHolidayCalendarEntry = createAsyncThunk('holidayCalendar/delete', async (id: string, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete<{ message: string }>(`${API_BASE_URL}delete/${id}`);
        return { id, message: response.data.message };
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete holiday');
        return rejectWithValue('An unknown error occurred.');
    }
});


// --- SLICE DEFINITION ---
const holidayCalendarSlice = createSlice({
  name: 'holidayCalendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidayCalendar.fulfilled, (state, action: PayloadAction<HolidayCalendarEntry[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null; // Clear previous errors
      })
      .addCase(addHolidayCalendarEntry.fulfilled, (state, action: PayloadAction<ApiSuccessResponse<HolidayCalendarEntry>>) => {
        // Optimistically add the new item. The subsequent fetch will ensure consistency.
        state.items.push(action.payload.data);
      })
      .addCase(updateHolidayCalendarEntry.fulfilled, (state, action: PayloadAction<ApiSuccessResponse<HolidayCalendarEntry>>) => {
          // Optimistically update the item. The subsequent fetch will ensure consistency.
          const index = state.items.findIndex(item => item.id === action.payload.data.id);
          if (index !== -1) {
              state.items[index] = action.payload.data;
          }
      })
      .addCase(deleteHolidayCalendarEntry.fulfilled, (state, action: PayloadAction<{ id: string; message: string }>) => {
          state.items = state.items.filter(item => item.id !== action.payload.id);
      })
      .addMatcher(isPending(fetchHolidayCalendar, addHolidayCalendarEntry, updateHolidayCalendarEntry, deleteHolidayCalendarEntry), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchHolidayCalendar, addHolidayCalendarEntry, updateHolidayCalendarEntry, deleteHolidayCalendarEntry), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default holidayCalendarSlice.reducer;
