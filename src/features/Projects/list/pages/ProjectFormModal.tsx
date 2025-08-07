// features/projects/list/components/ProjectFormModal.tsx
import React from "react";
import GenericForm, { type FormField } from "../../../../components/common/GenericForm";
import NotificationModal from "../../../../components/common/NotificationModal";
import type { Project } from "../../../../types/project";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  initialData?: Project | null;
}

const projectFormFields: FormField[] = [
  { name: "projectName", label: "Project Name", type: "text", placeholder: "Enter project name", required: true },
  { name: "billingType", label: "Billing Type", type: "select", options: [{ value: "FixedCost", label: "Fixed Cost" }, { value: "TimeAndMaterial", label: "Time and Material" }], required: true },
  { name: "creationDate", label: "Creation Date", type: "date", required: true },
  { name: "status", label: "Project Status", type: "select", options: [{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }], required: true },
];

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const formInitialState = initialData
    ? {
        projectName: initialData.projectName,
        billingType: initialData.billingType,
        creationDate: initialData.creationDate,
        status: initialData.status,
      }
    : {
        projectName: "",
        billingType: "TimeAndMaterial",
        creationDate: new Date().toISOString().substring(0, 10), // Default to today's date
        status: "Active",
      };

  return (
    <NotificationModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Project" : "Add Project"} showConfirmButton={false} showCancelButton={false}>
      <GenericForm
        title="test title"
        fields={projectFormFields}
        initialState={formInitialState}
        onSubmit={onSubmit}
        onCancel={onClose}
        submitButtonText={initialData ? "Update" : "Submit"}
        cancelButtonText="Cancel"
      />
    </NotificationModal>
  );
};

export default ProjectFormModal;