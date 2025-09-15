
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast"; // Import toast
import Table, { type Column } from "../../../../components/common/Table";
import Modal from "../../../../components/common/NotificationModal";
import {
  fetchProjects,
  deleteProject,
  updateProject,
} from "../../../../store/slice/projectSlice";
import type { RootState, AppDispatch } from "../../../../store/store";
import ActionDropdown from "./ActionDropdown";
import ProjectFormModal from "./ProjectFormModal";
import type { Project } from "../../../../types/project";

const ProjectList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { projects, loading, error } = useSelector(
    (state: RootState) => state.project
  );

  // State for the notification/confirmation modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<
    "warning" | "info" | "success" | "error"
  >("warning");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [actionToConfirm, setActionToConfirm] = useState<string | null>(null);

 
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [projectForModal, setProjectForModal] = useState<Project | null>(null);


  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`Failed to fetch projects: ${error}`);
    }
  }, [error]);

  const projectsData = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    // We map the data here for table display, ensuring we pass the original object to actions
    return projects.map((apiProject) => ({
      ...apiProject,
      creationDate: new Date(apiProject.creationDate).toLocaleDateString(
        "en-GB",
        { day: "2-digit", month: "short", year: "numeric" }
      ),
    }));
  }, [projects]);
  
  // Handlers for the Add/Edit form modal
  const handleOpenAddModal = () => {
    setFormMode("create");
    setProjectForModal(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setFormMode("edit");
    // Pass the original project object to the modal for correct data types (like the date)
    const originalProject = projects.find(p => p.id === project.id);
    setProjectForModal(originalProject || null);
    setIsFormModalOpen(true);
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
    setProjectForModal(null);
  };

  
  const handleAction = (actionName: string, project: Project) => {
    setActionToConfirm(actionName);
    switch (actionName) {
      case "View Details":
        navigate(`/projects/detail/${project.id}`);
        break;
      case "Edit":
        handleOpenEditModal(project);
        break;
      case "Delete":
        setProjectForModal(project);
        setModalType("error");
        setModalTitle("Delete Project?");
        setModalMessage(
          `Are you sure you want to delete ${project.projectName}?`
        );
        setIsModalOpen(true);
        break;
      case "Make Inactive":
        setProjectForModal(project);
        setModalType("warning");
        setModalTitle("Make Inactive?");
        setModalMessage(
          `Are you sure you want to make ${project.projectName} inactive?`
        );
        setIsModalOpen(true);
        break;
      case "Make Active":
        setProjectForModal(project);
        setModalType("info");
        setModalTitle("Make Active?");
        setModalMessage(
          `Are you sure you want to make ${project.projectName} active?`
        );
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmAction = () => {
    if (!projectForModal || !actionToConfirm) return;

    let actionPromise: Promise<any>;
    let messages = {
      loading: "Processing...",
      success: "Action completed successfully!",
      error: "An error occurred.",
    };

    switch (actionToConfirm) {
      case "Delete":
        actionPromise = dispatch(deleteProject(projectForModal.id)).unwrap();
        messages = {
          loading: "Deleting project...",
          success: `Project "${projectForModal.projectName}" deleted.`,
          error: "Failed to delete project.",
        };
        break;
      case "Make Inactive":
        actionPromise = dispatch(
          updateProject({ id: projectForModal.id, data: { status: "Inactive" } })
        ).unwrap();
        messages = {
          loading: "Updating status...",
          success: `Project "${projectForModal.projectName}" is now inactive.`,
          error: "Failed to update status.",
        };
        break;
      case "Make Active":
        actionPromise = dispatch(
          updateProject({ id: projectForModal.id, data: { status: "Active" } })
        ).unwrap();
        messages = {
          loading: "Updating status...",
          success: `Project "${projectForModal.projectName}" is now active.`,
          error: "Failed to update status.",
        };
        break;
      default:
        return;
    }

    toast.promise(actionPromise, messages);
    setIsModalOpen(false);
  };

  const columns: Column<(typeof projectsData)[0]>[] = [
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
    {
      key: "teamMember",
      header: "Team Members",
      render: (row) => row.teamMember || 0,
    },
    {
      key: "action",
      header: "Action",
      render: (row) => <ActionDropdown project={row} onAction={handleAction} />,
    },
  ];

  const renderTableContent = () => {
    if (loading) return <div className="text-center p-10">Loading...</div>;
    // Error is now handled by toast, but we can keep this as a fallback
    if (error)
      return (
        <div className="text-center p-10 text-red-600">Error: {error}</div>
      );
    if (projectsData.length === 0)
      return <div className="text-center p-10">No projects found.</div>;
    return <Table data={projectsData} columns={columns} className="w-[70vw] text-sm" />;
  };

  return (
    <div className="px-4 py-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        {/* <div className="text-sm font-medium">
          <Link to="/dashboard" className="text-gray-500 hover:text-[#741CDD]">
            Dashboard
          </Link>
          <span className="text-gray-500 mx-2">/</span>
          <span className="text-gray-700">Projects</span>
        </div> */}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
        <div className="flex justify-end items-center flex-wrap mb-4">
          <button
            className="bg-[#741CDD] hover:bg-[#5b14a9] text-white px-4 py-2 text-sm rounded transition duration-200"
            onClick={handleOpenAddModal}
          >
            + ADD PROJECT
          </button>
        </div>

        <div className="overflow-x-auto">{renderTableContent()}</div>
      </div>

      {isFormModalOpen && (
        <ProjectFormModal
          isOpen={isFormModalOpen}
          onClose={handleFormClose}
          project={projectForModal}
          mode={formMode}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleConfirmAction}
        type={modalType}
      />
    </div>
  );
};

export default ProjectList;