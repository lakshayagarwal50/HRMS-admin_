// src/store/slice/organizationSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// --- CONSTANTS ---
const API_BASE_URL = 'http://172.50.5.49:3000/api/organization-settings/';
// WARNING: Storing tokens directly in code is insecure and will expire.
const FIREBASE_ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1MWRkZTkzMmViYWNkODhhZmIwMDM3YmZlZDhmNjJiMDdmMDg2NmIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU3VwZXJBZG1pbiIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ocm1zLTI5M2FiIiwiYXVkIjoiaHJtcy0yOTNhYiIsImF1dGhfdGltZSI6MTc1NDMxMTkzMCwidXNlcl9pZCI6IlN0Vjd0RU1heUljZzVndnU1bTRtYjNVcUhTNzIiLCJzdWIiOiJTdFY3dEVNYXlJY2c1Z3Z1NW00bWIzVXFIUzcyIiwiaWF0IjoxNzU0MzExOTMwLCJleHAiOjE3NTQzMTU1MzAsImVtYWlsIjoiYWRtaW5Ac3VwZXJhZG1pbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYWRtaW5Ac3VwZXJhZG1pbi5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.eJ-dK31AWS0DG7lcvWF0cgaIdgaPb0iofAXirdJW0DPbvcMEqMK5-zdNKRGzLDOIySOeJRrS_fr7qtpafY-K2Eixi6rTbXjDfsFLwNdp9ayvpIa-Hrsekzo37bV0iwm9xd73JPmyvAwu4cAh1WZ5ReuAslTW-nGpwPy35b9jLV17ad4UJu8gkUlTyOg8dowMrCOH4pHi66aCdcWUbmXGpuSi5FzAg65cFCXZMACPIiV2kJvDrb62dYpWpf8ijc36RNLKxagY1ZLywXrRW0mQI95tKJrL43Gk8Cbb5XXH2tbJL5ynBw67AfiNHSA5fpEd31ibLus-gbMUIqw_cWsXhQ';

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

export const fetchOrganizationSettings = createAsyncThunk('organizationSettings/fetch', async () => {
  const response = await axios.get(`${API_BASE_URL}get`, {
    headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
  });
  return response.data as OrganizationSettings;
});

export const updateOrganizationSettings = createAsyncThunk('organizationSettings/update', async (settings: OrganizationSettings) => {
    await axios.put(`${API_BASE_URL}update`, settings, {
      headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
    });
    return settings;
  }
);

// --- SLICE DEFINITION ---
const organizationSlice = createSlice({
  name: 'organizationSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrganizationSettings.fulfilled, (state, action: PayloadAction<OrganizationSettings>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchOrganizationSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch settings';
      })
      .addCase(updateOrganizationSettings.fulfilled, (state, action: PayloadAction<OrganizationSettings>) => {
        state.data = action.payload;
        state.status = 'succeeded';
      });
  },
});

export default organizationSlice.reducer;
