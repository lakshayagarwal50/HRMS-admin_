// import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services';

// const API_BASE_URL = '/holidayConfiguraion/';

// export interface HolidayConfiguration {
//   id: string;
//   name: string;
//   code: string;
//   description: string;
//   createdBy: string;
//   createdAt: string;
// }


// export type NewHolidayConfiguration = Omit<HolidayConfiguration, 'id' | 'createdBy' | 'createdAt'>;


// export interface HolidayConfigsState {
//   items: HolidayConfiguration[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: HolidayConfigsState = {
//   items: [],
//   status: 'idle',
//   error: null,
// };


// export const fetchHolidayConfigurations = createAsyncThunk('holidayConfigs/fetch', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get(`${API_BASE_URL}get`);
//     return response.data as HolidayConfiguration[];
//   } catch (error) {
//     if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch configurations');
//     return rejectWithValue('An unknown error occurred.');
//   }
// });


// export const addHolidayConfiguration = createAsyncThunk('holidayConfigs/add', async (newConfig: NewHolidayConfiguration, { rejectWithValue }) => {
   
//     const apiRequestBody = {
//         name: newConfig.name,
//         code: newConfig.code,
//         description: newConfig.description,
//     };

//     try {
//         const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
      
//         return { 
//             ...newConfig, 
//             id: response.data.id,
//             createdBy: 'current-user-id', 
//             createdAt: new Date().toISOString(), 
//         } as HolidayConfiguration;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add configuration');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });


// export const updateHolidayConfiguration = createAsyncThunk('holidayConfigs/update', async (config: HolidayConfiguration, { rejectWithValue }) => {

//     const apiRequestBody = {
//         name: config.name,
//         code: config.code,
//         description: config.description,
//     };

//     try {
//         await axiosInstance.put(`${API_BASE_URL}update/${config.id}`, apiRequestBody);
//         // Return the original updated object to the reducer
//         return config;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update configuration');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });


// export const deleteHolidayConfiguration = createAsyncThunk('holidayConfigs/delete', async (id: string, { rejectWithValue }) => {
//     try {
//         await axiosInstance.delete(`${API_BASE_URL}delete/${id}`);
      
//         return id;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete configuration');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });



// const holidayConfigurationSlice = createSlice({
//   name: 'holidayConfigurations',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
     
//       .addCase(fetchHolidayConfigurations.fulfilled, (state, action: PayloadAction<HolidayConfiguration[]>) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(addHolidayConfiguration.fulfilled, (state, action: PayloadAction<HolidayConfiguration>) => {
//         state.status = 'succeeded';
//         state.items.push(action.payload);
//       })
//       .addCase(updateHolidayConfiguration.fulfilled, (state, action: PayloadAction<HolidayConfiguration>) => {
//           state.status = 'succeeded';
//           const index = state.items.findIndex(item => item.id === action.payload.id);
//           if (index !== -1) {
//               state.items[index] = action.payload;
//           }
//       })
//       .addCase(deleteHolidayConfiguration.fulfilled, (state, action: PayloadAction<string>) => {
//           state.status = 'succeeded';
//           state.items = state.items.filter(item => item.id !== action.payload);
//       })

//       .addMatcher(isPending(fetchHolidayConfigurations, addHolidayConfiguration, updateHolidayConfiguration, deleteHolidayConfiguration), (state) => {
//           state.status = 'loading';
//           state.error = null;
//       })
//       .addMatcher(isRejected(fetchHolidayConfigurations, addHolidayConfiguration, updateHolidayConfiguration, deleteHolidayConfiguration), (state, action) => {
//           state.status = 'failed';
//           state.error = action.payload as string;
//       });
//   },
// });

// export default holidayConfigurationSlice.reducer;


import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- CONSTANTS ---
const API_BASE_URL = '/holidayConfiguration/';

// --- TYPE DEFINITIONS ---

export interface HolidayConfiguration {
  id: string;
  name: string;
  code: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

export type NewHolidayConfiguration = Omit<HolidayConfiguration, 'id' | 'createdBy' | 'createdAt'>;

export type UpdateHolidayConfigurationPayload = { id: string } & Partial<NewHolidayConfiguration>;


export interface HolidayConfigsState {
  items: HolidayConfiguration[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HolidayConfigsState = {
  items: [],
  status: 'idle',
  error: null,
};


// --- ASYNC THUNKS ---

export const fetchHolidayConfigurations = createAsyncThunk('holidayConfigs/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}get`);
    return response.data as HolidayConfiguration[];
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch configurations');
    return rejectWithValue('An unknown error occurred.');
  }
});

// ✨ MODIFIED: The thunk now accepts `thunkAPI` to get access to `dispatch`.
export const addHolidayConfiguration = createAsyncThunk('holidayConfigs/add', async (newConfig: NewHolidayConfiguration, { dispatch, rejectWithValue }) => {
    const apiRequestBody = {
        name: newConfig.name,
        code: newConfig.code,
        description: newConfig.description,
    };
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
        // ✨ ADDED: After a successful creation, dispatch the fetch action to get the latest list.
        dispatch(fetchHolidayConfigurations());
        return response.data as HolidayConfiguration;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add configuration');
        return rejectWithValue('An unknown error occurred.');
    }
});

// ✨ MODIFIED: The thunk now accepts `thunkAPI` to get access to `dispatch`.
export const updateHolidayConfiguration = createAsyncThunk('holidayConfigs/update', async (config: UpdateHolidayConfigurationPayload, { dispatch, rejectWithValue }) => {
    const { id, ...updateData } = config;
    try {
        await axiosInstance.put(`${API_BASE_URL}update/${id}`, updateData);
        // ✨ ADDED: After a successful update, dispatch the fetch action to get the latest list.
        dispatch(fetchHolidayConfigurations());
        return config; 
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update configuration');
        return rejectWithValue('An unknown error occurred.');
    }
});

export const deleteHolidayConfiguration = createAsyncThunk('holidayConfigs/delete', async (id: string, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`${API_BASE_URL}delete/${id}`);
        return id;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete configuration');
        return rejectWithValue('An unknown error occurred.');
    }
});


// --- SLICE DEFINITION ---
const holidayConfigurationSlice = createSlice({
  name: 'holidayConfigurations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHolidayConfigurations.fulfilled, (state, action: PayloadAction<HolidayConfiguration[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null; // Clear previous errors on successful fetch
      })
      .addCase(addHolidayConfiguration.fulfilled, (state, action: PayloadAction<HolidayConfiguration>) => {
        // This provides a fast, optimistic update to the UI.
        // The subsequent fetch will ensure data consistency with the server.
        state.items.push(action.payload);
      })
      .addCase(updateHolidayConfiguration.fulfilled, (state, action: PayloadAction<UpdateHolidayConfigurationPayload>) => {
          // This provides a fast, optimistic update to the UI.
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
              state.items[index] = { ...state.items[index], ...action.payload };
          }
      })
      .addCase(deleteHolidayConfiguration.fulfilled, (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addMatcher(isPending(fetchHolidayConfigurations, addHolidayConfiguration, updateHolidayConfiguration, deleteHolidayConfiguration), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchHolidayConfigurations, addHolidayConfiguration, updateHolidayConfiguration, deleteHolidayConfiguration), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default holidayConfigurationSlice.reducer;
