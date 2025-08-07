// // features/projects/list/pages/ProjectList.tsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import Table, { type Column } from "../../../../components/common/Table";
// import Modal from "../../../../components/common/NotificationModal";
// import ProjectFormModal from "../components/ProjectFormModal";
// import ActionDropdown from "../components/ActionDropdown";
// import FilterSidebar from "../components/FilterSidebar";
// import {
//   fetchProjects,
//   createProject,
//   updateProject,
//   deleteProject,
//   setFilters,
//   clearFilters,
//   clearError,
// } from "../../../../store/slice/projectSlice";
// import type { RootState, AppDispatch } from "../../../../store/store";
// import type { Project, ProjectFilters } from "../../../../types/project";
// import { toast } from "react-toastify"; // Assuming you have react-toastify for notifications

// const ProjectList: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const { projects, loading, error, filters } = useSelector(
//     (state: RootState) => state.project
//   );

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState<"warning" | "info" | "success" | "error">("warning");
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [projectForModal, setProjectForModal] = useState<Project | null>(null);
//   const [actionToConfirm, setActionToConfirm] = useState<string | null>(null);
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [currentProject, setCurrentProject] = useState<Project | null>(null);

//   useEffect(() => {
//     dispatch(fetchProjects());
//   }, [dispatch]);

//   // Handle errors from the slice
//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   const projectsData = useMemo(() => {
//     return projects.map((project) => ({
//       ...project,
//       creationDate: new Date(project.creationDate).toLocaleDateString("en-GB", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }),
//     }));
//   }, [projects]);

//   const filteredProjects = useMemo(() => {
//     return projectsData.filter((project) => {
//       const projectDate = new Date(project.creationDate.replace(/(\d{2}) (\w{3}) (\d{4})/, "$2 $1, $3"));
//       const startDate = filters.startDate ? new Date(filters.startDate) : null;
//       const endDate = filters.endDate ? new Date(filters.endDate) : null;
//       const matchDate = (!startDate || projectDate >= startDate) && (!endDate || projectDate <= endDate);
//       const matchStatus = filters.status === "All" || project.status === filters.status;
//       const matchBillingType = filters.billingType === "All" || project.billingType === filters.billingType;
//       const matchSearch = project.projectName.toLowerCase().includes(filters.searchTerm.toLowerCase());
//       return matchDate && matchStatus && matchBillingType && matchSearch;
//     });
//   }, [projectsData, filters]);

//   const handleAction = (actionName: string, project: Project) => {
//     setProjectForModal(project);
//     setActionToConfirm(actionName);
//     switch (actionName) {
//       case "View Details":
//         navigate(`/projects/list/detail/${project.id}`);
//         break;
//       case "Edit":
//         setCurrentProject(project);
//         setIsFormModalOpen(true);
//         break;
//       case "Delete":
//         setModalType("error");
//         setModalTitle("Delete Project?");
//         setModalMessage(`Are you sure you want to delete ${project.projectName}?`);
//         setIsModalOpen(true);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleConfirmAction = () => {
//     if (!projectForModal || !actionToConfirm) return;
//     if (actionToConfirm === "Delete") {
//       dispatch(deleteProject(projectForModal.id))
//         .unwrap()
//         .then(() => {
//           toast.success("Project deleted successfully!");
//         })
//         .catch(() => {
//           toast.error("Failed to delete project.");
//         });
//     }
//     setIsModalOpen(false);
//   };

//   const handleFormSubmit = (data: Record<string, any>) => {
//     if (currentProject) {
//       // Update existing project
//       dispatch(
//         updateProject({
//           id: currentProject.id,
//           data: {
//             projectName: data.projectName,
//             billingType: data.billingType,
//             status: data.status,
//           },
//         })
//       )
//         .unwrap()
//         .then(() => {
//           toast.success("Project updated successfully!");
//           setCurrentProject(null);
//         })
//         .catch(() => {
//           toast.error("Failed to update project.");
//         });
//     } else {
//       // Create new project
//       dispatch(
//         createProject({
//           projectName: data.projectName,
//           billingType: data.billingType,
//           creationDate: new Date().toISOString(), // Use current date for new projects
//           status: data.status,
//         })
//       )
//         .unwrap()
//         .then(() => {
//           toast.success("Project created successfully!");
//         })
//         .catch(() => {
//           toast.error("Failed to create project.");
//         });
//     }
//     setIsFormModalOpen(false);
//   };

//   const handleCloseFormModal = () => {
//     setIsFormModalOpen(false);
//     setCurrentProject(null); // Clear the current project on close
//   };

//   const handleApplyFilters = (newFilters: ProjectFilters) => {
//     dispatch(setFilters(newFilters));
//     setIsFilterOpen(false);
//   };

//   const handleClearFilters = () => {
//     dispatch(clearFilters());
//   };

//   const columns: Column<Project>[] = [
//     { key: "projectName", header: "Project Name" },
//     { key: "billingType", header: "Billing Type" },
//     { key: "creationDate", header: "Creation Date" },
//     {
//       key: "status",
//       header: "Status",
//       render: (row) => (
//         <span
//           className={`px-2 py-1 rounded text-xs font-semibold ${
//             row.status === "Active"
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {row.status}
//         </span>
//       ),
//     },
//     { key: "teamMember", header: "Team Members" },
//     {
//       key: "action",
//       header: "Action",
//       render: (row) => (
//         <ActionDropdown
//           project={row}
//           onAction={handleAction}
//           options={["View Details", "Edit", "Delete"]}
//         />
//       ),
//     },
//   ];

//   const renderTableContent = () => {
//     if (loading) return <div className="text-center p-10">Loading...</div>;
//     if (error)
//       return (
//         <div className="text-center p-10 text-red-600">Error: {error}</div>
//       );
//     if (filteredProjects.length === 0)
//       return <div className="text-center p-10">No projects found.</div>;
//     return (
//       <Table
//         data={filteredProjects}
//         columns={columns}
//         className="w-full text-sm"
//         onRowClick={(project) => navigate(`/projects/list/detail/${project.id}`)}
//       />
//     );
//   };

//   return (
//     <div className="px-4 py-6 w-full">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
//         <div className="text-sm font-medium">
//           <Link to="/dashboard" className="text-gray-500 hover:text-[#741CDD]">
//             Dashboard
//           </Link>
//           <span className="text-gray-500 mx-2">/</span>
//           <span className="text-gray-700">Projects</span>
//         </div>
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
//         <div className="flex justify-between items-center flex-wrap mb-4">
//           <button
//             onClick={() => {
//               setCurrentProject(null); // Ensure no project is pre-filled
//               setIsFormModalOpen(true);
//             }}
//             className="bg-[#741CDD] hover:bg-[#5b14a9] text-white px-4 py-2 text-sm rounded transition duration-200"
//           >
//             + NEW PROJECT
//           </button>
//           <button
//             onClick={() => setIsFilterOpen(true)}
//             className="border border-[#741CDD] text-[#741CDD] hover:bg-[#f0e6fa] px-4 py-2 text-sm rounded transition duration-200"
//           >
//             Filter
//           </button>
//         </div>
//         <div className="overflow-x-auto">{renderTableContent()}</div>
//       </div>

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         title={modalTitle}
//         message={modalMessage}
//         onConfirm={handleConfirmAction}
//         type={modalType}
//       />

//       <ProjectFormModal
//         isOpen={isFormModalOpen}
//         onClose={handleCloseFormModal}
//         onSubmit={handleFormSubmit}
//         initialData={currentProject}
//       />
      
//       <FilterSidebar
//         isOpen={isFilterOpen}
//         onClose={() => setIsFilterOpen(false)}
//         initialFilters={filters}
//         onApply={handleApplyFilters}
//         onClear={handleClearFilters}
//       />
//     </div>
//   );
// };

// export default ProjectList;
// features/Projects/list/pages/ProjectList.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Reusable components
import Table, { type Column } from "../../../../components/common/Table";
import NotificationModal from "../../../../components/common/NotificationModal";

// Project-specific components
import ActionDropdown from "../pages/ActionDropdown";
import ProjectFormModal from "../pages/ProjectFormModal";
import FilterSidebar from "../pages/FilterSidebar";
import ProjectHeader from "../pages/ProjectHeader"; // Import the new component

// Redux
import {
  fetchProjects,
  deleteProject,
  setFilters,
  clearFilters,
  createProject,
  updateProject,
  clearError,
} from "../../../../store/slice/projectSlice";
import type { RootState, AppDispatch } from "../../../../store/store";
import type { Project, ProjectFilters } from "../../../../types/project";

const ProjectList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { projects, loading, error, filters } = useSelector(
    (state: RootState) => state.project
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [projectForModal, setProjectForModal] = useState<Project | null>(null);
  const [actionToConfirm, setActionToConfirm] = useState<"delete" | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const filteredProjects = useMemo(() => {
    // filtering logic
    return projects.filter((project) => {
      const matchStatus = filters.status === "All" || project.status === filters.status;
      const matchBillingType = filters.billingType === "All" || project.billingType === filters.billingType;
      const matchSearch = project.projectName.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return matchStatus && matchBillingType && matchSearch;
    });
  }, [projects, filters]);

  const handleAction = (actionName: string, project: Project) => {
    setProjectForModal(project);
    switch (actionName) {
      case "View Details":
        navigate(`/projects/detail/${project.id}`);
        break;
      case "Edit":
        setCurrentProject(project);
        setIsFormModalOpen(true);
        break;
      case "Delete":
        setModalTitle("Delete Project?");
        setModalMessage(`Are you sure you want to delete "${project.projectName}"? This action cannot be undone.`);
        setActionToConfirm("delete");
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmAction = async () => {
    if (actionToConfirm === "delete" && projectForModal) {
      try {
        await dispatch(deleteProject(projectForModal.id)).unwrap();
        toast.success(`Project "${projectForModal.projectName}" deleted successfully!`);
      } catch (err) {
        toast.error("Failed to delete project.");
      }
    }
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      if (currentProject) {
        await dispatch(updateProject({ id: currentProject.id, data })).unwrap();
        toast.success(`Project "${data.projectName}" updated successfully!`);
      } else {
        await dispatch(createProject(data as Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">)).unwrap();
        toast.success(`Project "${data.projectName}" created successfully!`);
      }
      setIsFormModalOpen(false);
      setCurrentProject(null);
    } catch (err) {
      toast.error(`Failed to ${currentProject ? 'update' : 'create'} project.`);
    }
  };

  const handleRowClick = (project: Project) => {
      navigate(`/projects/detail/${project.id}`);
  };

  const columns: Column<Project>[] = [
    { key: "projectName", header: "Project Name" },
    { key: "billingType", header: "Billing Type" },
    { key: "creationDate", header: "Creation Date" },
    {
      key: "status",
      header: "Project Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    { key: "teamMember", header: "Team members" },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ActionDropdown project={row} onAction={handleAction} />
        </div>
      ),
    },
  ];

  const renderTableContent = () => {
    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-red-600">{error}</div>;
    if (filteredProjects.length === 0) return <div className="text-center p-10">No projects found.</div>;
    return <Table data={filteredProjects} columns={columns} onRowClick={handleRowClick} />;
  };

  return (
    <div className="px-4 py-6 w-full">
      <ProjectHeader
        onAddProjectClick={() => {
          setCurrentProject(null);
          setIsFormModalOpen(true);
        }}
        onFilterClick={() => setIsFilterSidebarOpen(true)}
      />

      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
        <div className="overflow-x-auto">{renderTableContent()}</div>
      </div>

      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleConfirmAction}
        type="error"
      />

      <ProjectFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setCurrentProject(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={currentProject}
      />

      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        initialFilters={filters}
        onApply={(newFilters) => {
          dispatch(setFilters(newFilters));
          setIsFilterSidebarOpen(false);
        }}
        onClear={() => {
          dispatch(clearFilters());
        }}
      />
    </div>
  );
};

export default ProjectList;