import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/roles/';

// --- TYPE DEFINITIONS ---
type Permissions = Record<string, Record<string, boolean>>;

// This interface now handles both `id` and `roleId` from your API
interface RoleFromAPI {
  id?: string;
  roleId?: string; // Added to handle the response for a single role
  roleName: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  permissions: Permissions;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
  permissions: Permissions;
}

export type RolePayload = Omit<Role, 'id'>;

export interface RolesState {
  items: Role[];
  selectedRole: Role | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  selectedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RolesState = {
  items: [],
  selectedRole: null,
  status: 'idle',
  selectedStatus: 'idle',
  error: null,
};

// --- DATA TRANSFORMATION ---
const transformToUI = (apiData: RoleFromAPI): Role => ({
    // Corrected: Use `id` or `roleId` to ensure a consistent ID
    id: apiData.id || apiData.roleId || '', 
    name: apiData.roleName,
    code: apiData.code,
    description: apiData.description,
    status: apiData.status === 'active' ? 'Active' : 'Inactive',
    permissions: apiData.permissions,
});

const transformToAPI = (uiData: RolePayload): Omit<RoleFromAPI, 'id' | 'roleId'> => ({
    roleName: uiData.name,
    code: uiData.code,
    description: uiData.description,
    status: uiData.status.toLowerCase() as 'active' | 'inactive',
    permissions: uiData.permissions,
});


// --- ASYNC THUNKS ---
export const fetchRoles = createAsyncThunk('roles/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}get`);
        return (response.data as RoleFromAPI[]).map(transformToUI);
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
        return rejectWithValue('An unknown error occurred.');
    }
});

export const fetchRoleById = createAsyncThunk('roles/fetchById', async (id: string, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}get`, { params: { id } });
        // The API returns an array with one object
        const data = response.data as RoleFromAPI[];
        if (data && data.length > 0) {
            return transformToUI(data[0]);
        }
        return rejectWithValue('Role not found.');
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
        return rejectWithValue('Failed to fetch role details.');
    }
});

export const addRole = createAsyncThunk('roles/create', async (newRole: RolePayload, { rejectWithValue }) => {
    try {
        const apiRequestBody = transformToAPI(newRole);
        const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
        return { ...newRole, id: response.data.id, status: 'Active' } as Role;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
        return rejectWithValue('An unknown error occurred.');
    }
});

export const updateRole = createAsyncThunk('roles/update', async (role: Role, { rejectWithValue }) => {
    try {
        const { id, ...uiData } = role;
        const apiRequestBody = transformToAPI(uiData);
        await axiosInstance.put(`${API_BASE_URL}update/${id}`, apiRequestBody);
        return role;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
        return rejectWithValue('An unknown error occurred.');
    }
});

export const toggleRoleStatus = createAsyncThunk(
    'roles/toggleStatus',
    async (role: Role, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`${API_BASE_URL}delete/${role.id}`);
            return { ...role, status: role.status === 'Active' ? 'Inactive' : 'Active' } as Role;
        } catch (error) {
            if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to change status');
            return rejectWithValue('An unknown error occurred.');
        }
    }
);


// --- SLICE DEFINITION ---
const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
      clearSelectedRole: (state) => {
          state.selectedRole = null;
          state.selectedStatus = 'idle';
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRoles.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchRoles.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
      .addCase(addRole.fulfilled, (state, action) => { state.items.push(action.payload); })
      .addCase(updateRole.fulfilled, (state, action) => {
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(toggleRoleStatus.fulfilled, (state, action) => {
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(fetchRoleById.pending, (state) => { state.selectedStatus = 'loading'; })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
          state.selectedStatus = 'succeeded';
          state.selectedRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
          state.selectedStatus = 'failed';
          state.error = action.payload as string;
      });
  },
});

export const { clearSelectedRole } = roleSlice.actions;
export default roleSlice.reducer;
