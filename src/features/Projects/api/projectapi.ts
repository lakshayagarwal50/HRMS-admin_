// src/features/projects/api/projectApi.ts
import { AxiosError } from "axios";
import { axiosInstance } from "../../../services"; // Import the shared instance
import type { Project, ProjectResource } from "../../../types/project";

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
    // Use axiosInstance and relative path
    const response = await axiosInstance.get('/project');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// And so on for all other API calls...
// Just replace `axios.get(...)` with `axiosInstance.get(...)` etc.

// POST /project - Add Project
export const createProjectApi = async (
  projectData: Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">
): Promise<{ message: string; project: Project }> => {
  try {
    const response = await axiosInstance.post('/project', projectData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};