import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios, { isAxiosError } from 'axios';

// --- CONSTANTS ---
const API_BASE_URL = 'http://172.50.5.116:3000/api/organization-settings/';

// --- HELPER FUNCTION ---
const getAuthToken = (): string | null => {
  return localStorage.getItem('token'); // Make sure the key matches what you use
};

// --- TYPE DEFINITIONS ---
export interface OrganizationSettings {
  id?: string;
  companyName: string;
  email: string;
  contactNumber: string;
  website: string;
  pan: string;
  gstin: string;
  aadhaarNumber: string;
  serviceTaxNumber: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  zipCode: string;
  logoUrl: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface OrgSettingsState {
  data: OrganizationSettings | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrgSettingsState = {
  data: null,
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

export const fetchOrganizationSettings = createAsyncThunk('organizationSettings/fetch', async (_, { rejectWithValue }) => {
  const token = getAuthToken();
  if (!token) {
    return rejectWithValue('Authentication token not found.');
  }
  try {
    const response = await axios.get(`${API_BASE_URL}get`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as OrganizationSettings;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
    return rejectWithValue('An unknown error occurred while fetching settings.');
  }
});

export const updateOrganizationSettings = createAsyncThunk('organizationSettings/update', async (settings: OrganizationSettings, { rejectWithValue }) => {
  const token = getAuthToken();
  if (!token) {
    return rejectWithValue('Authentication token not found.');
  }
  try {
    await axios.put(`${API_BASE_URL}update`, settings, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return settings;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
    return rejectWithValue('An unknown error occurred while updating settings.');
  }
});

// --- SLICE DEFINITION ---
const organizationSlice = createSlice({
  name: 'organizationSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Settings
      .addCase(fetchOrganizationSettings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrganizationSettings.fulfilled, (state, action: PayloadAction<OrganizationSettings>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOrganizationSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update Settings
      .addCase(updateOrganizationSettings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateOrganizationSettings.fulfilled, (state, action: PayloadAction<OrganizationSettings>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateOrganizationSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default organizationSlice.reducer;
