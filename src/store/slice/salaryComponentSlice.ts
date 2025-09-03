import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

const API_BASE_URL = '/payslip/component';
const ADD_API_URL = '/payslip/addComponent';

// --- TYPE DEFINITIONS ---
export interface SalaryComponent {
  id: string;
  showOnPayslip: boolean;
  name: string;
  code: string;
  otherSetting: {
    taxable: boolean;
    leaveBased: boolean;
    CTC: boolean;
    adjustmentBalanced: boolean;
  };
  calculationType: string;
  value: string;
  testAmount: string;
  isDeleted: boolean;
  isDefault: boolean;
  type: string;
  groupId: string;
}

export type NewSalaryComponentPayload = Omit<SalaryComponent, 'id' | 'groupId' | 'isDefault' | 'isDeleted' | 'createdAt'>;

export interface AddComponentThunkArg {
    structureId: string;
    componentData: NewSalaryComponentPayload;
}

export type UpdateComponentPayload = { id: string } & Partial<NewSalaryComponentPayload>;

export interface SalaryComponentGroup {
  count: number;
  components: SalaryComponent[];
}

export type SalaryComponentData = Record<string, SalaryComponentGroup>;

export interface SalaryComponentState {
  data: SalaryComponentData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SalaryComponentState = {
  data: null,
  status: 'idle',
  error: null,
};

// --- ASYNCHRONOUS THUNKS ---
export const fetchSalaryComponents = createAsyncThunk(
  'salaryComponents/fetchById',
  async (structureId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/${structureId}`);
      return response.data as SalaryComponentData;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const addSalaryComponent = createAsyncThunk(
  'salaryComponents/add',
  async ({ structureId, componentData }: AddComponentThunkArg, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${ADD_API_URL}/${structureId}`, componentData);
      return response.data as SalaryComponent;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const updateSalaryComponent = createAsyncThunk(
  'salaryComponents/update',
  async (payload: UpdateComponentPayload, { rejectWithValue }) => {
    try {
        const { id, ...data } = payload;
        const response = await axiosInstance.patch(`${API_BASE_URL}/${id}`, data);
        return response.data as SalaryComponent;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
        return rejectWithValue('An unknown error occurred.');
    }
  }
);

export const deleteSalaryComponent = createAsyncThunk(
  'salaryComponents/delete',
  async (componentId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API_BASE_URL}/${componentId}`);
      return componentId;
    } catch (error) {
      if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
      return rejectWithValue('An unknown error occurred.');
    }
  }
);


const salaryComponentSlice = createSlice({
  name: 'salaryComponents',
  initialState,
  reducers: {
    clearComponents: (state) => {
        state.data = null;
        state.status = 'idle';
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalaryComponents.fulfilled, (state, action: PayloadAction<SalaryComponentData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      // *** THIS IS THE CORRECTED PART ***
      // This logic now correctly handles adding a component even if the initial state is empty.
      .addCase(addSalaryComponent.fulfilled, (state, action: PayloadAction<SalaryComponent>) => {
          const newComponent = action.payload;
          
          // 1. Initialize state.data if it's null
          if (!state.data) {
              state.data = {};
          }

          // 2. Safely add the component to the correct group
          if (state.data[newComponent.type]) {
              state.data[newComponent.type].components.push(newComponent);
              state.data[newComponent.type].count += 1;
          } else {
              state.data[newComponent.type] = {
                  count: 1,
                  components: [newComponent],
              };
          }
          state.status = 'succeeded'; // 3. Ensure status is updated
      })
      .addCase(updateSalaryComponent.fulfilled, (state, action: PayloadAction<SalaryComponent>) => {
          const updatedComponent = action.payload;
          if (state.data && state.data[updatedComponent.type]) {
              const group = state.data[updatedComponent.type];
              const index = group.components.findIndex(c => c.id === updatedComponent.id);
              if (index !== -1) {
                  group.components[index] = updatedComponent;
              }
          }
           state.status = 'succeeded';
      })
      .addCase(deleteSalaryComponent.fulfilled, (state, action: PayloadAction<string>) => {
          const deletedId = action.payload;
          if (state.data) {
              for (const key in state.data) {
                  const group = state.data[key];
                  const initialCount = group.components.length;
                  group.components = group.components.filter(c => c.id !== deletedId);
                  if (group.components.length < initialCount) {
                      group.count = group.components.length;
                      break; // Exit loop once found and deleted
                  }
              }
          }
          state.status = 'succeeded';
      })
      // --- OPTIMIZATION ---
      // Use `addMatcher` to handle common pending and rejected states for all actions
      .addMatcher(isPending(fetchSalaryComponents, addSalaryComponent, updateSalaryComponent, deleteSalaryComponent), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isRejected(fetchSalaryComponents, addSalaryComponent, updateSalaryComponent, deleteSalaryComponent), (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export const { clearComponents } = salaryComponentSlice.actions;
export default salaryComponentSlice.reducer;
