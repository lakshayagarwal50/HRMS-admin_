// // store/slice/projectSlice.ts
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios, { AxiosError } from "axios";
// import type { Project, ProjectResource, ProjectFilters } from "../../types/project";

// // Define the base URL for API requests (configure as needed)
// // const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
// const API_BASE_URL =  "http://localhost:3000";

// // Define interfaces for state and API responses
// interface ProjectState {
//   projects: Project[];
//   currentProject: Project | null;
//   loading: boolean;
//   error: string | null;
//   filters: ProjectFilters;
// }

// interface ErrorResponse {
//   message: string;
// }

// // Initial state
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

// // Async thunks for API calls
// export const fetchProjects = createAsyncThunk<
//   Project[],
//   void,
//   { rejectValue: ErrorResponse }
// >("project/fetchProjects", async (_, { rejectWithValue }) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/project`);
//     return response.data;
//   } catch (error) {
//     const axiosError = error as AxiosError<ErrorResponse>;
//     return rejectWithValue(
//       axiosError.response?.data || { message: "Failed to fetch projects" }
//     );
//   }
// });

// export const fetchProjectById = createAsyncThunk<
//   Project,
//   string,
//   { rejectValue: ErrorResponse }
// >("project/fetchProjectById", async (id, { rejectWithValue }) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/project/${id}`);
//     return response.data;
//   } catch (error) {
//     const axiosError = error as AxiosError<ErrorResponse>;
//     return rejectWithValue(
//       axiosError.response?.data || { message: "Failed to fetch project" }
//     );
//   }
// });

// export const createProject = createAsyncThunk<
//   Project,
//   Omit<Project, "id" | "teamMember" | "isDeleted">,
//   { rejectValue: ErrorResponse }
// >("project/createProject", async (projectData, { rejectWithValue }) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/project`, projectData);
//     return response.data.project;
//   } catch (error) {
//     const axiosError = error as AxiosError<ErrorResponse>;
//     return rejectWithValue(
//       axiosError.response?.data || { message: "Failed to create project" }
//     );
//   }
// });

// export const allocateEmployeeToProject = createAsyncThunk<
//   { allocationId: string },
//   { projectId: string; resource: ProjectResource },
//   { rejectValue: ErrorResponse }
// >(
//   "project/allocateEmployeeToProject",
//   async ({ projectId, resource }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/project/${projectId}`,
//         resource
//       );
//       return response.data;
//     } catch (error) {
//       const axiosError = error as AxiosError<ErrorResponse>;
//       return rejectWithValue(
//         axiosError.response?.data || { message: "Failed to allocate employee" }
//       );
//     }
//   }
// );

// export const updateProject = createAsyncThunk<
//   { projectId: string },
//   { id: string; data: Partial<Project> },
//   { rejectValue: ErrorResponse }
// >("project/updateProject", async ({ id, data }, { rejectWithValue }) => {
//   try {
//     const response = await axios.patch(`${API_BASE_URL}/project/${id}`, data);
//     return response.data;
//   } catch (error) {
//     const axiosError = error as AxiosError<ErrorResponse>;
//     return rejectWithValue(
//       axiosError.response?.data || { message: "Failed to update project" }
//     );
//   }
// });

// export const updateResourceAllocation = createAsyncThunk<
//   { resourceId: string; updatedFields: Partial<ProjectResource> },
//   { resourceId: string; data: Partial<ProjectResource> },
//   { rejectValue: ErrorResponse }
// >(
//   "project/updateResourceAllocation",
//   async ({ resourceId, data }, { rejectWithValue }) => {
//     try {
//       const response = await axios.patch(
//         `${API_BASE_URL}/project/resources/${resourceId}`,
//         data
//       );
//       return response.data;
//     } catch (error) {
//       const axiosError = error as AxiosError<ErrorResponse>;
//       return rejectWithValue(
//         axiosError.response?.data || {
//           message: "Failed to update resource allocation",
//         }
//       );
//     }
//   }
// );

// export const deleteProject = createAsyncThunk<
//   { projectId: string },
//   string,
//   { rejectValue: ErrorResponse }
// >("project/deleteProject", async (id, { rejectWithValue }) => {
//   try {
//     const response = await axios.delete(`${API_BASE_URL}/project/${id}`);
//     return response.data;
//   } catch (error) {
//     const axiosError = error as AxiosError<ErrorResponse>;
//     return rejectWithValue(
//       axiosError.response?.data || { message: "Failed to delete project" }
//     );
//   }
// });

// // Create slice
// const projectSlice = createSlice({
//   name: "project",
//   initialState,
//   reducers: {
//     setFilters: (state, action) => {
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
//     // Fetch all projects
//     builder.addCase(fetchProjects.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(fetchProjects.fulfilled, (state, action) => {
//       state.loading = false;
//       state.projects = action.payload;
//     });
//     builder.addCase(fetchProjects.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload?.message || "Failed to fetch projects";
//     });

//     // Fetch single project
//     builder.addCase(fetchProjectById.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(fetchProjectById.fulfilled, (state, action) => {
//       state.loading = false;
//       state.currentProject = action.payload;
//     });
//     builder.addCase(fetchProjectById.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload?.message || "Failed to fetch project";
//     });

//     // Create project
//     builder.addCase(createProject.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(createProject.fulfilled, (state, action) => {
//       state.loading = false;
//       state.projects.push(action.payload);
//     });
//     builder.addCase(createProject.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload?.message || "Failed to create project";
//     });

//     // Allocate employee
//     builder.addCase(allocateEmployeeToProject.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(allocateEmployeeToProject.fulfilled, (state) => {
//       state.loading = false;
//     });
//     builder.addCase(allocateEmployeeToProject.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload?.message || "Failed to allocate employee";
//     });

//     // Update project
//     builder.addCase(updateProject.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(updateProject.fulfilled, (state, action) => {
//       state.loading = false;
//       state.projects = state.projects.map((project) =>
//         project.id === action.payload.projectId
//           ? { ...project, ...action.meta.arg.data }
//           : project
//       );
//     });
//     builder.addCase(updateProject.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload?.message || "Failed to update project";
//     });

//     // Update resource allocation
//     builder.addCase(updateResourceAllocation.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(updateResourceAllocation.fulfilled, (state) => {
//       state.loading = false;
//     });
//     builder.addCase(updateResourceAllocation.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload?.message || "Failed to update resource allocation";
//     });

//     // Delete project
//     builder.addCase(deleteProject.pending, (state) => {
//       state.loading = true;
//       state.error = null;
//     });
//     builder.addCase(deleteProject.fulfilled, (state, action) => {
//       state.loading = false;
//       state.projects = state.projects.filter(
//         (project) => project.id !== action.payload.projectId
//       );
//     });
//     builder.addCase(deleteProject.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload?.message || "Failed to delete project";
//     });
//   },
// });

// export const { setFilters, clearFilters, clearError } = projectSlice.actions;
// export default projectSlice.reducer;

// store/slice/projectSlice.ts

// import {
//   createSlice,
//   createAsyncThunk,
//   type PayloadAction,
// } from "@reduxjs/toolkit";
// import * as projectApi from "../../features/Projects/api/projectapi";
// import type {
//   Project,
//   ProjectResource,
//   ProjectFilters,
// } from "../../types/project";

// // Define interfaces for state and API responses
// interface ProjectState {
//   projects: Project[];
//   currentProject: Project | null;
//   loading: boolean;
//   error: string | null;
//   filters: ProjectFilters;
// }

// interface ErrorResponse {
//   message: string;
// }

// // Initial state
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

// // Async thunks for API calls
// export const fetchProjects = createAsyncThunk<
//   Project[],
//   void,
//   { rejectValue: ErrorResponse }
// >("project/fetchProjects", async (_, { rejectWithValue }) => {
//   try {
//     return await projectApi.fetchProjectsApi();
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// export const fetchProjectById = createAsyncThunk<
//   Project,
//   string,
//   { rejectValue: ErrorResponse }
// >("project/fetchProjectById", async (id, { rejectWithValue }) => {
//   try {
//     return await projectApi.fetchProjectByIdApi(id);
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// export const createProject = createAsyncThunk<
//   Project,
//   Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">,
//   { rejectValue: ErrorResponse }
// >("project/createProject", async (projectData, { rejectWithValue }) => {
//   try {
//     const response = await projectApi.createProjectApi(projectData);
//     return response.project;
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// export const allocateEmployeeToProject = createAsyncThunk<
//   { allocationId: string },
//   { projectId: string; resource: Omit<ProjectResource, "id"> },
//   { rejectValue: ErrorResponse }
// >(
//   "project/allocateEmployeeToProject",
//   async ({ projectId, resource }, { rejectWithValue }) => {
//     try {
//       return await projectApi.allocateEmployeeToProjectApi(projectId, resource);
//     } catch (error) {
//       return rejectWithValue(error as ErrorResponse);
//     }
//   }
// );

// export const updateProject = createAsyncThunk<
//   { projectId: string; updatedFields: Partial<Project> },
//   { id: string; data: Partial<Project> },
//   { rejectValue: ErrorResponse }
// >("project/updateProject", async ({ id, data }, { rejectWithValue }) => {
//   try {
//     await projectApi.updateProjectApi(id, data);
//     return { projectId: id, updatedFields: data };
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// export const updateResourceAllocation = createAsyncThunk<
//   { resourceId: string; updatedFields: Partial<ProjectResource> },
//   { resourceId: string; data: Partial<ProjectResource> },
//   { rejectValue: ErrorResponse }
// >(
//   "project/updateResourceAllocation",
//   async ({ resourceId, data }, { rejectWithValue }) => {
//     try {
//       const response = await projectApi.updateResourceAllocationApi(
//         resourceId,
//         data
//       );
//       return response;
//     } catch (error) {
//       return rejectWithValue(error as ErrorResponse);
//     }
//   }
// );

// export const deleteProject = createAsyncThunk<
//   { projectId: string },
//   string,
//   { rejectValue: ErrorResponse }
// >("project/deleteProject", async (id, { rejectWithValue }) => {
//   try {
//     return await projectApi.deleteProjectApi(id);
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// // Create slice
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
//     // Fetch all projects
//     builder
//       .addCase(fetchProjects.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProjects.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects = action.payload;
//       })
//       .addCase(fetchProjects.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Failed to fetch projects";
//       });

//     // Fetch single project
//     builder
//       .addCase(fetchProjectById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.currentProject = null;
//       })
//       .addCase(fetchProjectById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentProject = action.payload;
//       })
//       .addCase(fetchProjectById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Failed to fetch project";
//         state.currentProject = null;
//       });

//     // Create project
//     builder
//       .addCase(createProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects.push(action.payload);
//       })
//       .addCase(createProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Failed to create project";
//       });

//     // Allocate employee to project
//     builder
//       .addCase(allocateEmployeeToProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(allocateEmployeeToProject.fulfilled, (state, action) => {
//         state.loading = false;
//         if (
//           state.currentProject &&
//           state.currentProject.id === action.meta.arg.projectId
//         ) {
//           state.currentProject.resources?.push({
//             ...action.meta.arg.resource,
//             id: action.payload.allocationId,
//           } as ProjectResource);
//         }
//       })
//       .addCase(allocateEmployeeToProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Failed to allocate employee";
//       });

//     // Update project
//     builder
//       .addCase(updateProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
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
//         state.error = action.payload?.message || "Failed to update project";
//       });

//     // Update resource allocation
//     builder
//       .addCase(updateResourceAllocation.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateResourceAllocation.fulfilled, (state, action) => {
//         state.loading = false;
//         if (state.currentProject && state.currentProject.resources) {
//           state.currentProject.resources = state.currentProject.resources.map(
//             (resource) =>
//               resource.id === action.payload.resourceId
//                 ? { ...resource, ...action.payload.updatedFields }
//                 : resource
//           );
//         }
//       })
//       .addCase(updateResourceAllocation.rejected, (state, action) => {
//         state.loading = false;
//         state.error =
//           action.payload?.message || "Failed to update resource allocation";
//       });

//     // Delete project
//     builder
//       .addCase(deleteProject.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects = state.projects.filter(
//           (project) => project.id !== action.payload.projectId
//         );
//       })
//       .addCase(deleteProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Failed to delete project";
//       });
//   },
// });

// export const { setFilters, clearFilters, clearError } = projectSlice.actions;
// export default projectSlice.reducer;


// import {
//   createSlice,
//   createAsyncThunk,
//   type PayloadAction,
// } from "@reduxjs/toolkit";
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

// interface ErrorResponse {
//   message: string;
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

// // ### Async Thunks ###

// export const fetchProjects = createAsyncThunk<
//   Project[],
//   void,
//   { rejectValue: ErrorResponse }
// >("project/fetchProjects", async (_, { rejectWithValue }) => {
//   try {
//     return await projectApi.fetchProjectsApi();
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// export const fetchProjectById = createAsyncThunk<
//   Project,
//   string,
//   { rejectValue: ErrorResponse }
// >("project/fetchProjectById", async (id, { rejectWithValue }) => {
//   try {
//     return await projectApi.fetchProjectByIdApi(id);
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// export const createProject = createAsyncThunk<
//   Project,
//   Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">,
//   { rejectValue: ErrorResponse }
// >("project/createProject", async (projectData, { rejectWithValue }) => {
//   try {
//     const response = await projectApi.createProjectApi(projectData);
//     return response.project;
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// export const updateProject = createAsyncThunk<
//   { projectId: string; updatedFields: Partial<Project> },
//   { id: string; data: Partial<Project> },
//   { rejectValue: ErrorResponse }
// >("project/updateProject", async ({ id, data }, { rejectWithValue }) => {
//   try {
//     await projectApi.updateProjectApi(id, data);
//     return { projectId: id, updatedFields: data };
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// export const deleteProject = createAsyncThunk<
//   { projectId: string },
//   string,
//   { rejectValue: ErrorResponse }
// >("project/deleteProject", async (id, { rejectWithValue }) => {
//   try {
//     return await projectApi.deleteProjectApi(id);
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// export const allocateEmployeeToProject = createAsyncThunk<
//   { allocationId: string },
//   { projectId: string; resource: Omit<ProjectResource, "id"> },
//   { rejectValue: ErrorResponse }
// >(
//   "project/allocateEmployeeToProject",
//   async ({ projectId, resource }, { rejectWithValue }) => {
//     try {
//       return await projectApi.allocateEmployeeToProjectApi(projectId, resource);
//     } catch (error) {
//       return rejectWithValue(error as ErrorResponse);
//     }
//   }
// );

// export const updateResourceAllocation = createAsyncThunk<
//   { resourceId: string; updatedFields: Partial<ProjectResource> },
//   { resourceId: string; data: Partial<ProjectResource> },
//   { rejectValue: ErrorResponse }
// >(
//   "project/updateResourceAllocation",
//   async ({ resourceId, data }, { rejectWithValue }) => {
//     try {
//       const response = await projectApi.updateResourceAllocationApi(
//         resourceId,
//         data
//       );
//       return response;
//     } catch (error) {
//       return rejectWithValue(error as ErrorResponse);
//     }
//   }
// );

// export const releaseResource = createAsyncThunk<
//   { resourceId: string },
//   string,
//   { rejectValue: ErrorResponse }
// >("project/releaseResource", async (resourceId, { rejectWithValue }) => {
//   try {
//     await projectApi.updateResourceAllocationApi(resourceId, {
//       isDeleted: true,
//     });
//     return { resourceId };
//   } catch (error) {
//     return rejectWithValue(error as ErrorResponse);
//   }
// });

// // ### Slice Definition ###
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
//     // Fetch all projects
//     builder
//       .addCase(fetchProjects.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProjects.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects = action.payload;
//       })
//       .addCase(fetchProjects.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Failed to fetch projects";
//       });

//     // Fetch single project
//     builder
//       .addCase(fetchProjectById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.currentProject = null;
//       })
//       .addCase(fetchProjectById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentProject = action.payload;
//       })
//       .addCase(fetchProjectById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Failed to fetch project";
//         state.currentProject = null;
//       });

//     // Create project
//     builder
//       .addCase(createProject.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createProject.fulfilled, (state, action) => {
//         state.loading = false;
//         state.projects.push(action.payload);
//       })
//       .addCase(createProject.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || "Failed to create project";
//       });

//     // Update project
//     builder
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
//         state.error = action.payload?.message || "Failed to update project";
//       });

//     // Delete project
//     builder
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
//         state.error = action.payload?.message || "Failed to delete project";
//       });

//     // Allocate employee
//     builder
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
//         state.error = action.payload?.message || "Failed to allocate employee";
//       });

//     // Update resource allocation
//     builder
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
//         state.error =
//           action.payload?.message || "Failed to update resource allocation";
//       });

//     // Release resource (soft delete)
//     builder
//       .addCase(releaseResource.fulfilled, (state, action) => {
//         if (state.currentProject?.resources) {
//           state.currentProject.resources = state.currentProject.resources.filter(
//             (resource) => resource.id !== action.payload.resourceId
//           );
//         }
//       })
//       .addCase(releaseResource.rejected, (state, action) => {
//         state.error = action.payload?.message || "Failed to release resource";
//       });
//   },
// });

// export const { setFilters, clearFilters, clearError } = projectSlice.actions;
// export default projectSlice.reducer;
// ==========================================================================================

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
// const getErrorMessage = (error: unknown): string => {
//   if (isAxiosError(error)) {
//     return error.response?.data?.message || "An API error occurred";
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
//   async (projectData: Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">, { rejectWithValue }) => {
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
//   async ({ id, data }: { id: string; data: Partial<Project> }, { rejectWithValue }) => {
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
//       return response; // Contains { message, projectId }
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const allocateEmployeeToProject = createAsyncThunk(
//   "project/allocateEmployeeToProject",
//   async ({ projectId, resource }: { projectId: string; resource: Omit<ProjectResource, "id"> }, { rejectWithValue }) => {
//     try {
//       return await projectApi.allocateEmployeeToProjectApi(projectId, resource);
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const updateResourceAllocation = createAsyncThunk(
//   "project/updateResourceAllocation",
//   async ({ resourceId, data }: { resourceId: string; data: Partial<ProjectResource> }, { rejectWithValue }) => {
//     try {
//       return await projectApi.updateResourceAllocationApi(resourceId, data);
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// export const releaseResource = createAsyncThunk(
//   "project/releaseResource",
//   async (resourceId: string, { rejectWithValue }) => {
//     try {
//       // This API call soft-deletes the resource
//       await projectApi.updateResourceAllocationApi(resourceId, { isDeleted: true });
//       return { resourceId };
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

// // ### Slice Definition ###
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
//       .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
//         state.loading = false;
//         state.projects = action.payload;
//       })
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
//       .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<Project>) => {
//         state.loading = false;
//         state.currentProject = action.payload;
//       })
//       .addCase(fetchProjectById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.currentProject = null;
//       })

//       // Create project
//       .addCase(createProject.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
//         state.loading = false;
//         state.projects.push(action.payload);
//       })
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
//         if (state.currentProject && state.currentProject.id === action.payload.projectId) {
//           state.currentProject = { ...state.currentProject, ...action.payload.updatedFields };
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
//         if (state.currentProject && state.currentProject.id === action.meta.arg.projectId) {
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
//           state.currentProject.resources = state.currentProject.resources.filter(
//             (resource) => resource.id !== action.payload.resourceId
//           );
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
const getErrorMessage = (error: unknown): string => {
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

// export const releaseResource = createAsyncThunk(
//   "project/releaseResource",
//   async (resourceId: string, { rejectWithValue }) => {
//     try {
//       await projectApi.updateResourceAllocationApi(resourceId, {
//         isDeleted: true,
//       });
//       return { resourceId };
//     } catch (error) {
//       return rejectWithValue(getErrorMessage(error));
//     }
//   }
// );

export const releaseResource = createAsyncThunk(
  "project/releaseResource",
  async (resourceId: string, { rejectWithValue }) => {
    try {
      // Yahaan hum naye API function ko call kar rahe hain
      const response = await projectApi.releaseResourceApi(resourceId);
      return response; // API se mila response return karein
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
        state.error = action.payload as string;
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
