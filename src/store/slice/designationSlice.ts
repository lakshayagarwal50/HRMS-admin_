import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';


const API_BASE_URL = '/designations/';


interface DesignationFromAPI {
  id: string;
  designationName: string; 
  code: string;
  description: string;
  department: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
}


export interface Designation {
  id: string;
  name: string; 
  code: string;
  description: string;
  department: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
}

export type NewDesignation = Omit<Designation, 'id' | 'createdBy' | 'createdAt'>;

export interface DesignationsState {
  items: Designation[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DesignationsState = {
  items: [],
  status: 'idle',
  error: null,
};


const transformApiToUi = (apiData: DesignationFromAPI[]): Designation[] => {
    return apiData.map(item => ({
        ...item,
        name: item.designationName,
    }));
};



export const fetchDesignations = createAsyncThunk('designations/fetchDesignations', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}get`);
    return transformApiToUi(response.data as DesignationFromAPI[]);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations');
    }
    return rejectWithValue('An unknown error occurred');
  }
});

export const addDesignation = createAsyncThunk('designations/addDesignation', async (newDesignation: NewDesignation, { rejectWithValue }) => {
    const apiRequestBody = {
      designationName: newDesignation.name,
      code: newDesignation.code,
      description: newDesignation.description,
      department: newDesignation.department,
      status: newDesignation.status,
    };
    try {
      const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
      const createdDesignation: Designation = {
        ...newDesignation,
        id: response.data.id,
        createdBy: 'current-user-id', 
        createdAt: new Date().toISOString(),
      };
      return createdDesignation;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add designation');
        }
        return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateDesignation = createAsyncThunk('designations/updateDesignation', async (designation: Designation, { rejectWithValue }) => {
    try {
      const { id, name, code, description, department, status } = designation;
      
      const apiRequestBody = {
        designationName: name,
        code,
        description,
        department,
        status,
      };

      await axiosInstance.put(`${API_BASE_URL}update/${id}`, apiRequestBody);
      
      return designation;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update designation');
        }
        return rejectWithValue('An unknown error occurred');
    }
  }
);

const designationSlice = createSlice({
  name: 'designations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.fulfilled, (state, action: PayloadAction<Designation[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addDesignation.fulfilled, (state, action: PayloadAction<Designation>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(updateDesignation.fulfilled, (state, action: PayloadAction<Designation>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addMatcher(isPending(fetchDesignations, addDesignation, updateDesignation), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchDesignations, addDesignation, updateDesignation), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default designationSlice.reducer;

