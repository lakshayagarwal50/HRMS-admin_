// import { createSlice, createAsyncThunk, } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services';


// const API_BASE_URL = '/roles/';

// // --- TYPE DEFINITIONS ---
// type Permissions = Record<string, Record<string, boolean>>;


// interface RoleFromAPI {
//   id?: string;
//   roleId?: string; 
//   roleName: string;
//   code: string;
//   description: string;
//   status: 'active' | 'inactive';
//   permissions: Permissions;
// }

// export interface Role {
//   id: string;
//   name: string;
//   code: string;
//   description: string;
//   status: 'Active' | 'Inactive';
//   permissions: Permissions;
// }

// export type RolePayload = Omit<Role, 'id'>;

// export interface RolesState {
//   items: Role[];
//   selectedRole: Role | null;
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   selectedStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: RolesState = {
//   items: [],
//   selectedRole: null,
//   status: 'idle',
//   selectedStatus: 'idle',
//   error: null,
// };

// const transformToUI = (apiData: RoleFromAPI): Role => ({
//     id: apiData.id || apiData.roleId || '', 
//     name: apiData.roleName,
//     code: apiData.code,
//     description: apiData.description,
//     status: apiData.status === 'active' ? 'Active' : 'Inactive',
//     permissions: apiData.permissions,
// });

// const transformToAPI = (uiData: RolePayload): Omit<RoleFromAPI, 'id' | 'roleId'> => ({
//     roleName: uiData.name,
//     code: uiData.code,
//     description: uiData.description,
//     status: uiData.status.toLowerCase() as 'active' | 'inactive',
//     permissions: uiData.permissions,
// });



// export const fetchRoles = createAsyncThunk('roles/fetch', async (_, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`${API_BASE_URL}get`);
//         return (response.data as RoleFromAPI[]).map(transformToUI);
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//         return rejectWithValue('An unknown error occurred.');
//     }
// });

// export const fetchRoleById = createAsyncThunk('roles/fetchById', async (id: string, { rejectWithValue }) => {
//     try {
//         const response = await axiosInstance.get(`${API_BASE_URL}get`, { params: { id } });
//         const data = response.data as RoleFromAPI[];
//         if (data && data.length > 0) {
//             return transformToUI(data[0]);
//         }
//         return rejectWithValue('Role not found.');
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//         return rejectWithValue('Failed to fetch role details.');
//     }
// });

// export const addRole = createAsyncThunk('roles/create', async (newRole: RolePayload, { rejectWithValue }) => {
//     try {
//         const apiRequestBody = transformToAPI(newRole);
//         const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
//         return { ...newRole, id: response.data.id, status: 'Active' } as Role;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//         return rejectWithValue('An unknown error occurred.');
//     }
// });

// export const updateRole = createAsyncThunk('roles/update', async (role: Role, { rejectWithValue }) => {
//     try {
//         const { id, ...uiData } = role;
//         const apiRequestBody = transformToAPI(uiData);
//         await axiosInstance.put(`${API_BASE_URL}update/${id}`, apiRequestBody);
//         return role;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
//         return rejectWithValue('An unknown error occurred.');
//     }
// });

// export const toggleRoleStatus = createAsyncThunk(
//     'roles/toggleStatus',
//     async (role: Role, { rejectWithValue }) => {
//         try {
//             await axiosInstance.delete(`${API_BASE_URL}delete/${role.id}`);
//             return { ...role, status: role.status === 'Active' ? 'Inactive' : 'Active' } as Role;
//         } catch (error) {
//             if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to change status');
//             return rejectWithValue('An unknown error occurred.');
//         }
//     }
// );


// const roleSlice = createSlice({
//   name: 'roles',
//   initialState,
//   reducers: {
//       clearSelectedRole: (state) => {
//           state.selectedRole = null;
//           state.selectedStatus = 'idle';
//       }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchRoles.pending, (state) => { state.status = 'loading'; })
//       .addCase(fetchRoles.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; })
//       .addCase(fetchRoles.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
//       .addCase(addRole.fulfilled, (state, action) => { state.items.push(action.payload); })
//       .addCase(updateRole.fulfilled, (state, action) => {
//           const index = state.items.findIndex(item => item.id === action.payload.id);
//           if (index !== -1) state.items[index] = action.payload;
//       })
//       .addCase(toggleRoleStatus.fulfilled, (state, action) => {
//           const index = state.items.findIndex(item => item.id === action.payload.id);
//           if (index !== -1) state.items[index] = action.payload;
//       })
//       .addCase(fetchRoleById.pending, (state) => { state.selectedStatus = 'loading'; })
//       .addCase(fetchRoleById.fulfilled, (state, action) => {
//           state.selectedStatus = 'succeeded';
//           state.selectedRole = action.payload;
//       })
//       .addCase(fetchRoleById.rejected, (state, action) => {
//           state.selectedStatus = 'failed';
//           state.error = action.payload as string;
//       });
//   },
// });

// export const { clearSelectedRole } = roleSlice.actions;
// export default roleSlice.reducer;
import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

const API_BASE_URL = '/roles/';

// --- TYPE DEFINITIONS ---

type Permissions = Record<string, Record<string, boolean>>;

/**
 * Represents the shape of a Role object as it comes from the API.
 */
interface RoleFromAPI {
  id?: string;
  roleId?: string; 
  roleName: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  permissions: Permissions;
}

/**
 * Represents the shape of a Role object used throughout the UI.
 */
export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
  permissions: Permissions;
}

/**
 * The payload shape for creating a new role.
 */
export type RolePayload = Omit<Role, 'id'>;

/**
 * The payload shape for updating an existing role (requires ID and partial data).
 */
export type UpdateRolePayload = { id: string } & Partial<RolePayload>;

/**
 * A generic shape for successful API responses that include a message.
 */
interface ApiSuccessResponse<T> {
  data: T;
  message: string;
}

/**
 * The shape of the roles state in the Redux store.
 */
export interface RolesState {
  items: Role[];
  selectedRole: Role | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // For the main list
  selectedStatus: 'idle' | 'loading' | 'succeeded' | 'failed'; // For fetching a single item
  error: string | null;
}

const initialState: RolesState = {
  items: [],
  selectedRole: null,
  status: 'idle',
  selectedStatus: 'idle',
  error: null,
};

// --- DATA TRANSFORMERS ---

const transformToUI = (apiData: RoleFromAPI): Role => ({
    id: apiData.id || apiData.roleId || '', 
    name: apiData.roleName,
    code: apiData.code,
    description: apiData.description,
    status: apiData.status === 'active' ? 'Active' : 'Inactive',
    permissions: apiData.permissions,
});

const transformToAPI = (uiData: Partial<RolePayload>): Partial<Omit<RoleFromAPI, 'id' | 'roleId'>> => ({
    ...(uiData.name !== undefined && { roleName: uiData.name }),
    ...(uiData.code !== undefined && { code: uiData.code }),
    ...(uiData.description !== undefined && { description: uiData.description }),
    ...(uiData.status !== undefined && { status: uiData.status.toLowerCase() as 'active' | 'inactive' }),
    ...(uiData.permissions !== undefined && { permissions: uiData.permissions }),
});

// --- ASYNC THUNKS ---

export const fetchRoles = createAsyncThunk('roles/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}get`);
        const rolesData = response.data.data || response.data;

        if (!Array.isArray(rolesData)) {
            throw new Error("API response for roles is not an array");
        }
        
        return (rolesData as RoleFromAPI[]).map(transformToUI);
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
        if (error instanceof Error) return rejectWithValue(error.message);
        return rejectWithValue('An unknown error occurred while fetching roles.');
    }
});

export const fetchRoleById = createAsyncThunk('roles/fetchById', async (id: string, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get<{ data: RoleFromAPI }>(`${API_BASE_URL}get`, { params: { id } });
        return transformToUI(response.data.data);
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message);
        return rejectWithValue('Failed to fetch role details.');
    }
});

export const addRole = createAsyncThunk('roles/create', async (newRole: RolePayload, { dispatch, rejectWithValue }) => {
    try {
        const apiRequestBody = transformToAPI(newRole);
        const response = await axiosInstance.post<ApiSuccessResponse<RoleFromAPI>>(`${API_BASE_URL}create`, apiRequestBody);
        dispatch(fetchRoles()); // Refetch the list for consistency
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data);
        return rejectWithValue({ message: 'An unknown error occurred while creating the role.'});
    }
});

export const updateRole = createAsyncThunk('roles/update', async (payload: UpdateRolePayload, { dispatch, rejectWithValue }) => {
    try {
        const { id, ...updateData } = payload;
        const apiRequestBody = transformToAPI(updateData);
        const response = await axiosInstance.patch<ApiSuccessResponse<RoleFromAPI>>(`${API_BASE_URL}update/${id}`, apiRequestBody);
        dispatch(fetchRoles()); // Refetch the list for consistency
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data);
        return rejectWithValue({ message: 'An unknown error occurred while updating the role.'});
    }
});

export const toggleRoleStatus = createAsyncThunk('roles/toggleStatus', async (role: Role, { dispatch, rejectWithValue }) => {
    try {
        const response = await axiosInstance.delete<{ message: string }>(`${API_BASE_URL}delete/${role.id}`);
        dispatch(fetchRoles()); // Refetch the list for consistency
        return { ...response.data, id: role.id };
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data);
        return rejectWithValue({ message: 'Failed to change the role status.'});
    }
});

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
      // -- FULFILLED STATES --
      .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
          state.status = 'succeeded';
          state.items = action.payload;
      })
      .addCase(fetchRoleById.fulfilled, (state, action: PayloadAction<Role>) => {
          state.selectedStatus = 'succeeded';
          state.selectedRole = action.payload;
      })
      // Mutation thunks are fulfilled, but the list update is handled by the refetch
      .addCase(addRole.fulfilled, (state) => {
          state.status = 'succeeded';
      })
      .addCase(updateRole.fulfilled, (state) => {
          state.status = 'succeeded';
      })
      .addCase(toggleRoleStatus.fulfilled, (state) => {
          state.status = 'succeeded';
      })

      // -- PENDING STATES --
      .addMatcher(isPending(fetchRoles, addRole, updateRole, toggleRoleStatus), (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addMatcher(isPending(fetchRoleById), (state) => {
          state.selectedStatus = 'loading';
          state.error = null;
      })

      // -- REJECTED STATES --
      .addMatcher(isRejected(fetchRoles, addRole, updateRole, toggleRoleStatus), (state, action) => {
          state.status = 'failed';
          state.error = (action.payload as { message?: string })?.message || 'An error occurred.';
      })
      .addMatcher(isRejected(fetchRoleById), (state, action) => {
          state.selectedStatus = 'failed';
          state.error = (action.payload as { message?: string })?.message || 'An error occurred.';
      });
  },
});

export const { clearSelectedRole } = roleSlice.actions;
export default roleSlice.reducer;