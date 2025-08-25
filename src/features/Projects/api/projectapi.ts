// // src/features/projects/api/projectApi.ts
// import { AxiosError } from "axios";
// import { axiosInstance } from "../../../services"; // Import the shared instance
// import type { Project, ProjectResource } from "../../../types/project";

// interface ErrorResponse {
//   message: string;
// }

// const handleApiError = (error: unknown): ErrorResponse => {
//   const axiosError = error as AxiosError<ErrorResponse>;
//   return axiosError.response?.data || { message: "An unexpected error occurred" };
// };

// // GET /project - Get All Projects
// export const fetchProjectsApi = async (): Promise<Project[]> => {
//   try {
//     // Use axiosInstance and relative path
//     const response = await axiosInstance.get('/project');
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

// // And so on for all other API calls...
// // Just replace `axios.get(...)` with `axiosInstance.get(...)` etc.

// // POST /project - Add Project
// export const createProjectApi = async (
//   projectData: Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">
// ): Promise<{ message: string; project: Project }> => {
//   try {
//     const response = await axiosInstance.post('/project', projectData);
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };
// ======================================================================================================
// // src/features/Projects/api/projectapi.ts
// import { AxiosError } from "axios";
// import { axiosInstance } from "../../../services"; // Import the shared instance
// import type { Project, ProjectResource } from "../../../types/project";

// interface ErrorResponse {
//   message: string;
// }

// const handleApiError = (error: unknown): ErrorResponse => {
//   const axiosError = error as AxiosError<ErrorResponse>;
//   return axiosError.response?.data || { message: "An unexpected error occurred" };
// };

// // GET /project - Get All Projects
// export const fetchProjectsApi = async (): Promise<Project[]> => {
//   try {
//     const response = await axiosInstance.get('/project');
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

// // GET /project/:id - Get Single Project
// export const fetchProjectByIdApi = async (id: string): Promise<Project> => {
//   try {
//     const response = await axiosInstance.get(`/project/${id}`);
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

// // POST /project - Add Project
// export const createProjectApi = async (
//   projectData: Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">
// ): Promise<{ message: string; project: Project }> => {
//   try {
//     const response = await axiosInstance.post('/project', projectData);
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

// // POST /project/:id - Allocate Employee to Project
// export const allocateEmployeeToProjectApi = async (
//   projectId: string,
//   resource: Omit<ProjectResource, "id">
// ): Promise<{ message: string; allocationId: string }> => {
//   try {
//     const response = await axiosInstance.post(`/project/${projectId}`, resource);
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

// // PATCH /project/:id - Edit Project Details
// export const updateProjectApi = async (
//   id: string,
//   data: Partial<Project>
// ): Promise<{ message: string; projectId: string }> => {
//   try {
//     const response = await axiosInstance.patch(`/project/${id}`, data);
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

// // PATCH /project/resources/:id - Edit Resource Allocation
// export const updateResourceAllocationApi = async (
//   resourceId: string,
//   data: Partial<ProjectResource>
// ): Promise<{ message: string; resourceId: string; updatedFields: Partial<ProjectResource> }> => {
//   try {
//     const response = await axiosInstance.patch(`/project/resources/${resourceId}`, data);
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

// // DELETE /project/:id - Soft Delete Project
// export const deleteProjectApi = async (id: string): Promise<{ message: string; projectId: string }> => {
//   try {
//     const response = await axiosInstance.delete(`/project/${id}`);
//     return response.data;
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };

import { AxiosError } from "axios";
import { axiosInstance } from "../../../services";
import type { Project, ProjectResource } from "../../../types/project";

interface ErrorResponse {
  message?: string;
  error?: string;
}

const handleApiError = (error: unknown): { message: string } => {
  const axiosError = error as AxiosError<ErrorResponse>;
  const data = axiosError.response?.data;

  if (data?.message) return { message: data.message };
  if (data?.error) return { message: data.error };

  return { message: "An unexpected error occurred" };
};

// GET /project - Get All Projects
export const fetchProjectsApi = async (): Promise<Project[]> => {
  try {
    const response = await axiosInstance.get("/project/getAll");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// GET /project/:id - Get Single Project
export const fetchProjectByIdApi = async (id: string): Promise<Project> => {
  try {
    const response = await axiosInstance.get(`/project/getproject/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// POST /project - Add Project
export const createProjectApi = async (
  projectData: Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">
): Promise<{ message: string; project: Project }> => {
  try {
    const response = await axiosInstance.post("/project/create", projectData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// POST /project/:id - Allocate Employee to Project
export const allocateEmployeeToProjectApi = async (
  projectId: string,
  resource: Omit<ProjectResource, "id">
): Promise<{ message: string; allocationId: string }> => {
  try {
    const response = await axiosInstance.post(
      `/project/allocate/${projectId}`,
      resource
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// PATCH /project/:id - Edit Project Details
export const updateProjectApi = async (
  id: string,
  data: Partial<Project>
): Promise<{ message: string; projectId: string }> => {
  try {
    const response = await axiosInstance.patch(`/project/edit/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// PATCH /project/resources/:id - Edit Resource Allocation
export const updateResourceAllocationApi = async (
  resourceId: string,
  data: Partial<ProjectResource>
): Promise<{
  message: string;
  resourceId: string;
  updatedFields: Partial<ProjectResource>;
}> => {
  try {
    const response = await axiosInstance.patch(
      `/project/resources/${resourceId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// DELETE /project/:id - Soft Delete Project
export const deleteProjectApi = async (
  id: string
): Promise<{ message: string; projectId: string }> => {
  try {
    const response = await axiosInstance.delete(`/project/delete/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
