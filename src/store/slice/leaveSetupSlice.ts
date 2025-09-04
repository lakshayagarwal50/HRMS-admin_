import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services'; 


const API_BASE_URL = '/leaves/';

interface LeaveSetupFromAPI {
  id: string;
  leaveType: string;
  leaveCount: number;
  isCarryForward: boolean;
  
}


export interface LeaveSetup {
  id: string;
  name: string;
  type: 'Every Month' | 'Every Year';
  noOfLeaves: number;
  isCarryForward: 'YES' | 'NO';
  status: 'active' | 'inactive';
  enableLeaveEncashment: boolean;
}

export type NewLeaveSetup = Omit<LeaveSetup, 'id' | 'status'>;

export interface LeaveSetupsState {
  items: LeaveSetup[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LeaveSetupsState = {
  items: [],
  status: 'idle',
  error: null,
};


const transformAPIToUI = (apiData: LeaveSetupFromAPI): LeaveSetup => ({
  id: apiData.id,
  name: apiData.leaveType,
  noOfLeaves: apiData.leaveCount,
  isCarryForward: apiData.isCarryForward ? 'YES' : 'NO',
  type: 'Every Year', 
  status: 'active',
  enableLeaveEncashment: false,
});

const transformUIToAPI = (uiData: NewLeaveSetup | LeaveSetup) => ({
    leaveType: uiData.name,
    leaveCount: uiData.noOfLeaves,
    isCarryForward: uiData.isCarryForward === 'YES',
});



export const fetchLeaveSetups = createAsyncThunk('leaveSetups/fetch', async (_, { rejectWithValue }) => {
  try {

    const response = await axiosInstance.get(`${API_BASE_URL}get`);
    return (response.data as LeaveSetupFromAPI[]).map(transformAPIToUI);
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch setups');
    return rejectWithValue('An unknown error occurred.');
  }
});

export const addLeaveSetup = createAsyncThunk('leaveSetups/add', async (newLeave: NewLeaveSetup, { rejectWithValue }) => {
    try {
        const apiRequestBody = transformUIToAPI(newLeave);
       
        const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
       
        return { ...newLeave, id: response.data.result.id, status: 'active' } as LeaveSetup;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to create leave setup');
        return rejectWithValue('An unknown error occurred.');
    }
});

export const updateLeaveSetup = createAsyncThunk('leaveSetups/update', async (leave: LeaveSetup, { rejectWithValue }) => {
    try {
        const apiRequestBody = transformUIToAPI(leave);
    
        await axiosInstance.put(`${API_BASE_URL}update/${leave.id}`, apiRequestBody);
        return leave; 
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update leave setup');
        return rejectWithValue('An unknown error occurred.');
    }
});

export const deleteLeaveSetup = createAsyncThunk('leaveSetups/delete', async (id: string, { rejectWithValue }) => {
    try {
      
        await axiosInstance.delete(`${API_BASE_URL}delete/${id}`);
        return id; 
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete leave setup');
        return rejectWithValue('An unknown error occurred.');
    }
});



const leaveSetupSlice = createSlice({
  name: 'leaveSetups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveSetups.fulfilled, (state, action: PayloadAction<LeaveSetup[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addLeaveSetup.fulfilled, (state, action: PayloadAction<LeaveSetup>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(updateLeaveSetup.fulfilled, (state, action: PayloadAction<LeaveSetup>) => {
          state.status = 'succeeded';
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteLeaveSetup.fulfilled, (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
          state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addMatcher(isPending(fetchLeaveSetups, addLeaveSetup, updateLeaveSetup, deleteLeaveSetup), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchLeaveSetups, addLeaveSetup, updateLeaveSetup, deleteLeaveSetup), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default leaveSetupSlice.reducer;
