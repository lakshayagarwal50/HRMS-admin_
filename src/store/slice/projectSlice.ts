

// import {
//   createSlice,
//   createAsyncThunk,
//   type PayloadAction,
// } from "@reduxjs/toolkit";
// import { isAxiosError } from "axios";
// import * as projectApi from "../../features/Projects/api/projectapi";
// import type {
//   Project,
//   ProjectResource,
//   ProjectFilters,
// } from "../../types/project";

// // ### Interfaces ###
// interface ProjectState {
//   projects: Project[];
//   currentProject: Project | null;
//   loading: boolean;
//   error: string | null;
//   filters: ProjectFilters;
// }

// // ### Initial State ###
// const initialState: ProjectState = {
//   projects: [],
//   currentProject: null,
//   loading: false,
//   error: null,
//   filters: {
//     status: "All",
//     billingType: "All",
//     startDate: "",
//     endDate: "",
//     searchTerm: "",
//   },
// };

// // ### Helper for Error Handling ###
// const getErrorMessage = (error: any): string => {
//   if (error && typeof error === 'object' && 'message' in error) {
//     return error.message;
//   }
//   if (isAxiosError(error)) {
//     const data = error.response?.data as { message?: string; error?: string };
//     return data?.message || data?.error || "An API error occurred";
//   }
//   if (error instanceof Error) {
//     return error.message;
//   }
//   return "An unknown error occurred";
// };

// // ### Async Thunks ###

// export const fetchProjects = createAsyncThunk(
//   "project/fetchProjects",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await projectApi.fetchProjectsApi();
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const fetchProjectById = createAsyncThunk(
//   "project/fetchProjectById",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       return await projectApi.fetchProjectByIdApi(id);
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const createProject = createAsyncThunk(
//   "project/createProject",
//   async (
//     projectData: Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">,
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await projectApi.createProjectApi(projectData);
//       return response.project;
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const updateProject = createAsyncThunk(
//   "project/updateProject",
//   async (
//     { id, data }: { id: string; data: Partial<Project> },
//     { rejectWithValue }
//   ) => {
//     try {
//       await projectApi.updateProjectApi(id, data);
//       return { projectId: id, updatedFields: data };
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const deleteProject = createAsyncThunk(
//   "project/deleteProject",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await projectApi.deleteProjectApi(id);
//       return response;
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const allocateEmployeeToProject = createAsyncThunk(
//   "project/allocateEmployeeToProject",
//   async (
//     {
//       projectId,
//       resource,
//     }: { projectId: string; resource: Omit<ProjectResource, "id"> },
//     { rejectWithValue }
//   ) => {
//     try {
//       return await projectApi.allocateEmployeeToProjectApi(projectId, resource);
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const updateResourceAllocation = createAsyncThunk(
//   "project/updateResourceAllocation",
//   async (
//     {
//       resourceId,
//       data,
//     }: { resourceId: string; data: Partial<ProjectResource> },
//     { rejectWithValue }
//   ) => {
//     try {
//       return await projectApi.updateResourceAllocationApi(resourceId, data);
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// // export const releaseResource = createAsyncThunk(
// //   "project/releaseResource",
// //   async (resourceId: string, { rejectWithValue }) => {
// //     try {
// //       await projectApi.updateResourceAllocationApi(resourceId, {
// //         isDeleted: true,
// //       });
// //       return { resourceId };
// //     } catch (error) {
// //       return rejectWithValue(getErrorMessage(error));
// //     }
// //   }
// // );

// export const releaseResource = createAsyncThunk(
//   "project/releaseResource",
//   async (resourceId: string, { rejectWithValue }) => {
//     try {
//       // Yahaan hum naye API function ko call kar rahe hain
//       const response = await projectApi.releaseResourceApi(resourceId);
//       return response; // API se mila response return karein
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );
// // ### Slice ###
// const projectSlice = createSlice({
//   name: "project",
//   initialState,
//   reducers: {
//     setFilters: (state, action: PayloadAction<Partial<ProjectFilters>>) => {
//       state.filters = { ...state.filters, ...action.payload };
//     },
//     clearFilters: (state) => {
//       state.filters = initialState.filters;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all projects
//       .addCase(fetchProjects.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(
//         fetchProjects.fulfilled,
//         (state, action: PayloadAction<Project[]>) => {
//           state.loading = false;
//           state.projects = action.payload;
//         }
//       )
//       .addCase(fetchProjects.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Fetch single project
//       .addCase(fetchProjectById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.currentProject = null;
//       })
//       .addCase(
//         fetchProjectById.fulfilled,
//         (state, action: PayloadAction<Project>) => {
//           state.loading = false;
//           state.currentProject = action.payload;
//         }
//       )
//       .addCase(fetchProjectById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.currentProject = null;
//       })

//       // Create project
//       .addCase(createProject.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(
//         createProject.fulfilled,
//         (state, action: PayloadAction<Project>) => {
//           state.loading = false;
//           state.projects.push(action.payload);
//         }
//       )
//       .addCase(createProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Update project
//       .addCase(updateProject.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(updateProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects = state.projects.map((project) =>
//           project.id === action.payload.projectId
//             ? { ...project, ...action.payload.updatedFields }
//             : project
//         );
//         if (
//           state.currentProject &&
//           state.currentProject.id === action.payload.projectId
//         ) {
//           state.currentProject = {
//             ...state.currentProject,
//             ...action.payload.updatedFields,
//           };
//         }
//       })
//       .addCase(updateProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Delete project
//       .addCase(deleteProject.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects = state.projects.filter(
//           (project) => project.id !== action.payload.projectId
//         );
//       })
//       .addCase(deleteProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       // Allocate employee
//       .addCase(allocateEmployeeToProject.fulfilled, (state, action) => {
//         if (
//           state.currentProject &&
//           state.currentProject.id === action.meta.arg.projectId
//         ) {
//           state.currentProject.resources?.push({
//             ...action.meta.arg.resource,
//             id: action.payload.allocationId,
//           });
//         }
//       })
//       .addCase(allocateEmployeeToProject.rejected, (state, action) => {
//         state.error = action.payload as string;
//       })

//       // Update resource allocation
//       .addCase(updateResourceAllocation.fulfilled, (state, action) => {
//         if (state.currentProject?.resources) {
//           state.currentProject.resources = state.currentProject.resources.map(
//             (resource) =>
//               resource.id === action.payload.resourceId
//                 ? { ...resource, ...action.payload.updatedFields }
//                 : resource
//           );
//         }
//       })
//       .addCase(updateResourceAllocation.rejected, (state, action) => {
//         state.error = action.payload as string;
//       })

//       // Release resource (soft delete)
//       .addCase(releaseResource.fulfilled, (state, action) => {
//         if (state.currentProject?.resources) {
//           state.currentProject.resources =
//             state.currentProject.resources.filter(
//               (resource) => resource.id !== action.payload.resourceId
//             );
//         }
//       })
//       .addCase(releaseResource.rejected, (state, action) => {
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { setFilters, clearFilters, clearError } = projectSlice.actions;
// export default projectSlice.reducer;

import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import * as projectApi from "../../features/Projects/api/projectapi";
import type {
  Project,
  ProjectResource,
  ProjectFilters,
} from "../../types/project";

// ### Interfaces ###
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: ProjectFilters;
}

// ### Initial State ###
const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  filters: {
    status: "All",
    billingType: "All",
    startDate: "",
    endDate: "",
    searchTerm: "",
  },
};

// ### Helper for Error Handling ###
const getErrorMessage = (error: any): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message;
  }
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string };
    return data?.message || data?.error || "An API error occurred";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

// ### Async Thunks ###

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      return await projectApi.fetchProjectsApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "project/fetchProjectById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await projectApi.fetchProjectByIdApi(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createProject = createAsyncThunk(
  "project/createProject",
  async (
    projectData: Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">,
    { rejectWithValue }
  ) => {
    try {
      const response = await projectApi.createProjectApi(projectData);
      return response.project;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProject = createAsyncThunk(
  "project/updateProject",
  async (
    { id, data }: { id: string; data: Partial<Project> },
    { rejectWithValue }
  ) => {
    try {
      await projectApi.updateProjectApi(id, data);
      return { projectId: id, updatedFields: data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await projectApi.deleteProjectApi(id);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const allocateEmployeeToProject = createAsyncThunk(
  "project/allocateEmployeeToProject",
  async (
    {
      projectId,
      resource,
    }: { projectId: string; resource: Omit<ProjectResource, "id"> },
    { rejectWithValue }
  ) => {
    try {
      return await projectApi.allocateEmployeeToProjectApi(projectId, resource);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateResourceAllocation = createAsyncThunk(
  "project/updateResourceAllocation",
  async (
    {
      resourceId,
      data,
    }: { resourceId: string; data: Partial<ProjectResource> },
    { rejectWithValue }
  ) => {
    try {
      return await projectApi.updateResourceAllocationApi(resourceId, data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const releaseResource = createAsyncThunk(
  "project/releaseResource",
  async (resourceId: string, { rejectWithValue }) => {
    try {
      const response = await projectApi.releaseResourceApi(resourceId);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
// ### Slice ###
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProjectFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<Project[]>) => {
          state.loading = false;
          state.projects = action.payload;
        }
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single project
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProject = null;
      })
      .addCase(
        fetchProjectById.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          state.currentProject = action.payload;
        }
      )
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentProject = null;
      })

      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        createProject.fulfilled,
        (state, action: PayloadAction<Project>) => {
          state.loading = false;
          state.projects.push(action.payload);
        }
      )
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.map((project) =>
          project.id === action.payload.projectId
            ? { ...project, ...action.payload.updatedFields }
            : project
        );
        if (
          state.currentProject &&
          state.currentProject.id === action.payload.projectId
        ) {
          state.currentProject = {
            ...state.currentProject,
            ...action.payload.updatedFields,
          };
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (project) => project.id !== action.payload.projectId
        );
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Allocate employee
      .addCase(allocateEmployeeToProject.fulfilled, (state, action) => {
        if (
          state.currentProject &&
          state.currentProject.id === action.meta.arg.projectId
        ) {
          state.currentProject.resources?.push({
            ...action.meta.arg.resource,
            id: action.payload.allocationId,
          });
        }
      })
      .addCase(allocateEmployeeToProject.rejected, (state, action) => {
        // This rejection is now handled locally in the component via toast.promise,
        // so we don't need to update the global error state here.
        // The Redux state remains unchanged, preventing the ProjectDetailPage from crashing.
      })

      // Update resource allocation
      .addCase(updateResourceAllocation.fulfilled, (state, action) => {
        if (state.currentProject?.resources) {
          state.currentProject.resources = state.currentProject.resources.map(
            (resource) =>
              resource.id === action.payload.resourceId
                ? { ...resource, ...action.payload.updatedFields }
                : resource
          );
        }
      })
      .addCase(updateResourceAllocation.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Release resource (soft delete)
      .addCase(releaseResource.fulfilled, (state, action) => {
        if (state.currentProject?.resources) {
          state.currentProject.resources =
            state.currentProject.resources.filter(
              (resource) => resource.id !== action.payload.resourceId
            );
        }
      })
      .addCase(releaseResource.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearError } = projectSlice.actions;
export default projectSlice.reducer;