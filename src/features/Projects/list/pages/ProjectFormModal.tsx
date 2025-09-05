import React, { useRef } from "react";
import toast from "react-hot-toast"; // Import toast
import GenericForm, { type FormField } from "../../../../components/common/GenericForm";
import type { Project } from "../../../../types/project";
import { createProject, updateProject as updateProjectAction } from "../../../../store/slice/projectSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store/store";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  mode: "create" | "edit";
}

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  project,
  mode,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const formRef = useRef<{ handleSubmit: () => void }>(null);

  const handleSubmit = (formData: Record<string, any>) => {
    const projectData = {
      projectName: formData.projectName,
      billingType: formData.billingType,
      creationDate: formData.creationDate,
      status: formData.status,
    };

    let promise;
    let messages;

    if (mode === "create") {
      promise = dispatch(createProject(projectData as Omit<Project, "id" | "teamMember" | "isDeleted" | "resources">)).unwrap();
      messages = {
        loading: "Creating project...",
        success: "Project created successfully!",
        error: (err: any) => `Error: ${err.message || "Could not create project."}`,
      };
    } else if (mode === "edit" && project) {
      promise = dispatch(updateProjectAction({ id: project.id, data: projectData })).unwrap();
      messages = {
        loading: "Updating project...",
        success: "Project updated successfully!",
        error: (err: any) => `Error: ${err.message || "Could not update project."}`,
      };
    } else {
      return; // Should not happen
    }

    toast.promise(promise, messages)
      .then(() => {
        onClose();
      })
      .catch(() => {
       
      });
  };

  const initialState = project
    ? {
        projectName: project.projectName,
        billingType: project.billingType,
        creationDate: project.creationDate,
        status: project.status,
      }
    : {
        projectName: "",
        billingType: "TimeAndMaterial",
        creationDate: "",
        status: "Active",
      };

  const fields: FormField[] = [
    {
      name: "projectName",
      label: "Project Name",
      type: "text",
      required: true,
    },
    {
      name: "billingType",
      label: "Billing type",
      type: "select",
      required: true,
      options: [
        { value: "FixedCost", label: "Fixed Cost" },
        { value: "TimeAndMaterial", label: "Time and Material (TNM)" },
      ],
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
      required: true,
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-end z-50 bg-black/50">
      <div className="bg-white h-full w-full max-w-md shadow-xl transform transition-all duration-300 p-6 flex flex-col">
        <header className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === "create" ? "Add Project" : "Edit Project"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </header>
        <div className="flex-grow overflow-y-auto">
          <GenericForm
            ref={formRef}
            title=""
            fields={fields}
            initialState={initialState}
            onSubmit={handleSubmit}
            submitButtonText={mode === "create" ? "Submit" : "Update"}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectFormModal;