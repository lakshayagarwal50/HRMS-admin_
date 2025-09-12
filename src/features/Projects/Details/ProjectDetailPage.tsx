
// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast"; 
// import type { AppDispatch, RootState } from "../../../store/store";
// import { fetchProjectById, releaseResource } from "../../../store/slice/projectSlice";
// import ProjectDetailCard from "../Details/ProjectDetailCard";
// import ResourceTable from "../Details/ResourceTable";
// import AddResourceModal from "../Details/AddResourceModal";
// import NotificationModal from "../../../components/common/NotificationModal";
// import type { ProjectResource } from "../../../types/project";

// const ProjectDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const dispatch = useDispatch<AppDispatch>();

//   const { currentProject, loading, error } = useSelector(
//     (state: RootState) => state.project
//   );


//   const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
//   const [modalMode, setModalMode] = useState<"add" | "edit">("add");
//   const [selectedResource, setSelectedResource] = useState<ProjectResource | null>(null);


//   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
//   useEffect(() => {
//     if (id) {
//       dispatch(fetchProjectById(id));
//     }
//   }, [dispatch, id]);

//   const handleEditResource = (resource: ProjectResource) => {
//     setSelectedResource(resource);
//     setModalMode("edit");
//     setIsResourceModalOpen(true);
//   };

//   const handleReleaseResource = (resource: ProjectResource) => {
//     setSelectedResource(resource);
//     setIsConfirmModalOpen(true);
//   };

//   const handleConfirmRelease = () => {
//     if (selectedResource) {
//       const promise = dispatch(releaseResource(selectedResource.id)).unwrap();
      
//       toast.promise(promise, {
//         loading: `Releasing ${selectedResource.name}...`,
//         success: `${selectedResource.name} has been released successfully.`,
//         error: `Failed to release ${selectedResource.name}.`,
//       });
//     }
//     setIsConfirmModalOpen(false);
//     setSelectedResource(null);
//   };
  
//   if (loading) return <div className="p-6 text-center">Loading project details...</div>;
//   if (error) return <div className="p-6 text-center text-red-500">Error: {error}</div>;
//   if (!currentProject) return <div className="p-6 text-center">Project not found.</div>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-full">
//       <header className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">{currentProject.projectName}</h1>
//           <div className="text-sm text-gray-500">
//             <Link to="/dashboard" className="hover:text-purple-600">Dashboard</Link> / 
//             <Link to="/projects" className="hover:text-purple-600"> Projects</Link> / 
//             <span className="text-gray-700"> View Detail</span>
//           </div>
//         </div>
//         <button
//           onClick={() => {
//             setModalMode("add");
//             setSelectedResource(null); 
//             setIsResourceModalOpen(true);
//           }}
//           className="bg-[#741CDD] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#5b14a9] transition-colors"
//         >
//           + ADD RESOURCE
//         </button>
//       </header>
      
//       <ProjectDetailCard project={currentProject} />
      
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Resources</h2>
//         <div className="bg-white p-4 rounded-lg shadow-sm">
//           <ResourceTable 
//             resources={currentProject.resources || []}
//             onEdit={handleEditResource}
//             onRelease={handleReleaseResource}
//           />
//         </div>
//       </div>

//       <AddResourceModal
//         isOpen={isResourceModalOpen}
//         onClose={() => setIsResourceModalOpen(false)}
//         mode={modalMode}
//         projectId={id!}
//         resource={selectedResource}
//       />

//       <NotificationModal
//         isOpen={isConfirmModalOpen}
//         onClose={() => setIsConfirmModalOpen(false)}
//         onConfirm={handleConfirmRelease}
//         title="Release Resource"
//         message={`Are you sure you want to release ${selectedResource?.name} from the project?`}
//         type="warning"
//         confirmText="Sure"
//         cancelText="Cancel"
//       />
//     </div>
//   );
// };

// export default ProjectDetailPage;

// ProjectDetailPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  fetchProjectById,
  releaseResource,
} from "../../../store/slice/projectSlice";
import ProjectDetailCard from "../Details/ProjectDetailCard";
import ResourceTable from "../Details/ResourceTable";
import AddResourceModal from "../Details/AddResourceModal";
import NotificationModal from "../../../components/common/NotificationModal";
import type { ProjectResource } from "../../../types/project";

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { currentProject, loading, error } = useSelector(
    (state: RootState) => state.project
  );

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedResource, setSelectedResource] =
    useState<ProjectResource | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  const handleEditResource = (resource: ProjectResource) => {
    setSelectedResource(resource);
    setModalMode("edit");
    setIsResourceModalOpen(true);
  };

  const handleReleaseResource = (resource: ProjectResource) => {
    setSelectedResource(resource);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRelease = () => {
    if (selectedResource) {
      const promise = dispatch(releaseResource(selectedResource.id)).unwrap();
      toast
        .promise(promise, {
          loading: `Releasing ${selectedResource.name}...`,
          success: `${selectedResource.name} released successfully!`,
          error: `Failed to release ${selectedResource.name}.`,
        })
        .then(() => {
          setIsConfirmModalOpen(false);
          // Re-fetch project details to update the resources list
          if (id) {
            dispatch(fetchProjectById(id));
          }
        })
        .catch((err) => {
          console.error(err);
          setIsConfirmModalOpen(false);
        });
    }
  };

  // Add this function to handle the refresh after adding a resource
  const handleResourceAdded = () => {
    // Close the modal
    setIsResourceModalOpen(false);
    // Re-fetch the project details to get the updated list of resources
    if (id) {
      dispatch(fetchProjectById(id));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !currentProject) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Link
            to="/projects"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            All Projects
          </Link>
          <span className="text-gray-500">/</span>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {currentProject.projectName}
            </h1>
            <span className="text-sm ml-2 text-gray-700"> View Detail</span>
          </div>
        </div>
        <button
          onClick={() => {
            setModalMode("add");
            setSelectedResource(null);
            setIsResourceModalOpen(true);
          }}
          className="bg-[#741CDD] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#5b14a9] transition-colors"
        >
          + ADD RESOURCE
        </button>
      </header>

      <ProjectDetailCard project={currentProject} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resources</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <ResourceTable
            resources={currentProject.resources || []}
            onEdit={handleEditResource}
            onRelease={handleReleaseResource}
          />
        </div>
      </div>

      <AddResourceModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        mode={modalMode}
        projectId={id!}
        resource={selectedResource}
        onResourceAdded={handleResourceAdded}
      />

      <NotificationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmRelease}
        title="Release Resource"
        message={`Are you sure you want to release ${selectedResource?.name} from the project?`}
        type="warning"
        confirmText="Sure"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ProjectDetailPage;