

import React from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast"; // Import toast
import GenericForm, { type FormField } from "../../../components/common/GenericForm";
import { allocateEmployeeToProject, updateResourceAllocation } from "../../../store/slice/projectSlice";
import type { AppDispatch } from "../../../store/store";
import type { ProjectResource } from "../../../types/project";

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  projectId: string;
  resource: ProjectResource | null;
}

const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, mode, projectId, resource }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (formData: Record<string, any>) => {
    let promise;
    let messages;

    if (mode === 'add') {
      const newResource = {
        empCode: formData.empCode,
        name: formData.name,
        department: formData.department,
        designation: formData.designation,
        allocatedHours: Number(formData.allocatedHours),
        allocatedFrom: formData.allocatedFrom,
        allocatedtill: formData.allocatedtill,
        hoursLogged: 0,
        experience: Number(formData.experience),
        isDeleted: false,
      };
      promise = dispatch(allocateEmployeeToProject({ projectId, resource: newResource })).unwrap();
      messages = {
        loading: `Adding ${formData.name} to the project...`,
        success: `${formData.name} added successfully!`,
        error: "Failed to add resource.",
      };
    } else if (mode === 'edit' && resource) {
      const updatedData = {
        allocatedHours: Number(formData.allocatedHours),
        allocatedFrom: formData.allocatedFrom,
        allocatedtill: formData.allocatedtill,
      };
      promise = dispatch(updateResourceAllocation({ resourceId: resource.id, data: updatedData })).unwrap();
      messages = {
        loading: `Updating allocation for ${resource.name}...`,
        success: "Resource allocation updated successfully!",
        error: "Failed to update allocation.",
      };
    } else {
      return;
    }

    toast.promise(promise, messages).then(() => {
      onClose();
    }).catch(err => {
      console.error(err);
      // Keep modal open on error
    });
  };

  const fields: FormField[] = [
   
    { name: "empCode", label: "Emp Code", type: "text", required: true, disabled: mode === 'edit' },
    { name: "name", label: "Resource Name", type: "text", required: true, disabled: mode === 'edit' },
    { name: "department", label: "Department", type: "text", required: true, disabled: mode === 'edit' },
    { name: "designation", label: "Designation", type: "text", required: true, disabled: mode === 'edit' },
    { name: "experience", label: "Experience (years)", type: "number", required: true, disabled: mode === 'edit' },
    { name: "allocatedHours", label: "Allocation Hours", type: "number", required: true },
    { name: "allocatedFrom", label: "Allocation From", type: "date", required: true },
    { name: "allocatedtill", label: "Allocation Till", type: "date", required: true },
  ];
  
 
  const editFields = fields.filter(f => !f.disabled);

  const initialState = resource
    ? { ...resource }
    : {
        empCode: "", name: "", department: "", designation: "", experience: 0,
        allocatedHours: 0, allocatedFrom: "", allocatedtill: "",
      };
      
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-end z-50 bg-black/50">
      <div className="bg-white h-full w-full max-w-xl shadow-xl p-6 flex flex-col">
     
        <div className="flex-grow overflow-y-auto">
          <GenericForm
            title="Add Resource"
            fields={mode === 'add' ? fields : editFields}
            initialState={initialState}
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitButtonText={mode === 'add' ? "Save" : "Update"}
          />
        </div>
      </div>
    </div>
  );
};

export default AddResourceModal;