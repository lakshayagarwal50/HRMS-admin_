// // src/features/departments/departmentSlice.ts

// import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';

// // --- CONSTANTS ---
// const API_URL = 'http://172.50.5.116:3000/api/departments/';
// // WARNING: Storing tokens directly in code is insecure. Use environment variables or a secure auth context.
// const FIREBASE_ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1MWRkZTkzMmViYWNkODhhZmIwMDM3YmZlZDhmNjJiMDdmMDg2NmIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoic2hhbmF5YSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ocm1zLTI5M2FiIiwiYXVkIjoiaHJtcy0yOTNhYiIsImF1dGhfdGltZSI6MTc1NDA0MTkyMSwidXNlcl9pZCI6IlFUMUMwYkhmR29XYkZrOGpOZ1EzZnRCR0hJYjIiLCJzdWIiOiJRVDFDMGJIZkdvV2JGazhqTmdRM2Z0QkdISWIyIiwiaWF0IjoxNzU0MDQxOTIxLCJleHAiOjE3NTQwNDU1MjEsImVtYWlsIjoic2hhbmF5YTExQHN1cGVyYWRtaW4uY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInNoYW5heWExMUBzdXBlcmFkbWluLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.UQP2wMMPER-HCQ5CdRINnmETXkNlq3ucbwS-OhqLsDaR3ffCIb3dp48WiucAgf3i33HNZ_TvpTuUPqgZshpgR6m3eJqTUPOKAwGANiNNl4xz3e35QfFrlaCWj8JRywIedDC5la9H0kurkVFvYlgvsfkU294h_cAq-btUlbJncHsaOr4J9-ETonF_4fyiqYht0KLU5UJy9NVH1pb2zkIOr1WZZYkbX3I77gjS3urZL0x20-obd72PaCKRVm2a0fcyk6S4V51nUIL-ZApw1h6ChApqne0uDzZu7-CdbaAG8vedW4AjULCHtSMouKP_WHWSdgKPk09WH_Da2cYEwO5G3g';

// // --- TYPE DEFINITIONS based on API response ---
// export interface Department {
//   id: string;
//   name: string;
//   code: string;
//   description: string;
//   status: 'active' | 'inactive';
//   createdBy: string;
//   createdAt: string;
// }

// // Type for creating a new department (excluding server-generated fields)
// export type NewDepartment = Omit<Department, 'id' | 'createdBy' | 'createdAt'>;

// export interface DepartmentsState {
//   items: Department[];
//   status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   error: string | null;
// }

// const initialState: DepartmentsState = {
//   items: [],
//   status: 'idle',
//   error: null,
// };

// // --- ASYNC THUNKS ---

// // GET /api/departments/
// export const fetchDepartments = createAsyncThunk('departments/fetchDepartments', async () => {
//   const response = await axios.get(API_URL, {
//     headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
//   });
//   return response.data as Department[];
// });

// // POST /api/departments/
// export const addDepartment = createAsyncThunk('departments/addDepartment', async (newDepartment: NewDepartment) => {
//   const response = await axios.post(API_URL, newDepartment, {
//     headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
//   });
//   return response.data as Department;
// });

// // PUT /api/departments/:id
// export const updateDepartment = createAsyncThunk('departments/updateDepartment', async (department: Department) => {
//   const { id, ...data } = department;
//   const response = await axios.put(`${API_URL}${id}`, data, {
//     headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
//   });
//   return response.data as Department;
// });

// // --- SLICE DEFINITION ---
// const departmentSlice = createSlice({
//   name: 'departments',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDepartments.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
//         state.status = 'succeeded';
//         state.items = action.payload;
//       })
//       .addCase(fetchDepartments.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message || 'Failed to fetch departments';
//       })
//       .addCase(addDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
//         state.items.push(action.payload);
//       })
//       .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
//         const index = state.items.findIndex((dep) => dep.id === action.payload.id);
//         if (index !== -1) {
//           state.items[index] = action.payload;
//         }
//       });
//   },
// });

// export default departmentSlice.reducer;


// src/features/departments/departmentSlice.ts
// src/store/slice/departmentSlice.ts

// src/store/slice/departmentSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// --- CONSTANTS ---
const API_URL = 'http://172.50.5.116:3000/api/departments/';
// WARNING: Storing tokens directly in code is insecure and will expire. 
// This should be managed through an authentication context or a more secure mechanism.
const FIREBASE_ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk1MWRkZTkzMmViYWNkODhhZmIwMDM3YmZlZDhmNjJiMDdmMDg2NmIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoic2hhbmF5YSIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9ocm1zLTI5M2FiIiwiYXVkIjoiaHJtcy0yOTNhYiIsImF1dGhfdGltZSI6MTc1NDA0NjgyOCwidXNlcl9pZCI6IlFUMUMwYkhmR29XYkZrOGpOZ1EzZnRCR0hJYjIiLCJzdWIiOiJRVDFDMGJIZkdvV2JGazhqTmdRM2Z0QkdISWIyIiwiaWF0IjoxNzU0MDQ2ODI4LCJleHAiOjE3NTQwNTA0MjgsImVtYWlsIjoic2hhbmF5YTExQHN1cGVyYWRtaW4uY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInNoYW5heWExMUBzdXBlcmFkbWluLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.nCovfQ33wyiNj5illmlz8QlYy8gs8BNa1feAsmdRZ-vAyr6QRB4pueyrNgfaAeDWiiam5rp7DQcnk25X-gkZhX9-Ab4hrJd7B0gy3NiKis0S6Bw9mZRgizABBy5uSE2T2DsYrNNa5agfjP-AkRn4cb1w0y-dECGnivV4P6qZSAmxjHBMGk_pUI_sh1-KYRzexyB3U44QTa0ZWNvsMMc263rUeJlyIAeOsBPMZQWHcL0m_hsARmFPqOVIpWkh7Nad_5y0GaecPJAduovd0lLiNrip3GjTj5K0d0vK_9U-964V9pivupz8aEtwgTjjNKfDJQba7D0e2y4vuP3IzYpsfg';

// --- TYPE DEFINITIONS ---
export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  status: 'active' | 'inactive';
  createdBy: string;
  createdAt: string;
}

export type NewDepartment = Omit<Department, 'id' | 'createdBy' | 'createdAt'>;

export interface DepartmentsState {
  items: Department[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DepartmentsState = {
  items: [],
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---

export const fetchDepartments = createAsyncThunk('departments/fetchDepartments', async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
  });
  return response.data as Department[];
});

export const addDepartment = createAsyncThunk('departments/addDepartment', async (newDepartment: NewDepartment) => {
    const response = await axios.post(API_URL, newDepartment, {
      headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
    });
    const { id } = response.data;
    const createdDepartment: Department = {
      ...newDepartment,
      id: id,
      createdBy: 'current-user-id',
      createdAt: new Date().toISOString(),
    };
    return createdDepartment;
  }
);

export const updateDepartment = createAsyncThunk('departments/updateDepartment', async (department: Department) => {
    const { id, ...data } = department;
    await axios.put(`${API_URL}${id}`, data, {
      headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
    });
    return department;
  }
);

/**
 * DEACTIVATE: Uses the DELETE endpoint to mark a department as 'inactive'.
 */
export const deactivateDepartment = createAsyncThunk('departments/deactivateDepartment', async (department: Department) => {
    await axios.delete(`${API_URL}${department.id}`, {
      headers: { Authorization: `Bearer ${FIREBASE_ID_TOKEN}` },
    });
    // Return a copy of the department with the status changed to 'inactive'
    return { ...department, status: 'inactive' as const };
  }
);


// --- SLICE DEFINITION ---
const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for Fetching Data
      .addCase(fetchDepartments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch departments';
      })

      // Case for Adding a Department
      .addCase(addDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        state.items.push(action.payload);
      })
      
      // Case for Updating a Department (from the edit form)
      .addCase(updateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        const index = state.items.findIndex((dep) => dep.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      
      // Case for Deactivating a Department
      .addCase(deactivateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
        const index = state.items.findIndex((dep) => dep.id === action.payload.id);
        if (index !== -1) {
          // Replace the item with the updated one (status is now 'inactive')
          state.items[index] = action.payload;
        }
      });
  },
});

export default departmentSlice.reducer;
