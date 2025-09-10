// import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services';

// // --- Base URL for the API endpoint ---
// const API_BASE_URL = '/ratings/';

// // --- TYPE DEFINITIONS ---

// // Shape of the raw data coming directly from the API
// interface RatingFromAPI {
//   id: string;
//   empName: string;
//   code: string;
//   department: string;
//   designation: string;
//   yearOfExperience: number;
//   overallAverage: number;
//   ratings?: RatingsByMonth; 
// }

// export interface Scores {
//     clearGoals: number;
//     accountability: number;
//     teamwork: number;
//     technicalSkills: number;
//     communicationLevels: number;
//     conflictsWellManaged: number;
// }
// export interface ProjectRating {
//     projectName: string;
//     scores: Scores;
//     overallProjectRating: number;
// }
// export interface MonthData {
//     projects: ProjectRating[];
//     monthlyAverage: number;
// }
// export type RatingsByMonth = Record<string, MonthData>;

// // This is the clean, transformed shape of the data our UI components will use
// export interface EmployeeRating {
//   id: string;
//   employee: string;
//   code: string;
//   department: string;
//   designation: string;
//   yearOfExperience: number;
//   overallAverageRating: number;
//   ratings: RatingsByMonth;
// }

// export interface UpdateRatingPayload {
//     employeeId: string;
//     year: string;
//     month: string;
//     projectName: string;
//     scores: Scores;
//     areaOfDevelopment?: string;
// }

// export interface EmployeesRatingState {
//   items: EmployeeRating[];
//   selectedRating: EmployeeRating | null;
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   selectedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: EmployeesRatingState = {
//   items: [],
//   selectedRating: null,
//   status: 'idle',
//   selectedStatus: 'idle',
//   error: null,
// };

// // --- DATA TRANSFORMATION ---
// const transformApiData = (apiData: RatingFromAPI[]): EmployeeRating[] => {
//   return apiData.map(item => ({
//     id: item.id,
//     employee: item.empName,
//     code: item.code,
//     department: item.department,
//     designation: item.designation,
//     yearOfExperience: item.yearOfExperience,
//     overallAverageRating: item.overallAverage,
//     ratings: item.ratings || {},
//   }));
// };

// // --- ASYNC THUNKS ---
// export const fetchEmployeeRatings = createAsyncThunk( 'employeesRating/fetch', async (filters: { department?: string; year?: string } | null, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`${API_BASE_URL}get`, { params: filters || {} });
//         return transformApiData(response.data.data);
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//         return rejectWithValue('An unknown error occurred.');
//     }
// });

// export const fetchEmployeeRatingById = createAsyncThunk( 'employeesRating/fetchById', async ({ employeeId, year }: { employeeId: string; year: string }, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`${API_BASE_URL}get`, { params: { employeeId, year } });
//         const transformedData = transformApiData(response.data.data);
//         return transformedData[0];
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//         return rejectWithValue('Failed to fetch rating details.');
//     }
// });

// export const updateEmployeeRating = createAsyncThunk(
//     'employeesRating/update',
//     async (payload: UpdateRatingPayload, { rejectWithValue, dispatch }) => {
//         try {
//             await axiosInstance.put(`${API_BASE_URL}update`, payload);
//             // After a successful update, re-fetch the data to ensure UI is in sync
//             const { employeeId, year } = payload;
//             // We return the result of the fetch thunk so the state is updated with the latest data
//             return await dispatch(fetchEmployeeRatingById({ employeeId, year })).unwrap();
//         } catch (error) {
//             if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//             return rejectWithValue('Failed to update rating.');
//         }
//     }
// );


// // --- SLICE DEFINITION ---
// const employeesRatingSlice = createSlice({
//   name: 'employeesRating',
//   initialState,
//   reducers: {
//       clearSelectedRating: (state) => {
//           state.selectedRating = null;
//           state.selectedStatus = 'idle';
//       }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchEmployeeRatings.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(fetchEmployeeRatingById.fulfilled, (state, action) => {
//           state.selectedStatus = 'succeeded';
//           state.selectedRating = action.payload;
//       })
//       .addCase(updateEmployeeRating.fulfilled, (state, action: PayloadAction<EmployeeRating>) => {
//           state.selectedStatus = 'succeeded';
//           state.selectedRating = action.payload;
//           // Also update the item in the main list if it exists
//           const index = state.items.findIndex(item => item.id === action.payload.id);
//           if (index !== -1) {
//               state.items[index] = action.payload;
//           }
//       })
//       // Use addMatcher for shared pending/rejected logic
//       .addMatcher(isPending(fetchEmployeeRatings, fetchEmployeeRatingById, updateEmployeeRating), (state, action) => {
//           // Differentiate between list loading and detail loading
//           if(action.type.includes('fetchById') || action.type.includes('update')) {
//               state.selectedStatus = 'loading';
//           } else {
//               state.status = 'loading';
//           }
//           state.error = null;
//       })
//       .addMatcher(isRejected(fetchEmployeeRatings, fetchEmployeeRatingById, updateEmployeeRating), (state, action) => {
//           if(action.type.includes('fetchById') || action.type.includes('update')) {
//               state.selectedStatus = 'failed';
//           } else {
//               state.status = 'failed';
//           }
//           state.error = action.payload as string;
//       });
//   },
// });

// export const { clearSelectedRating } = employeesRatingSlice.actions;
// export default employeesRatingSlice.reducer;

import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/ratings/';

// --- TYPE DEFINITIONS ---

// Shape of the raw data coming directly from the API
interface RatingFromAPI {
  id: string;
  empName: string;
  code: string;
  department: string;
  designation: string;
  yearOfExperience: number;
  overallAverage: number;
  ratings?: RatingsByMonth; 
}

export interface Scores {
    clearGoals: number;
    accountability: number;
    teamwork: number;
    technicalSkills: number;
    communicationLevels: number;
    conflictsWellManaged: number;
}
export interface ProjectRating {
    projectName: string;
    scores: Scores;
    overallProjectRating: number;
}
export interface MonthData {
    projects: ProjectRating[];
    monthlyAverage: number;
}
export type RatingsByMonth = Record<string, MonthData>;

// This is the clean, transformed shape of the data our UI components will use
export interface EmployeeRating {
  id: string;
  employee: string;
  code: string;
  department: string;
  designation: string;
  yearOfExperience: number;
  overallAverageRating: number;
  ratings: RatingsByMonth;
}

export interface UpdateRatingPayload {
    employeeId: string;
    year: string;
    month: string;
    projectName: string;
    scores: Partial<Scores>;
    areaOfDevelopment?: string;
}

export interface EmployeesRatingState {
  items: EmployeeRating[];
  selectedRating: EmployeeRating | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EmployeesRatingState = {
  items: [],
  selectedRating: null,
  status: 'idle',
  selectedStatus: 'idle',
  error: null,
};

// --- DATA TRANSFORMATION ---
// This function maps the API response (e.g., empName) to the data structure our UI expects (e.g., employee)
const transformApiData = (apiData: RatingFromAPI[]): EmployeeRating[] => {
  return apiData.map(item => ({
    id: item.id,
    employee: item.empName,
    code: item.code,
    department: item.department,
    designation: item.designation,
    yearOfExperience: item.yearOfExperience,
    overallAverageRating: item.overallAverage,
    ratings: item.ratings || {},
  }));
};

// --- ASYNCHRONOUS THUNKS ---
export const fetchEmployeeRatings = createAsyncThunk( 'employeesRating/fetch', async (filters: { department?: string; year?: string } | null, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}get`, { params: filters || {} });
        return transformApiData(response.data.data);
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
        return rejectWithValue('An unknown error occurred.');
    }
});

export const fetchEmployeeRatingById = createAsyncThunk( 'employeesRating/fetchById', async ({ employeeId, year }: { employeeId: string; year: string }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}get`, { params: { employeeId, year } });
        const transformedData = transformApiData(response.data.data);
        return transformedData[0]; // The API returns an array, so we take the first element
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
        return rejectWithValue('Failed to fetch rating details.');
    }
});

export const updateEmployeeRating = createAsyncThunk(
    'employeesRating/update',
    async (payload: UpdateRatingPayload, { rejectWithValue, dispatch }) => {
        try {
            await axiosInstance.put(`${API_BASE_URL}update`, payload);
            // After a successful update, re-fetch the data to ensure UI is in sync
            const { employeeId, year } = payload;
            // We return the result of the fetch thunk so the state is updated with the latest data
            return await dispatch(fetchEmployeeRatingById({ employeeId, year })).unwrap();
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
            return rejectWithValue('Failed to update rating.');
        }
    }
);


// --- SLICE DEFINITION ---
const employeesRatingSlice = createSlice({
  name: 'employeesRating',
  initialState,
  reducers: {
      // This reducer is used to clear the detail view when the user navigates away
      clearSelectedRating: (state) => {
          state.selectedRating = null;
          state.selectedStatus = 'idle';
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeRatings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchEmployeeRatingById.fulfilled, (state, action) => {
          state.selectedStatus = 'succeeded';
          state.selectedRating = action.payload;
      })
      // This reducer ensures that after an update, both the detailed view and the main list are updated
      .addCase(updateEmployeeRating.fulfilled, (state, action: PayloadAction<EmployeeRating>) => {
          state.selectedStatus = 'succeeded';
          state.selectedRating = action.payload;
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
              // Update the overall rating in the main list
              state.items[index].overallAverageRating = action.payload.overallAverageRating;
          }
      })
      // Use `addMatcher` for shared pending/rejected logic, which keeps the code clean
      .addMatcher(isPending(fetchEmployeeRatings, fetchEmployeeRatingById, updateEmployeeRating), (state, action) => {
          // Differentiate between loading the main list vs. loading the detail view
          if(action.type.includes('fetchById') || action.type.includes('update')) {
              state.selectedStatus = 'loading';
          } else {
              state.status = 'loading';
          }
          state.error = null;
      })
      .addMatcher(isRejected(fetchEmployeeRatings, fetchEmployeeRatingById, updateEmployeeRating), (state, action) => {
          if(action.type.includes('fetchById') || action.type.includes('update')) {
              state.selectedStatus = 'failed';
          } else {
              state.status = 'failed';
          }
          state.error = action.payload as string;
      });
  },
});

export const { clearSelectedRating } = employeesRatingSlice.actions;
export default employeesRatingSlice.reducer;

