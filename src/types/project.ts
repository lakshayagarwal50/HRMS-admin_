// types/project.ts
export interface Project {
  id: string;
  projectName: string;
  billingType: "FixedCost" | "TimeAndMaterial";
  creationDate: string;
  status: "Active" | "Inactive";
  teamMember: number;
  isDeleted: boolean;
  resources?: ProjectResource[];
}

export interface ProjectResource {
  id: string;
  empCode: string;
  name: string;
  department: string;
  designation: string;
  allocatedHours: number;
  allocatedFrom: string;
  allocatedTill: string;
  hoursLogged: number;
  experience: number;
  isDeleted: boolean;
}

export interface ProjectFilters {
  status: "All" | "Active" | "Inactive";
  billingType: "All" | "FixedCost" | "TimeAndMaterial";
  startDate: string;
  endDate: string;
  searchTerm: string;
}