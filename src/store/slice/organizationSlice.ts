import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

const API_BASE_URL = '/api/organization-settings/';

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

export const fetchOrganizationSettings = createAsyncThunk(
  'organizationSettings/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}get`);
      return response.data as OrganizationSettings;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
      }
      return rejectWithValue('An unknown error occurred while fetching settings.');
    }
  }
);

export const updateOrganizationSettings = createAsyncThunk(
  'organizationSettings/update',
  // The form data will not include the logoUrl, so we omit it from the type
  async (settings: Omit<OrganizationSettings, 'logoUrl'>, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`${API_BASE_URL}update`, settings);
      // We return the partial data, the reducer will merge it
      return settings as OrganizationSettings;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
      }
      return rejectWithValue('An unknown error occurred while updating settings.');
    }
  }
);

// --- NEW THUNK FOR LOGO UPLOAD ---
export const uploadOrganizationLogo = createAsyncThunk(
    'organizationSettings/uploadLogo',
    async (file: File, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('logo', file); // 'logo' should match your backend's expected field name

        try {
            // Assuming your backend has an endpoint for logo uploads
            const response = await axiosInstance.post(`${API_BASE_URL}upload-logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // The API should return the new URL of the uploaded logo
            return response.data.logoUrl as string;
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to upload logo');
            }
            return rejectWithValue('An unknown error occurred during logo upload.');
        }
    }
);


const organizationSlice = createSlice({
  name: 'organizationSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(updateOrganizationSettings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateOrganizationSettings.fulfilled, (state, action: PayloadAction<OrganizationSettings>) => {
        state.status = 'succeeded';
        if (state.data) {
          // Merge the updated fields without overwriting the logoUrl
          state.data = { ...state.data, ...action.payload };
        }
      })
      .addCase(updateOrganizationSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // --- Reducers for the new logo upload thunk ---
      .addCase(uploadOrganizationLogo.pending, (state) => {
          state.status = 'loading'; // You might want a separate loading state for the logo
          state.error = null;
      })
      .addCase(uploadOrganizationLogo.fulfilled, (state, action: PayloadAction<string>) => {
          state.status = 'succeeded';
          if(state.data) {
              state.data.logoUrl = action.payload;
          }
      })
      .addCase(uploadOrganizationLogo.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload as string;
      });
  },
});

export default organizationSlice.reducer;

