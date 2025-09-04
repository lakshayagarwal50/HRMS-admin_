import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

const API_BASE_URL = '/organization-settings/';

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
  async (settings: Omit<OrganizationSettings, 'logoUrl'>, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`${API_BASE_URL}update`, settings);
      return settings as OrganizationSettings;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
      }
      return rejectWithValue('An unknown error occurred while updating settings.');
    }
  }
);

export const uploadOrganizationLogo = createAsyncThunk(
    'organizationSettings/uploadLogo',
    async (file: File, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('logo', file); 

        try {
            
            const response = await axiosInstance.post(`${API_BASE_URL}upload-logo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
          
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
          
          state.data = { ...state.data, ...action.payload };
        }
      })
      .addCase(updateOrganizationSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(uploadOrganizationLogo.pending, (state) => {
          state.status = 'loading'; 
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

