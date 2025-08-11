import React, { useState } from "react";
import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
import { SectionHeader } from "../common/DetailItem";
import Table, { type Column } from "../../../../components/common/Table";
import { XCircle } from "lucide-react"; // Import the icon

/**
 * Defines the structure of a single Project based on your API response.
 */
export interface Project {
  id: string;
  name: string;
  designation: string;
  allocatedHours: number;
  allocatedFrom: string;
  allocatedtill: string;
}

interface ProjectsSectionProps {
  data: EmployeeDetail;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ data }) => {
  // State to manage which project is being considered for release
  const [projectToRelease, setProjectToRelease] = useState<Project | null>(
    null
  );

  // Use `data.project` as per your JSON structure. Default to an empty array.
  const projects = data.project || [];
  const hasProjects = projects.length > 0;

  /**
   * Opens the confirmation modal and sets the project to be released.
   */
  const handleReleaseClick = (project: Project) => {
    setProjectToRelease(project);
  };

  /**
   * Closes the modal by resetting the state.
   */
  const handleCloseModal = () => {
    setProjectToRelease(null);
  };

  /**
   * This function is called when the user confirms the release.
   * TODO: Add your Redux dispatch logic here.
   */
  const handleConfirmRelease = () => {
    if (!projectToRelease) return;

    console.log(
      `Confirmed release for project: ${projectToRelease.name} (ID: ${projectToRelease.id})`
    );
    // Example: dispatch(releaseProjectAction(projectToRelease.id));

    handleCloseModal(); // Close the modal after confirming
  };

  /**
   * Defines the columns for the projects table, including the "Action" column.
   */
  const columns: Column<Project>[] = [
    { key: "name", header: "Project Name" },
    { key: "allocatedHours", header: "Allocation Hour" },
    { key: "allocatedFrom", header: "Allocation From" },
    { key: "allocatedtill", header: "Allocation Till" },
    { key: "designation", header: "Designation" },
    {
      key: "action",
      header: "Action",
      render: (project) => (
        <button
          className="text-[#741CDD] font-medium hover:underline focus:outline-none"
          onClick={() => handleReleaseClick(project)}
        >
          Release
        </button>
      ),
    },
  ];

  return (
    <>
      <div>
        <SectionHeader title="Projects" />
        {hasProjects ? (
          <Table
            data={projects}
            columns={columns}
            showSearch={false}
            showPagination={false}
          />
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-dashed text-center text-gray-500">
            <p>No projects have been assigned to this employee.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {projectToRelease && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center transform transition-all">
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3
              className="mt-4 text-xl font-semibold text-gray-900"
              id="modal-title"
            >
              Release
            </h3>

            {/* Message */}
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to release the resource from the project?
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                className="px-8 py-2.5 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                onClick={handleCloseModal}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="px-8 py-2.5 rounded-md font-semibold text-white bg-[#741CDD] hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#741CDD]"
                onClick={handleConfirmRelease}
              >
                SURE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsSection;
