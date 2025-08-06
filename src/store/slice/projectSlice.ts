// store/slice/projectSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import type { Project, ProjectResource, ProjectFilters } from "../../types/project";

// Define the base URL for API requests (configure as needed)
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";
const API_BASE_URL =  "http://localhost:3000";

// Define interfaces for state and API responses
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  filters: ProjectFilters;
}

interface ErrorResponse {
  message: string;
}

// Initial state
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

// Async thunks for API calls
export const fetchProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: ErrorResponse }
>("project/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/project`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data || { message: "Failed to fetch projects" }
    );
  }
});

export const fetchProjectById = createAsyncThunk<
  Project,
  string,
  { rejectValue: ErrorResponse }
>("project/fetchProjectById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/project/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data || { message: "Failed to fetch project" }
    );
  }
});

export const createProject = createAsyncThunk<
  Project,
  Omit<Project, "id" | "teamMember" | "isDeleted">,
  { rejectValue: ErrorResponse }
>("project/createProject", async (projectData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/project`, projectData);
    return response.data.project;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data || { message: "Failed to create project" }
    );
  }
});

export const allocateEmployeeToProject = createAsyncThunk<
  { allocationId: string },
  { projectId: string; resource: ProjectResource },
  { rejectValue: ErrorResponse }
>(
  "project/allocateEmployeeToProject",
  async ({ projectId, resource }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/project/${projectId}`,
        resource
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data || { message: "Failed to allocate employee" }
      );
    }
  }
);

export const updateProject = createAsyncThunk<
  { projectId: string },
  { id: string; data: Partial<Project> },
  { rejectValue: ErrorResponse }
>("project/updateProject", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/project/${id}`, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data || { message: "Failed to update project" }
    );
  }
});

export const updateResourceAllocation = createAsyncThunk<
  { resourceId: string; updatedFields: Partial<ProjectResource> },
  { resourceId: string; data: Partial<ProjectResource> },
  { rejectValue: ErrorResponse }
>(
  "project/updateResourceAllocation",
  async ({ resourceId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/project/resources/${resourceId}`,
        data
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        axiosError.response?.data || {
          message: "Failed to update resource allocation",
        }
      );
    }
  }
);

export const deleteProject = createAsyncThunk<
  { projectId: string },
  string,
  { rejectValue: ErrorResponse }
>("project/deleteProject", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/project/${id}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      axiosError.response?.data || { message: "Failed to delete project" }
    );
  }
});

// Create slice
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setFilters: (state, action) => {
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
    // Fetch all projects
    builder.addCase(fetchProjects.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = action.payload;
    });
    builder.addCase(fetchProjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch projects";
    });

    // Fetch single project
    builder.addCase(fetchProjectById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProjectById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProject = action.payload;
    });
    builder.addCase(fetchProjectById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch project";
    });

    // Create project
    builder.addCase(createProject.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProject.fulfilled, (state, action) => {
      state.loading = false;
      state.projects.push(action.payload);
    });
    builder.addCase(createProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to create project";
    });

    // Allocate employee
    builder.addCase(allocateEmployeeToProject.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(allocateEmployeeToProject.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(allocateEmployeeToProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to allocate employee";
    });

    // Update project
    builder.addCase(updateProject.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProject.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = state.projects.map((project) =>
        project.id === action.payload.projectId
          ? { ...project, ...action.meta.arg.data }
          : project
      );
    });
    builder.addCase(updateProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to update project";
    });

    // Update resource allocation
    builder.addCase(updateResourceAllocation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateResourceAllocation.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateResourceAllocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to update resource allocation";
    });

    // Delete project
    builder.addCase(deleteProject.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.loading = false;
      state.projects = state.projects.filter(
        (project) => project.id !== action.payload.projectId
      );
    });
    builder.addCase(deleteProject.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to delete project";
    });
  },
});

export const { setFilters, clearFilters, clearError } = projectSlice.actions;
export default projectSlice.reducer;