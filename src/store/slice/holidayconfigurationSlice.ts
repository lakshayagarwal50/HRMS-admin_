import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

const API_BASE_URL = '/holidayConfiguraion/';

export interface HolidayConfiguration {
  id: string;
  groupName: string;
  code: string;
  description: string;
  createdBy: string;
  createdAt: string;
}


export type NewHolidayConfiguration = Omit<HolidayConfiguration, 'id' | 'createdBy' | 'createdAt'>;


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


export const fetchHolidayConfigurations = createAsyncThunk('holidayConfigs/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}get`);
    return response.data as HolidayConfiguration[];
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch configurations');
    return rejectWithValue('An unknown error occurred.');
  }
});


export const addHolidayConfiguration = createAsyncThunk('holidayConfigs/add', async (newConfig: NewHolidayConfiguration, { rejectWithValue }) => {
   
    const apiRequestBody = {
        name: newConfig.groupName,
        code: newConfig.code,
        description: newConfig.description,
    };

    try {
        const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
      
        return { 
            ...newConfig, 
            id: response.data.id,
            createdBy: 'current-user-id', 
            createdAt: new Date().toISOString(), 
        } as HolidayConfiguration;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add configuration');
        return rejectWithValue('An unknown error occurred.');
    }
});


export const updateHolidayConfiguration = createAsyncThunk('holidayConfigs/update', async (config: HolidayConfiguration, { rejectWithValue }) => {

    const apiRequestBody = {
        name: config.groupName,
        code: config.code,
        description: config.description,
    };

    try {
        await axiosInstance.put(`${API_BASE_URL}update/${config.id}`, apiRequestBody);
        // Return the original updated object to the reducer
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



const holidayConfigurationSlice = createSlice({
  name: 'holidayConfigurations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchHolidayConfigurations.fulfilled, (state, action: PayloadAction<HolidayConfiguration[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addHolidayConfiguration.fulfilled, (state, action: PayloadAction<HolidayConfiguration>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(updateHolidayConfiguration.fulfilled, (state, action: PayloadAction<HolidayConfiguration>) => {
          state.status = 'succeeded';
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
              state.items[index] = action.payload;
          }
      })
      .addCase(deleteHolidayConfiguration.fulfilled, (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
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
