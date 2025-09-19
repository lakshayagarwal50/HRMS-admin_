// import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services';

// const API_BASE_URL = '/departments/';

// export interface Department {
//   id: string;
//   name: string;
//   code: string;
//   description: string;
//   status: 'active' | 'inactive';
//   createdBy: string;
//   createdAt: string;
// }

// export type NewDepartment = Omit<Department, 'id' | 'createdBy' | 'createdAt' | 'status'>;
// export type UpdateDepartmentPayload = { id: string } & Partial<Omit<Department, 'id' | 'createdBy' | 'createdAt'>>;


// export interface DepartmentsState {
//   items: Department[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: DepartmentsState = {
//   items: [],
//   status: 'idle',
//   error: null,
// };



// export const fetchDepartments = createAsyncThunk(
//     'departments/fetchDepartments', 
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.get(API_BASE_URL);
//             return response.data as Department[];
//         } catch (error) {
//             if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
//             return rejectWithValue('An unknown error occurred.');
//         }
//     }
// );

// export const addDepartment = createAsyncThunk(
//     'departments/addDepartment', 
//     async (newDepartment: NewDepartment, { dispatch, rejectWithValue }) => {
//         try {
//             const payload = { ...newDepartment, status: 'active' };
//             await axiosInstance.post(API_BASE_URL, payload);
        
//             dispatch(fetchDepartments());
//         } catch (error) {
//             if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add department');
//             return rejectWithValue('An unknown error occurred.');
//         }
//     }
// );

// export const updateDepartment = createAsyncThunk(
//     'departments/updateDepartment', 
//     async (department: UpdateDepartmentPayload, { dispatch, rejectWithValue }) => {
//         try {
//             const { id, ...data } = department;
//             await axiosInstance.put(`${API_BASE_URL}${id}`, data);
        
//             dispatch(fetchDepartments());
//         } catch (error) {
//             if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update department');
//             return rejectWithValue('An unknown error occurred.');
//         }
//     }
// );



// const departmentSlice = createSlice({
//   name: 'departments',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(addDepartment.fulfilled, (state) => {
//         state.status = 'loading'; 
//       })
//       .addCase(updateDepartment.fulfilled, (state) => {
//         state.status = 'loading';
//       })
//       .addMatcher(isPending(fetchDepartments, addDepartment, updateDepartment), (state) => {
//           state.status = 'loading';
//           state.error = null;
//       })
//       .addMatcher(isRejected(fetchDepartments, addDepartment, updateDepartment), (state, action) => {
//           state.status = 'failed';
//           state.error = action.payload as string;
//       });
//   },
// });

// export default departmentSlice.reducer;
import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
// Assuming axiosInstance is a pre-configured Axios instance from your services folder
import { axiosInstance } from '../../services';

// --- CONSTANTS ---
const API_BASE_URL = '/departments/';

// --- TYPE DEFINITIONS ---
export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
}

export type NewDepartment = Omit<Department, 'id' | 'createdBy' | 'createdAt' | 'status'>;
export type UpdateDepartmentPayload = { id: string } & Partial<Omit<Department, 'id' | 'createdBy' | 'createdAt'>>;

export interface DepartmentsState {
  items: Department[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DepartmentsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

/**
 * Fetches all departments from the server.
 */
export const fetchDepartments = createAsyncThunk(
    'departments/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Department[]>(API_BASE_URL);
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch departments');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

/**
 * **CORRECTION**: Adds a new department.
 * This thunk now expects the API to return the newly created department object.
 * It no longer dispatches fetchDepartments().
 */
export const addDepartment = createAsyncThunk(
    'departments/add',
    async (newDepartment: NewDepartment, { rejectWithValue }) => {
        try {
            // The API call is made, and we expect the server to respond with the complete
            // data for the newly created department, including its `id`.
            const response = await axiosInstance.post<Department>(API_BASE_URL, newDepartment);
            // The returned data will be passed to the reducer.
            return response.data;
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add department');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

/**
 * **CORRECTION**: Updates an existing department.
 * This thunk now returns its payload to the reducer for a direct state update.
 * It no longer dispatches fetchDepartments().
 */
export const updateDepartment = createAsyncThunk(
    'departments/update',
    async (department: UpdateDepartmentPayload, { rejectWithValue }) => {
        try {
            const { id, ...dataToUpdate } = department;
            await axiosInstance.put(`${API_BASE_URL}${id}`, dataToUpdate);
            // On success, we return the payload that was sent. The reducer will
            // use this data to update the specific department in the state.
            return department;
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update department');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

/**
 * Deletes a department by its ID.
 */
export const deleteDepartment = createAsyncThunk(
    'departments/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${API_BASE_URL}${id}`);
            return id; // Return the ID of the deleted item
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete department');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);

// --- SLICE DEFINITION ---
const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      
      // --- Direct State Updates for Instant UI Feedback ---
      
      // **CORRECTION**: When addDepartment is successful, directly add the new department
      // to the `items` array. This is the key to making the UI update instantly.
      .addCase(addDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      
      // **CORRECTION**: When updateDepartment is successful, find the existing department
      // by its ID and merge the changes.
      .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<UpdateDepartmentPayload>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
            // Use the spread operator to merge existing data with the updated fields.
            state.items[index] = { ...state.items[index], ...action.payload };
        }
      })

      .addCase(deleteDepartment.fulfilled, (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
          state.items = state.items.filter(item => item.id !== action.payload);
      })
      
      // Generic Matchers for Loading and Error States
      .addMatcher(isPending(fetchDepartments, addDepartment, updateDepartment, deleteDepartment), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchDepartments, addDepartment, updateDepartment, deleteDepartment), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default departmentSlice.reducer;
