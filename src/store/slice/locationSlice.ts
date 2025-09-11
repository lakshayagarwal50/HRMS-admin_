// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import { isAxiosError } from 'axios';
// // Assuming you have a configured axios instance in your services folder
// import { axiosInstance } from '../../services'; 

// // --- Base URL for the API endpoint ---
// const API_BASE_URL = '/locations/';

// // --- TYPE DEFINITIONS ---
// // This is the shape of the data coming from the API
// interface LocationFromAPI {
//   id: string;
//   cityName: string;
//   code: string;
//   state: string;
//   status: 'active' | 'inactive';
// }

// // This is the shape of the data our UI components will use
// export interface Location {
//   id: string;
//   city: string;
//   code: string;
//   state: string;
//   status: 'Active' | 'Inactive';
// }

// // Type for creating a new location, omitting the server-generated ID
// export type NewLocation = Omit<Location, 'id'>;

// export interface LocationsState {
//   items: Location[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: LocationsState = {
//   items: [],
//   status: 'idle',
//   error: null,
// };

// // --- DATA TRANSFORMATION ---
// // This function maps the API response to the data structure our UI expects
// const transformApiData = (apiData: LocationFromAPI[]): Location[] => {
//   return apiData.map(item => ({
//     id: item.id,
//     city: item.cityName, // Map cityName to city
//     code: item.code,
//     state: item.state,
//     status: item.status === 'active' ? 'Active' : 'Inactive', // Map status
//   }));
// };

// // --- ASYNC THUNKS ---
// export const fetchLocations = createAsyncThunk('locations/fetch', async (_, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.get(`${API_BASE_URL}get`);
//     // The API response is an array of LocationFromAPI, so we transform it
//     return transformApiData(response.data as LocationFromAPI[]);
//   } catch (error) {
//     if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch locations');
//     return rejectWithValue('An unknown error occurred.');
//   }
// });

// export const addLocation = createAsyncThunk('locations/add', async (newLocation: NewLocation, { rejectWithValue }) => {
//     // Transform UI data to match the API's expected body format
//     const apiRequestBody = {
//         cityName: newLocation.city,
//         code: newLocation.code,
//         state: newLocation.state,
//         status: newLocation.status.toLowerCase() as 'active' | 'inactive',
//     };

//     try {
//         const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
//         // Return a complete Location object to add to the state
//         return { ...newLocation, id: response.data.id } as Location;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add location');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });

// export const updateLocation = createAsyncThunk('locations/update', async (location: Location, { rejectWithValue }) => {
//     const apiRequestBody = {
//         cityName: location.city,
//         code: location.code,
//         state: location.state,
//         status: location.status.toLowerCase() as 'active' | 'inactive',
//     };

//     try {
//         await axiosInstance.put(`${API_BASE_URL}update/${location.id}`, apiRequestBody);
//         return location; // Return the updated location on success
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to update location');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });

// export const toggleLocationStatus = createAsyncThunk('locations/toggleStatus', async (location: Location, { rejectWithValue }) => {
//     try {
//         await axiosInstance.delete(`${API_BASE_URL}delete/${location.id}`);
//         // On success, return the location with the toggled status
//         return { ...location, status: location.status === 'Active' ? 'Inactive' : 'Active' } as Location;
//     } catch (error) {
//         if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to change status');
//         return rejectWithValue('An unknown error occurred.');
//     }
// });


// // --- SLICE DEFINITION ---
// const locationSlice = createSlice({
//   name: 'locations',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Fetch Locations
//       .addCase(fetchLocations.pending, (state) => { state.status = 'loading'; state.error = null; })
//       .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Location[]>) => { state.status = 'succeeded'; state.items = action.payload; })
//       .addCase(fetchLocations.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
      
//       // Add Location
//       .addCase(addLocation.pending, (state) => { state.status = 'loading'; })
//       .addCase(addLocation.fulfilled, (state, action: PayloadAction<Location>) => { state.status = 'succeeded'; state.items.push(action.payload); })
//       .addCase(addLocation.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
      
//       // Update & Toggle Status (both result in an update)
//       .addCase(updateLocation.pending, (state) => { state.status = 'loading'; })
//       .addCase(toggleLocationStatus.pending, (state) => { state.status = 'loading'; })
//       .addCase(updateLocation.fulfilled, (state, action: PayloadAction<Location>) => {
//           state.status = 'succeeded';
//           const index = state.items.findIndex(item => item.id === action.payload.id);
//           if (index !== -1) state.items[index] = action.payload;
//       })
//       .addCase(toggleLocationStatus.fulfilled, (state, action: PayloadAction<Location>) => {
//           state.status = 'succeeded';
//           const index = state.items.findIndex(item => item.id === action.payload.id);
//           if (index !== -1) state.items[index] = action.payload;
//       })
//       .addCase(updateLocation.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
//       .addCase(toggleLocationStatus.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
//   },
// });

// export default locationSlice.reducer;

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import { axiosInstance } from '../../services';

// --- Base URL for the API endpoint ---
const API_BASE_URL = '/locations/';

// --- TYPE DEFINITIONS ---
interface LocationFromAPI {
  id: string;
  cityName: string;
  code: string;
  state: string;
  status: 'active' | 'inactive';
}

export interface Location {
  id:string;
  city: string;
  code: string;
  state: string;
  status: 'Active' | 'Inactive';
}

export type NewLocation = Omit<Location, 'id'>;

export interface LocationsState {
  items: Location[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: LocationsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- DATA TRANSFORMATION ---
const transformApiData = (apiData: LocationFromAPI[]): Location[] => {
  return apiData.map(item => ({
    id: item.id,
    city: item.cityName,
    code: item.code,
    state: item.state,
    status: item.status === 'active' ? 'Active' : 'Inactive',
  }));
};

// --- ASYNC THUNKS ---

// (fetchLocations remains the same)
export const fetchLocations = createAsyncThunk('locations/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}get`);
    return transformApiData(response.data as LocationFromAPI[]);
  } catch (error) {
    if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to fetch locations');
    return rejectWithValue('An unknown error occurred.');
  }
});

// (addLocation remains the same)
export const addLocation = createAsyncThunk('locations/add', async (newLocation: NewLocation, { rejectWithValue }) => {
    const apiRequestBody = {
        cityName: newLocation.city,
        code: newLocation.code,
        state: newLocation.state,
        status: newLocation.status.toLowerCase() as 'active' | 'inactive',
    };
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}create`, apiRequestBody);
        return { ...newLocation, id: response.data.id } as Location;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to add location');
        return rejectWithValue('An unknown error occurred.');
    }
});

// ✅ --- MODIFIED updateLocation THUNK ---
// It now accepts a partial payload with only the changed fields and the ID.
export const updateLocation = createAsyncThunk(
    'locations/update',
    async (locationUpdate: Partial<Location> & { id: string }, { rejectWithValue }) => {
        const { id, ...changes } = locationUpdate;

        // Dynamically build the request body for the API, mapping keys only for changed fields
        const apiRequestBody: { [key: string]: any } = {};
        if (changes.city) apiRequestBody.cityName = changes.city;
        if (changes.code) apiRequestBody.code = changes.code;
        if (changes.state) apiRequestBody.state = changes.state;
        
        try {
            // Using PATCH is semantically more correct for partial updates.
            // If your backend only supports PUT, you can switch this back.
            await axiosInstance.put(`${API_BASE_URL}update/${id}`, apiRequestBody);
            return locationUpdate; // On success, return the object with the changes
        } catch (error) {
            if (isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || 'Failed to update location');
            }
            return rejectWithValue('An unknown error occurred.');
        }
    }
);


// (toggleLocationStatus remains the same)
export const toggleLocationStatus = createAsyncThunk('locations/toggleStatus', async (location: Location, { rejectWithValue }) => {
    try {
        await axiosInstance.delete(`${API_BASE_URL}delete/${location.id}`);
        return { ...location, status: location.status === 'Active' ? 'Inactive' : 'Active' } as Location;
    } catch (error) {
        if (isAxiosError(error)) return rejectWithValue(error.response?.data?.message || 'Failed to change status');
        return rejectWithValue('An unknown error occurred.');
    }
});

// --- SLICE DEFINITION ---
const locationSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Locations
      .addCase(fetchLocations.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchLocations.fulfilled, (state, action: PayloadAction<Location[]>) => { state.status = 'succeeded'; state.items = action.payload; })
      .addCase(fetchLocations.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
      
      // Add Location
      .addCase(addLocation.pending, (state) => { state.status = 'loading'; })
      .addCase(addLocation.fulfilled, (state, action: PayloadAction<Location>) => { state.status = 'succeeded'; state.items.push(action.payload); })
      .addCase(addLocation.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
      
      // Update & Toggle Status
      .addCase(updateLocation.pending, (state) => { state.status = 'loading'; })
      .addCase(toggleLocationStatus.pending, (state) => { state.status = 'loading'; })
      
      // ✅ --- MODIFIED updateLocation.fulfilled REDUCER ---
      // It now merges the partial changes into the existing state object.
      .addCase(updateLocation.fulfilled, (state, action: PayloadAction<Partial<Location> & { id: string }>) => {
          state.status = 'succeeded';
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
              // Merge the changes from the payload into the existing item
              state.items[index] = { ...state.items[index], ...action.payload };
          }
      })
      .addCase(toggleLocationStatus.fulfilled, (state, action: PayloadAction<Location>) => {
          state.status = 'succeeded';
          const index = state.items.findIndex(item => item.id === action.payload.id);
          if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateLocation.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; })
      .addCase(toggleLocationStatus.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string; });
  },
});

export default locationSlice.reducer;
