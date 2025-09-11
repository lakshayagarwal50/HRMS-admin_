// import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services'; 

// const API_BASE_URL = '/working-patterns/';
// const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// interface WorkingPatternFromAPI {
//   id: string;
//   name: string;
//   code: string;
//   schedule: {
//     week1: string[];
//     week2: string[];
//     week3: string[];
//     week4: string[];
//   };
// }

// export interface WorkingPattern {
//   id: string;
//   name: string;
//   code: string;
//   week1: boolean[];
//   week2: boolean[];
//   week3: boolean[];
//   week4: boolean[];
// }

// export type NewWorkingPattern = Omit<WorkingPattern, 'id'>;

// export interface WorkingPatternsState {
//   items: WorkingPattern[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: WorkingPatternsState = {
//   items: [],
//   status: 'idle',
//   error: null,
// };

// const transformApiDataToUI = (apiData: WorkingPatternFromAPI[]): WorkingPattern[] => {
//   const dayMap: { [key: string]: number } = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
//   const transformWeek = (days: string[]): boolean[] => {
//     const weekBooleans = Array(7).fill(false);
//     days.forEach(day => {
//       const dayShort = day.slice(0, 3);
//       if (dayMap[dayShort] !== undefined) {
//         weekBooleans[dayMap[dayShort]] = true;
//       }
//     });
//     return weekBooleans;
//   };
//   return apiData.map(item => ({
//     id: item.id,
//     name: item.name,
//     code: item.code,
//     week1: transformWeek(item.schedule.week1),
//     week2: transformWeek(item.schedule.week2),
//     week3: transformWeek(item.schedule.week3),
//     week4: transformWeek(item.schedule.week4),
//   }));
// };

// const transformUIToApiSchedule = (pattern: NewWorkingPattern | WorkingPattern) => {
//     const booleanToDays = (week: boolean[]) => week.map((isWorking, i) => isWorking ? daysOfWeek[i] : null).filter(Boolean) as string[];
//     return {
//         week1: booleanToDays(pattern.week1),
//         week2: booleanToDays(pattern.week2),
//         week3: booleanToDays(pattern.week3),
//         week4: booleanToDays(pattern.week4),
//     };
// };


// export const fetchWorkingPatterns = createAsyncThunk('workingPatterns/fetch', async (_, { rejectWithValue }) => {
//   try {
    
//     const response = await axiosInstance.get(`${API_BASE_URL}get`);
//     return transformApiDataToUI(response.data as WorkingPatternFromAPI[]);
//   } catch (error) {
//     if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch patterns');
//     return rejectWithValue('An unknown error occurred.');
//   }
// });

// export const addWorkingPattern = createAsyncThunk('workingPatterns/add', async (newPattern: NewWorkingPattern, { rejectWithValue }) => {
//     const apiRequestBody = { name: newPattern.name, code: newPattern.code, schedule: transformUIToApiSchedule(newPattern) };
//     try {
      
//         const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
//         return { ...newPattern, id: response.data.id } as WorkingPattern;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to create pattern');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });

// export const updateWorkingPattern = createAsyncThunk('workingPatterns/update', async (pattern: WorkingPattern, { rejectWithValue }) => {
//     const apiRequestBody = { name: pattern.name, code: pattern.code, schedule: transformUIToApiSchedule(pattern) };
//     try {
        
//         await axiosInstance.put(`${API_BASE_URL}update/${pattern.id}`, apiRequestBody);
//         return pattern;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update pattern');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });

// export const deleteWorkingPattern = createAsyncThunk('workingPatterns/delete', async (id: string, { rejectWithValue }) => {
//     try {
        
//         await axiosInstance.delete(`${API_BASE_URL}delete/${id}`);
//         return id;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete pattern');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });



// const workingPatternsSlice = createSlice({
//   name: 'workingPatterns',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchWorkingPatterns.fulfilled, (state, action: PayloadAction<WorkingPattern[]>) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(addWorkingPattern.fulfilled, (state, action: PayloadAction<WorkingPattern>) => {
//         state.status = 'succeeded';
//         state.items.push(action.payload);
//       })
//       .addCase(updateWorkingPattern.fulfilled, (state, action: PayloadAction<WorkingPattern>) => {
//           state.status = 'succeeded';
//           const index = state.items.findIndex(item => item.id === action.payload.id);
//           if (index !== -1) {
//               state.items[index] = action.payload;
//           }
//       })
//       .addCase(deleteWorkingPattern.fulfilled, (state, action: PayloadAction<string>) => {
//           state.status = 'succeeded';
//           state.items = state.items.filter(item => item.id !== action.payload);
//       })
//       .addMatcher(isPending(fetchWorkingPatterns, addWorkingPattern, updateWorkingPattern, deleteWorkingPattern), (state) => {
//           state.status = 'loading';
//           state.error = null;
//       })
//       .addMatcher(isRejected(fetchWorkingPatterns, addWorkingPattern, updateWorkingPattern, deleteWorkingPattern), (state, action) => {
//           state.status = 'failed';
//           state.error = action.payload as string;
//       });
//   },
// });

// export default workingPatternsSlice.reducer;
import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 

const API_BASE_URL = '/working-patterns/';
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// --- TYPE DEFINITIONS ---

interface WorkingPatternFromAPI {
  id: string;
  name: string;
  code: string;
  schedule: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
}

export interface WorkingPattern {
  id: string;
  name: string;
  code: string;
  week1: boolean[];
  week2: boolean[];
  week3: boolean[];
  week4: boolean[];
}

export type NewWorkingPattern = Omit<WorkingPattern, 'id'>;

interface ApiSuccessResponse<T> {
  data: T;
  message: string;
}

export interface WorkingPatternsState {
  items: WorkingPattern[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WorkingPatternsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- DATA TRANSFORMERS ---

const transformApiDataToUI = (apiData: WorkingPatternFromAPI[]): WorkingPattern[] => {
  const dayMap: { [key: string]: number } = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
  const transformWeek = (days: string[]): boolean[] => {
    const weekBooleans = Array(7).fill(false);
    days.forEach(day => {
      const dayShort = day.slice(0, 3);
      if (dayMap[dayShort] !== undefined) {
        weekBooleans[dayMap[dayShort]] = true;
      }
    });
    return weekBooleans;
  };
  return apiData.map(item => ({
    id: item.id,
    name: item.name,
    code: item.code,
    week1: transformWeek(item.schedule.week1),
    week2: transformWeek(item.schedule.week2),
    week3: transformWeek(item.schedule.week3),
    week4: transformWeek(item.schedule.week4),
  }));
};

const transformUIToApiSchedule = (pattern: NewWorkingPattern | WorkingPattern) => {
    const booleanToDays = (week: boolean[]) => week.map((isWorking, i) => isWorking ? daysOfWeek[i] : null).filter(Boolean) as string[];
    return {
        week1: booleanToDays(pattern.week1),
        week2: booleanToDays(pattern.week2),
        week3: booleanToDays(pattern.week3),
        week4: booleanToDays(pattern.week4),
    };
};

// --- ASYNC THUNKS ---

export const fetchWorkingPatterns = createAsyncThunk('workingPatterns/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<{ data: WorkingPatternFromAPI[] }>(`${API_BASE_URL}get`);
    const patternsData = response.data.data || response.data;
    return transformApiDataToUI(patternsData);
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch patterns');
    return rejectWithValue('An unknown error occurred.');
  }
});

export const addWorkingPattern = createAsyncThunk('workingPatterns/add', async (newPattern: NewWorkingPattern, { dispatch, rejectWithValue }) => {
    const apiRequestBody = { name: newPattern.name, code: newPattern.code, schedule: transformUIToApiSchedule(newPattern) };
    try {
        const response = await axiosInstance.post<ApiSuccessResponse<WorkingPatternFromAPI>>(`${API_BASE_URL}create`, apiRequestBody);
        dispatch(fetchWorkingPatterns());
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data);
        return rejectWithValue({ message: 'An unknown error occurred.' });
    }
});

// ✨ CORRECTED: Uses the PUT endpoint you specified and handles API response messages
export const updateWorkingPattern = createAsyncThunk(
    'workingPatterns/update', 
    async (pattern: WorkingPattern, { dispatch, rejectWithValue }) => {
    
    const apiRequestBody = { 
        name: pattern.name, 
        code: pattern.code, 
        schedule: transformUIToApiSchedule(pattern) 
    };

    try {
        const response = await axiosInstance.put<ApiSuccessResponse<WorkingPatternFromAPI>>(`${API_BASE_URL}update/${pattern.id}`, apiRequestBody);
        dispatch(fetchWorkingPatterns()); // Refetch list for consistency
        return response.data; // Return full response for toast message
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data);
        return rejectWithValue({ message: 'Failed to update pattern.' });
    }
});

export const deleteWorkingPattern = createAsyncThunk('workingPatterns/delete', async (id: string, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete<ApiSuccessResponse<null>>(`${API_BASE_URL}delete/${id}`);
        dispatch(fetchWorkingPatterns());
        return { ...response.data, id };
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data);
        return rejectWithValue({ message: 'An unknown error occurred.' });
    }
});

// --- SLICE DEFINITION ---

const workingPatternsSlice = createSlice({
  name: 'workingPatterns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkingPatterns.fulfilled, (state, action: PayloadAction<WorkingPattern[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addWorkingPattern.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(updateWorkingPattern.fulfilled, (state) => { state.status = 'succeeded'; })
      .addCase(deleteWorkingPattern.fulfilled, (state) => { state.status = 'succeeded'; })
      .addMatcher(isPending(fetchWorkingPatterns, addWorkingPattern, updateWorkingPattern, deleteWorkingPattern), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchWorkingPatterns, addWorkingPattern, updateWorkingPattern, deleteWorkingPattern), (state, action) => {
          state.status = 'failed';
          state.error = (action.payload as { message?: string })?.message || 'An error occurred.';
      });
  },
});

export default workingPatternsSlice.reducer;