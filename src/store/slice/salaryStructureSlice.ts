// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services';

// const API_BASE_URL = '/payslip/structure';

// export interface SalaryStructure {
//   id: string;
//   groupName: string;
//   code: string;
//   salaryComponent: string[];
//   isDeleted: boolean;
//   description: string;
// }

// export type NewSalaryStructure = {
//   groupName: string;
//   description: string;
//   code: string;
// };

// export type UpdateSalaryStructurePayload = { id: string } & Partial<NewSalaryStructure>;


// export interface SalaryStructureState {
//   data: SalaryStructure[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'mutating';
//   error: string | null;
// }


// const initialState: SalaryStructureState = {
//   data: [],
//   status: 'idle',
//   error: null,
// };


// export const fetchSalaryStructures = createAsyncThunk(
//   'salaryStructures/fetch',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(API_BASE_URL);
//       return response.data as SalaryStructure[];
//     } catch (error) {
//       if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch structures');
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );


// export const addSalaryStructure = createAsyncThunk(
//   'salaryStructures/add',
//   async (newStructure: NewSalaryStructure, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(API_BASE_URL, newStructure);
//       return response.data as SalaryStructure;
//     } catch (error) {
//       if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add structure');
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );


// export const updateSalaryStructure = createAsyncThunk(
//   'salaryStructures/update',
//   async (payload: UpdateSalaryStructurePayload, { rejectWithValue }) => {
//     try {
//       const { id, ...data } = payload;
//       const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, data);
//       return response.data as SalaryStructure;
//     } catch (error) {
//       if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update structure');
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );

// export const deleteSalaryStructure = createAsyncThunk(
//   'salaryStructures/delete',
//   async (id: string, { rejectWithValue }) => {
//     try {
  
//       await axiosInstance.delete(`${API_BASE_URL}/${id}`);
//       return id; 
//     } catch (error) {
//       if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to delete structure');
//       return rejectWithValue('An unknown error occurred.');
//     }
//   }
// );



// const salaryStructureSlice = createSlice({
//   name: 'salaryStructures',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
    
//     const isMutationPending = (action: PayloadAction<unknown>) =>
//       action.type.startsWith('salaryStructures/') && action.type.endsWith('/pending');

   
//     const isMutationRejected = (action: PayloadAction<unknown>) =>
//       action.type.startsWith('salaryStructures/') && action.type.endsWith('/rejected');

//     builder
   
//       .addCase(fetchSalaryStructures.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchSalaryStructures.fulfilled, (state, action: PayloadAction<SalaryStructure[]>) => {
//         state.status = 'succeeded';
//         state.data = action.payload;
//       })
      
  
//       .addCase(addSalaryStructure.fulfilled, (state, action: PayloadAction<SalaryStructure>) => {
//         state.status = 'succeeded';
//         state.data.unshift(action.payload);
//       })

    
//       .addCase(updateSalaryStructure.fulfilled, (state, action: PayloadAction<SalaryStructure>) => {
//         state.status = 'succeeded';
//         const index = state.data.findIndex(s => s.id === action.payload.id);
//         if (index !== -1) {
//           state.data[index] = action.payload;
//         }
//       })
      
     
//       .addCase(deleteSalaryStructure.fulfilled, (state, action: PayloadAction<string>) => {
//         state.status = 'succeeded';
//         state.data = state.data.filter(s => s.id !== action.payload);
//       })

     
//       .addMatcher(isMutationPending, (state) => {
//         state.status = 'mutating'; 
//         state.error = null;
//       })
//       .addMatcher(isMutationRejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload as string;
//       });
//   },
// });

// export default salaryStructureSlice.reducer;

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';
import toast from 'react-hot-toast';

const API_BASE_URL = '/payslip/structure';

export interface SalaryStructure {
  id: string;
  groupName: string;
  code: string;
  salaryComponent: string[];
  isDeleted: boolean;
  description: string;
}

export type NewSalaryStructure = {
  groupName: string;
  description: string;
  code: string;
};

export type UpdateSalaryStructurePayload = { id: string } & Partial<NewSalaryStructure>;


export interface SalaryStructureState {
  data: SalaryStructure[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed' | 'mutating';
  error: string | null;
}


const initialState: SalaryStructureState = {
  data: [],
  status: 'idle',
  error: null,
};

// --- Helper function to extract error messages ---
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
    if (isAxiosError(error) && error.response?.data) {
        // Handle cases where the error is in `data.error` or `data.message`
        return error.response.data.error || error.response.data.message || defaultMessage;
    }
    return defaultMessage;
};


export const fetchSalaryStructures = createAsyncThunk(
  'salaryStructures/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_BASE_URL);
      return response.data as SalaryStructure[];
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to fetch structures');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);


export const addSalaryStructure = createAsyncThunk(
  'salaryStructures/add',
  async (newStructure: NewSalaryStructure, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_BASE_URL, newStructure);
      toast.success('Structure created successfully!');
      return response.data as SalaryStructure;
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to add structure');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);


export const updateSalaryStructure = createAsyncThunk(
  'salaryStructures/update',
  async (payload: UpdateSalaryStructurePayload, { rejectWithValue }) => {
    try {
      const { id, ...data } = payload;
      const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, data);
      toast.success('Structure updated successfully!');
      return response.data as SalaryStructure;
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to update structure');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteSalaryStructure = createAsyncThunk(
  'salaryStructures/delete',
  async (id: string, { rejectWithValue }) => {
    try {
  
      await axiosInstance.delete(`${API_BASE_URL}/${id}`);
      toast.success('Structure deleted successfully!');
      return id; 
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete structure');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);



const salaryStructureSlice = createSlice({
  name: 'salaryStructures',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    
    const isMutationPending = (action: PayloadAction<unknown>) =>
      action.type.startsWith('salaryStructures/') && action.type.endsWith('/pending');

   
    const isMutationRejected = (action: PayloadAction<unknown>) =>
      action.type.startsWith('salaryStructures/') && action.type.endsWith('/rejected');

    builder
   
      .addCase(fetchSalaryStructures.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSalaryStructures.fulfilled, (state, action: PayloadAction<SalaryStructure[]>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSalaryStructures.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  
      .addCase(addSalaryStructure.fulfilled, (state, action: PayloadAction<SalaryStructure>) => {
        state.status = 'succeeded';
        state.data.unshift(action.payload);
      })

    
      .addCase(updateSalaryStructure.fulfilled, (state, action: PayloadAction<SalaryStructure>) => {
        state.status = 'succeeded';
        const index = state.data.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      
     
      .addCase(deleteSalaryStructure.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.data = state.data.filter(s => s.id !== action.payload);
      })

     
      .addMatcher(isMutationPending, (state) => {
        state.status = 'mutating'; 
        state.error = null;
      })
      .addMatcher(isMutationRejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default salaryStructureSlice.reducer;

