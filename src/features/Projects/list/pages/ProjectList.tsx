// features/projects/list/pages/ProjectList.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Table, { type Column } from "../../../../components/common/Table";
import Modal from "../../../../components/common/NotificationModal";
import GenericForm, { type FormField } from "../../../../components/common/GenericForm";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  setFilters,
  clearFilters,
  clearError,
} from "../../../../store/slice/projectSlice";
import type { RootState, AppDispatch } from "../../../../store/store";
import type { Project } from "../../../../types/project";
import ActionDropdown from "./ActionDropdown";

const ProjectList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { projects, loading, error, filters } = useSelector(
    (state: RootState) => state.project
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"warning" | "info" | "success" | "error">("warning");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [projectForModal, setProjectForModal] = useState<Project | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const projectData = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      creationDate: new Date(project.creationDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projectData.filter((project) => {
      const projectDate = new Date(
        project.creationDate.replace(/(\d{2}) (\w{3}) (\d{4})/, "$2 $1, $3")
      );
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      const matchDate =
        (!startDate || projectDate >= startDate) &&
        (!endDate || projectDate <= endDate);
      const matchStatus =
        filters.status === "All" || project.status === filters.status;
      const matchBillingType =
        filters.billingType === "All" || project.billingType === filters.billingType;
      const matchSearch = project.projectName
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      return matchDate && matchStatus && matchBillingType && matchSearch;
    });
  }, [projectData, filters]);

  const handleAction = (actionName: string, project: Project) => {
    setProjectForModal(project);
    setActionToConfirm(actionName);
    switch (actionName) {
      case "View Details":
        navigate(`/projects/list/detail/${project.id}`);
        break;
      case "Edit":
        setIsCreateModalOpen(true);
        break;
      case "Delete":
        setModalType("error");
        setModalTitle("Delete Project?");
        setModalMessage(`Are you sure you want to delete ${project.projectName}?`);
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmAction = () => {
    if (!projectForModal || !actionToConfirm) return;
    if (actionToConfirm === "Delete") {
      dispatch(deleteProject(projectForModal.id));
    }
    setIsModalOpen(false);
  };

  const handleCreateProject = (data: Record<string, any>) => {
    dispatch(
      createProject({
        projectName: data.projectName,
        billingType: data.billingType,
        creationDate: data.creationDate,
        status: data.status,
      })
    );
    setIsCreateModalOpen(false);
  };

  const projectFormFields: FormField[] = [
    {
      name: "projectName",
      label: "Project Name",
      type: "text",
      placeholder: "Enter project name",
      required: true,
    },
    {
      name: "billingType",
      label: "Billing Type",
      type: "select",
      options: [
        { value: "FixedCost", label: "Fixed Cost" },
        { value: "TimeAndMaterial", label: "Time and Material" },
      ],
      required: true,
    },
    {
      name: "creationDate",
      label: "Creation Date",
      type: "date",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
      required: true,
    },
  ];

  const columns: Column<Project>[] = [
    { key: "projectName", header: "Project Name" },
    { key: "billingType", header: "Billing Type" },
    { key: "creationDate", header: "Creation Date" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { key: "teamMember", header: "Team Members" },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <ActionDropdown
          project={row}
          onAction={handleAction}
          options={["View Details", "Edit", "Delete"]}
        />
      ),
    },
  ];

  const renderTableContent = () => {
    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error)
      return (
        <div className="text-center p-10 text-red-600">Error: {error}</div>
      );
    if (filteredProjects.length === 0)
      return <div className="text-center p-10">No projects found.</div>;
    return (
      <Table
        data={filteredProjects}
        columns={columns}
        className="w-[70vw] text-sm"
        onRowClick={(project) => navigate(`/projects/list/detail/${project.id}`)}
      />
    );
  };

  return (
    <div className="px-4 py-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <div className="text-sm font-medium">
          <Link to="/dashboard" className="text-gray-500 hover:text-[#741CDD]">
            Dashboard
          </Link>
          <span className="text-gray-500 mx-2">/</span>
          <span className="text-gray-700">Projects</span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
        <div className="flex justify-between items-center flex-wrap mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#741CDD] hover:bg-[#5b14a9] text-white px-4 py-2 text-sm rounded transition duration-200"
          >
            + NEW PROJECT
          </button>
          {/* <button
            onClick={() => dispatch(clearFilters())}
            className="border border-[#741CDD] text-[#741CDD] hover:bg-[#f0e6fa] px-4 py-2 text-sm rounded transition duration-200"
          >
            Clear Filters
          </button> */}
        </div>

        <div className="overflow-x-auto">{renderTableContent()}</div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleConfirmAction}
        type={modalType}
      />

      <GenericForm
        title="Create Project"
        fields={projectFormFields}
        initialState={{
          projectName: "",
          billingType: "",
          creationDate: "",
          status: "Active",
        }}
        onSubmit={handleCreateProject}
        onCancel={() => setIsCreateModalOpen(false)}
        submitButtonText="Create"
        cancelButtonText="Cancel"
      />
    </div>
  );
};

export default ProjectList;