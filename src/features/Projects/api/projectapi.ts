// features/projects/api/projectApi.ts
import axios, { AxiosError } from "axios";
import type { Project, ProjectResource } from "../../../types/project";

const API_BASE_URL = "http://localhost:3000";

interface ErrorResponse {
  message: string;
}

const handleApiError = (error: unknown): ErrorResponse => {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError.response?.data || { message: "An unexpected error occurred" };
};

// GET /project - Get All Projects
export const fetchProjectsApi = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/project`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// GET /project/:id - Get Single Project
export const fetchProjectByIdApi = async (id: string): Promise<Project> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/project/${id}`);
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
    const response = await axios.post(`${API_BASE_URL}/project`, projectData);
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
    const response = await axios.post(`${API_BASE_URL}/project/${projectId}`, resource);
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
    const response = await axios.patch(`${API_BASE_URL}/project/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// PATCH /project/resources/:id - Edit Resource Allocation
export const updateResourceAllocationApi = async (
  resourceId: string,
  data: Partial<ProjectResource>
): Promise<{ message: string; resourceId: string; updatedFields: Partial<ProjectResource> }> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/project/resources/${resourceId}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// DELETE /project/:id - Soft Delete Project
export const deleteProjectApi = async (id: string): Promise<{ message: string; projectId: string }> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/project/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};