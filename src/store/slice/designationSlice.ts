// import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// import { axiosInstance } from '../../services';


// const API_BASE_URL = '/designations/';


// interface DesignationFromAPI {
//   id: string;
//   designationName: string; 
//   code: string;
//   description: string;
//   department: string;
//   status: 'active' | 'inactive';
//   createdBy: string;
//   createdAt: string;
// }


// export interface Designation {
//   id: string;
//   name: string; 
//   code: string;
//   description: string;
//   department: string;
//   status: 'active' | 'inactive';
//   createdBy: string;
//   createdAt: string;
// }

// export type NewDesignation = Omit<Designation, 'id' | 'createdBy' | 'createdAt'>;

// export interface DesignationsState {
//   items: Designation[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: DesignationsState = {
//   items: [],
//   status: 'idle',
//   error: null,
// };


// const transformApiToUi = (apiData: DesignationFromAPI[]): Designation[] => {
//     return apiData.map(item => ({
//         ...item,
//         name: item.designationName,
//     }));
// };



// export const fetchDesignations = createAsyncThunk('designations/fetchDesignations', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get(`${API_BASE_URL}get`);
//     return transformApiToUi(response.data as DesignationFromAPI[]);
//   } catch (error: unknown) {
//     if (isAxiosError(error)) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations');
//     }
//     return rejectWithValue('An unknown error occurred');
//   }
// });

// export const addDesignation = createAsyncThunk('designations/addDesignation', async (newDesignation: NewDesignation, { rejectWithValue }) => {
//     const apiRequestBody = {
//       designationName: newDesignation.name,
//       code: newDesignation.code,
//       description: newDesignation.description,
//       department: newDesignation.department,
//       status: newDesignation.status,
//     };
//     try {
//       const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
//       const createdDesignation: Designation = {
//         ...newDesignation,
//         id: response.data.id,
//         createdBy: 'current-user-id', 
//         createdAt: new Date().toISOString(),
//       };
//       return createdDesignation;
//     } catch (error: unknown) {
//         if (isAxiosError(error)) {
//             return rejectWithValue(error.response?.data?.message || 'Failed to add designation');
//         }
//         return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// export const updateDesignation = createAsyncThunk('designations/updateDesignation', async (designation: Designation, { rejectWithValue }) => {
//     try {
//       const { id, name, code, description, department, status } = designation;
      
//       const apiRequestBody = {
//         designationName: name,
//         code,
//         description,
//         department,
//         status,
//       };

//       await axiosInstance.put(`${API_BASE_URL}update/${id}`, apiRequestBody);
      
//       return designation;
//     } catch (error: unknown) {
//         if (isAxiosError(error)) {
//             return rejectWithValue(error.response?.data?.message || 'Failed to update designation');
//         }
//         return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// const designationSlice = createSlice({
//   name: 'designations',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDesignations.fulfilled, (state, action: PayloadAction<Designation[]>) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(addDesignation.fulfilled, (state, action: PayloadAction<Designation>) => {
//         state.status = 'succeeded';
//         state.items.push(action.payload);
//       })
//       .addCase(updateDesignation.fulfilled, (state, action: PayloadAction<Designation>) => {
//         state.status = 'succeeded';
//         const index = state.items.findIndex((item) => item.id === action.payload.id);
//         if (index !== -1) {
//           state.items[index] = action.payload;
//         }
//       })
//       .addMatcher(isPending(fetchDesignations, addDesignation, updateDesignation), (state) => {
//           state.status = 'loading';
//           state.error = null;
//       })
//       .addMatcher(isRejected(fetchDesignations, addDesignation, updateDesignation), (state, action) => {
//           state.status = 'failed';
//           state.error = action.payload as string;
//       });
//   },
// });

// export default designationSlice.reducer;
import { createSlice, createAsyncThunk, isPending, isRejected, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- CONSTANTS ---
const API_BASE_URL = '/designations/';

// --- TYPE DEFINITIONS ---

/**
 * Represents the raw data structure coming directly from the API.
 * The key for the name is `designationName`.
 */
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

/**
 * Represents the clean, consistent data structure used throughout the UI.
 * The `designationName` from the API is mapped to `name`.
 */
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

export type NewDesignation = Omit<Designation, 'id' | 'createdBy' | 'createdAt' | 'status'>;
export type UpdateDesignationPayload = { id: string } & Partial<Omit<Designation, 'id' | 'createdBy' | 'createdAt'>>;
export type UpdateStatusPayload = { id: string; status: 'active' | 'inactive' };

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

// --- DATA TRANSFORMATION HELPERS ---

/**
 * Transforms a single raw API object into the clean UI-ready format.
 */
const transformApiToUi = (item: DesignationFromAPI): Designation => ({
  ...item,
  name: item.designationName,
});

/**
 * Transforms UI data keys into the format required by the API for submission.
 */
const transformUiToApi = (uiData: Partial<NewDesignation>): Partial<Omit<DesignationFromAPI, 'id' | 'createdBy' | 'createdAt'>> => {
  const apiData: Partial<Omit<DesignationFromAPI, 'id' | 'createdBy' | 'createdAt'>> = {};
  if (uiData.name !== undefined) apiData.designationName = uiData.name;
  if (uiData.code !== undefined) apiData.code = uiData.code;
  if (uiData.description !== undefined) apiData.description = uiData.description;
  if (uiData.department !== undefined) apiData.department = uiData.department;
  if (uiData.status !== undefined) apiData.status = uiData.status;
  return apiData;
};

// --- ASYNC THUNKS ---

export const fetchDesignations = createAsyncThunk('designations/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<DesignationFromAPI[]>(`${API_BASE_URL}get`);
    return response.data.map(transformApiToUi);
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations');
    return rejectWithValue('An unknown error occurred');
  }
});

export const addDesignation = createAsyncThunk('designations/add', async (newDesignation: NewDesignation, { rejectWithValue }) => {
  try {
    const apiRequestBody = transformUiToApi({ ...newDesignation, status: 'active' });
    const response = await axiosInstance.post<{ id: string }>(`${API_BASE_URL}create`, apiRequestBody);
    // Return a complete object for the reducer to add to the state directly.
    return {
      ...newDesignation,
      id: response.data.id,
      status: 'active',
      // Mock server-generated fields until a re-fetch or full object response
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
    } as Designation;
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add designation');
    return rejectWithValue('An unknown error occurred');
  }
});

export const updateDesignation = createAsyncThunk('designations/update', async (payload: UpdateDesignationPayload, { rejectWithValue }) => {
  try {
    const { id, ...uiData } = payload;
    const apiRequestBody = transformUiToApi(uiData);
    await axiosInstance.put(`${API_BASE_URL}update/${id}`, apiRequestBody);
    return payload; // Return the original payload for direct state update
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update designation');
    return rejectWithValue('An unknown error occurred');
  }
});

/**
 * This action handles toggling a designation's status between 'active' and 'inactive'.
 * Per your API spec, it uses the DELETE endpoint for this.
 */
export const updateDesignationStatus = createAsyncThunk('designations/updateStatus', async (payload: UpdateStatusPayload, { rejectWithValue }) => {
  try {
    // This uses the DELETE verb as requested by the API specification for status changes.
    await axiosInstance.delete(`${API_BASE_URL}delete/${payload.id}`);
    // We return the original payload so the reducer knows which item to update and what the new status should be.
    return payload;
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    return rejectWithValue('An unknown error occurred');
  }
});

// --- SLICE DEFINITION ---
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
      // --- Direct State Updates for Instant UI Feedback ---
      .addCase(addDesignation.fulfilled, (state, action: PayloadAction<Designation>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(updateDesignation.fulfilled, (state, action: PayloadAction<UpdateDesignationPayload>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      .addCase(updateDesignationStatus.fulfilled, (state, action: PayloadAction<UpdateStatusPayload>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = action.payload.status;
        }
      })
      // --- Generic Matchers for Loading and Error States ---
      .addMatcher(isPending(fetchDesignations, addDesignation, updateDesignation, updateDesignationStatus), (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addMatcher(isRejected(fetchDesignations, addDesignation, updateDesignation, updateDesignationStatus), (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default designationSlice.reducer;
