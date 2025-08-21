import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
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

export type NewSalaryComponentPayload = Omit<SalaryComponent, 'id' | 'groupId' | 'isDefault' | 'isDeleted'>;

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
      .addCase(fetchSalaryComponents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalaryComponents.fulfilled, (state, action: PayloadAction<SalaryComponentData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchSalaryComponents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addSalaryComponent.fulfilled, (state, action: PayloadAction<SalaryComponent>) => {
          const newComponent = action.payload;
          if (state.data) {
              if (state.data[newComponent.type]) {
                  state.data[newComponent.type].components.push(newComponent);
                  state.data[newComponent.type].count += 1;
              } else {
                  state.data[newComponent.type] = {
                      count: 1,
                      components: [newComponent],
                  };
              }
          }
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
                  }
              }
          }
      });
  },
});

export const { clearComponents } = salaryComponentSlice.actions;
export default salaryComponentSlice.reducer;
