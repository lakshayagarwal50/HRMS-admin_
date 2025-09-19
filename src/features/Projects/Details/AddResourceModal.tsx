// import React from "react";
// import { useDispatch } from "react-redux";
// import toast from "react-hot-toast"; // Import toast
// import GenericForm, { type FormField } from "../../../components/common/GenericForm";
// import { allocateEmployeeToProject, updateResourceAllocation } from "../../../store/slice/projectSlice";
// import type { AppDispatch } from "../../../store/store";
// import type { ProjectResource } from "../../../types/project";

// interface AddResourceModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   mode: "add" | "edit";
//   projectId: string;
//   resource: ProjectResource | null;
// }

// const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, mode, projectId, resource }) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const handleSubmit = (formData: Record<string, any>) => {
//     let promise;
//     let messages;

//     if (mode === 'add') {
//       const newResource = {
//         empCode: formData.empCode,
//         name: formData.name,
//         department: formData.department,
//         designation: formData.designation,
//         allocatedHours: Number(formData.allocatedHours),
//         allocatedFrom: formData.allocatedFrom,
//         allocatedtill: formData.allocatedtill,
//         hoursLogged: 0,
//         experience: Number(formData.experience),
//         isDeleted: false,
//       };
//       promise = dispatch(allocateEmployeeToProject({ projectId, resource: newResource })).unwrap();
//       messages = {
//         loading: `Adding ${formData.name} to the project...`,
//         success: `${formData.name} added successfully!`,
//         error: "Failed to add resource.",
//       };
//     } else if (mode === 'edit' && resource) {
//       const updatedData = {
//         allocatedHours: Number(formData.allocatedHours),
//         allocatedFrom: formData.allocatedFrom,
//         allocatedtill: formData.allocatedtill,
//       };
//       promise = dispatch(updateResourceAllocation({ resourceId: resource.id, data: updatedData })).unwrap();
//       messages = {
//         loading: `Updating allocation for ${resource.name}...`,
//         success: "Resource allocation updated successfully!",
//         error: "Failed to update allocation.",
//       };
//     } else {
//       return;
//     }

//     toast.promise(promise, messages).then(() => {
//       onClose();
//     }).catch(err => {
//       console.error(err);
//       // Keep modal open on error
//     });
//   };

//   const fields: FormField[] = [

//     { name: "empCode", label: "Emp Code", type: "text", required: true, disabled: mode === 'edit' },
//     { name: "name", label: "Resource Name", type: "text", required: true, disabled: mode === 'edit' },
//     { name: "department", label: "Department", type: "text", required: true, disabled: mode === 'edit' },
//     { name: "designation", label: "Designation", type: "text", required: true, disabled: mode === 'edit' },
//     { name: "experience", label: "Experience (years)", type: "number", required: true, disabled: mode === 'edit' },
//     { name: "allocatedHours", label: "Allocation Hours", type: "number", required: true },
//     { name: "allocatedFrom", label: "Allocation From", type: "date", required: true },
//     { name: "allocatedtill", label: "Allocation Till", type: "date", required: true },
//   ];

//   const editFields = fields.filter(f => !f.disabled);

//   const initialState = resource
//     ? { ...resource }
//     : {
//         empCode: "", name: "", department: "", designation: "", experience: 0,
//         allocatedHours: 0, allocatedFrom: "", allocatedtill: "",
//       };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-end z-50 bg-black/50">
//       <div className="bg-white h-full w-full max-w-xl shadow-xl p-6 flex flex-col">

//         <div className="flex-grow overflow-y-auto">
//           <GenericForm
//             title="Add Resource"
//             fields={mode === 'add' ? fields : editFields}
//             initialState={initialState}
//             onSubmit={handleSubmit}
//             onCancel={onClose}
//             submitButtonText={mode === 'add' ? "Save" : "Update"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddResourceModal;

// import React from "react";
// import { useDispatch } from "react-redux";
// import toast from "react-hot-toast";
// import GenericForm, { type FormField } from "../../../components/common/GenericForm";
// import { allocateEmployeeToProject, updateResourceAllocation } from "../../../store/slice/projectSlice";
// import type { AppDispatch } from "../../../store/store";
// import type { ProjectResource } from "../../../types/project";

// interface AddResourceModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   mode: "add" | "edit";
//   projectId: string;
//   resource: ProjectResource | null;
// }

// const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, mode, projectId, resource }) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const handleSubmit = (formData: Record<string, any>) => {
//     let promise;
//     let messages;

//     if (mode === 'add') {
//       const newResource = {
//         empCode: formData.empCode,
//         name: formData.name,
//         department: formData.department,
//         designation: formData.designation,
//         allocatedHours: Number(formData.allocatedHours),
//         allocatedFrom: formData.allocatedFrom,
//         allocatedtill: formData.allocatedtill,
//         hoursLogged: 0,
//         experience: Number(formData.experience),
//         isDeleted: false,
//       };
//       promise = dispatch(allocateEmployeeToProject({ projectId, resource: newResource })).unwrap();
//       messages = {
//         loading: `Adding ${formData.name} to the project...`,
//         success: `${formData.name} added successfully!`,
//         error: "Failed to add resource.",
//       };
//     } else if (mode === 'edit' && resource) {
//       const updatedData = {
//         allocatedHours: Number(formData.allocatedHours),
//         allocatedFrom: formData.allocatedFrom,
//         allocatedtill: formData.allocatedtill,
//       };
//       promise = dispatch(updateResourceAllocation({ resourceId: resource.id, data: updatedData })).unwrap();
//       messages = {
//         loading: `Updating allocation for ${resource.name}...`,
//         success: "Resource allocation updated successfully!",
//         error: "Failed to update allocation.",
//       };
//     } else {
//       return;
//     }

//     toast.promise(promise, messages).then(() => {
//       onClose();
//     }).catch(err => {
//       console.error(err);
//       // Keep modal open on error
//     });
//   };

//   // Define custom validation functions for each field
//   const validateEmpCode = (value: string): string | null => {
//     const empCodeRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
//     if (!empCodeRegex.test(value)) {
//       return "Emp Code must contain at least one letter and one number, and only contain letters and numbers.";
//     }
//     return null;
//   };

//   const validateText = (value: string): string | null => {
//     const textRegex = /^[a-zA-Z\s]+$/;
//     if (!textRegex.test(value)) {
//       return "This field can only contain letters and spaces.";
//     }
//     return null;
//   };

//   const validateExperience = (value: number | string): string | null => {
//     const num = Number(value);
//     if (isNaN(num) || num < 0 || num > 50) {
//       return "Experience must be a positive number and not greater than 50.";
//     }
//     return null;
//   };

//   const validateAllocatedHours = (value: number | string): string | null => {
//     const num = Number(value);
//     if (isNaN(num) || num <= 0) {
//       return "Allocation Hours must be a positive number.";
//     }
//     return null;
//   };

//   const validateAllocationFrom = (value: string): string | null => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const fiveDaysAgo = new Date();
//     fiveDaysAgo.setDate(today.getDate() - 5);
//     fiveDaysAgo.setHours(0, 0, 0, 0);
//     const fromDate = new Date(value);
//     fromDate.setHours(0, 0, 0, 0);
//     if (fromDate < fiveDaysAgo || fromDate > today) {
//       return "Allocation From must be within the last 5 days up to today.";
//     }
//     return null;
//   };

//   const validateAllocationTill = (value: string, formData: Record<string, any>): string | null => {
//     const fromDate = new Date(formData.allocatedFrom);
//     const tillDate = new Date(value);
//     if (tillDate <= fromDate) {
//       return "Allocation Till must be at least one day after Allocation From.";
//     }
//     return null;
//   };

//   const fields: FormField[] = [
//     { name: "empCode", label: "Emp Code", type: "text", required: true, disabled: mode === 'edit', validation: validateEmpCode },
//     { name: "name", label: "Resource Name", type: "text", required: true, disabled: mode === 'edit', validation: validateText },
//     { name: "department", label: "Department", type: "text", required: true, disabled: mode === 'edit', validation: validateText },
//     { name: "designation", label: "Designation", type: "text", required: true, disabled: mode === 'edit', validation: validateText },
//     { name: "experience", label: "Experience (years)", type: "number", required: true, disabled: mode === 'edit', validation: validateExperience },
//     { name: "allocatedHours", label: "Allocation Hours", type: "number", required: true, validation: validateAllocatedHours },
//     { name: "allocatedFrom", label: "Allocation From", type: "date", required: true, validation: validateAllocationFrom },
//     {
//       name: "allocatedtill",
//       label: "Allocation Till",
//       type: "date",
//       required: true,
//       validation: (value: any) => validateAllocationTill(value, resource || {}), // Pass current form data for cross-field validation
//     },
//   ];

//   const editFields = fields.filter(f => !f.disabled);

//   const initialState = resource
//     ? { ...resource }
//     : {
//         empCode: "", name: "", department: "", designation: "", experience: 0,
//         allocatedHours: 0, allocatedFrom: "", allocatedtill: "",
//       };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-end z-50 bg-black/50">
//       <div className="bg-white h-full w-full max-w-xl shadow-xl flex flex-col">
//         <GenericForm
//           title={mode === 'add' ? "Add Resource" : "Edit Resource Allocation"}
//           fields={mode === 'add' ? fields : editFields}
//           initialState={initialState}
//           onSubmit={handleSubmit}
//           onCancel={onClose}
//           submitButtonText={mode === 'add' ? "Save" : "Update"}
//         />
//       </div>
//     </div>
//   );
// };

// export default AddResourceModal;

// import React from "react";
// import { useDispatch } from "react-redux";
// import toast from "react-hot-toast";
// import GenericForm, { type FormField } from "../../../components/common/GenericForm";
// import { allocateEmployeeToProject, updateResourceAllocation } from "../../../store/slice/projectSlice";
// import type { AppDispatch } from "../../../store/store";
// import type { ProjectResource } from "../../../types/project";

// interface AddResourceModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   mode: "add" | "edit";
//   projectId: string;
//   resource: ProjectResource | null;
// }

// const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, mode, projectId, resource }) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const handleSubmit = (formData: Record<string, any>) => {
//     const tillError = validateAllocationTill(formData.allocatedtill, formData);
//     if (tillError) {
//       toast.error(tillError);
//       return;
//     }

//     let promise;
//     let messages;

//     if (mode === 'add') {
//       const newResource = {
//         empCode: formData.empCode,
//         name: formData.name,
//         department: formData.department,
//         designation: formData.designation,
//         allocatedHours: Number(formData.allocatedHours),
//         allocatedFrom: formData.allocatedFrom,
//         allocatedtill: formData.allocatedtill,
//         hoursLogged: 0,
//         experience: Number(formData.experience),
//         isDeleted: false,
//       };
//       promise = dispatch(allocateEmployeeToProject({ projectId, resource: newResource })).unwrap();
//       messages = {
//         loading: `Adding ${formData.name} to the project...`,
//         success: `${formData.name} added successfully!`,
//         error: "Failed to add resource.",
//       };
//     } else if (mode === 'edit' && resource) {
//       const updatedData = {
//         allocatedHours: Number(formData.allocatedHours),
//         allocatedFrom: formData.allocatedFrom,
//         allocatedtill: formData.allocatedtill,
//       };
//       promise = dispatch(updateResourceAllocation({ resourceId: resource.id, data: updatedData })).unwrap();
//       messages = {
//         loading: `Updating allocation for ${resource.name}...`,
//         success: "Resource allocation updated successfully!",
//         error: "Failed to update allocation.",
//       };
//     } else {
//       return;
//     }

//     toast.promise(promise, messages).then(() => {
//       onClose();
//     }).catch(err => {
//       console.error(err);
//       // Keep modal open on error
//     });
//   };

//   // Define custom validation functions for each field
//   const validateEmpCode = (value: string): string | null => {
//     const empCodeRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
//     if (!empCodeRegex.test(value)) {
//       return "Emp Code must contain at least one letter and one number, and only contain letters and numbers.";
//     }
//     return null;
//   };

//   const validateText = (value: string): string | null => {
//     const textRegex = /^[a-zA-Z\s]+$/;
//     if (!textRegex.test(value)) {
//       return "This field can only contain letters and spaces.";
//     }
//     return null;
//   };

//   const validateExperience = (value: number | string): string | null => {
//     const num = Number(value);
//     if (isNaN(num) || num < 0 || num > 50) {
//       return "Experience must be a positive number and not greater than 50.";
//     }
//     return null;
//   };

//   const validateAllocatedHours = (value: number | string): string | null => {
//     const num = Number(value);
//     if (isNaN(num) || num <= 0) {
//       return "Allocation Hours must be a positive number.";
//     }
//     return null;
//   };

//   const validateAllocationFrom = (value: string): string | null => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const maxFuture = new Date(today);
//     maxFuture.setDate(today.getDate() + 90);
//     const fromDate = new Date(value);
//     fromDate.setHours(0, 0, 0, 0);
//     if (fromDate < today) {
//       return "Allocation From cannot be in the past.";
//     }
//     if (fromDate > maxFuture) {
//       return "Allocation From cannot be more than 90 days in the future.";
//     }
//     return null;
//   };

//   const validateAllocationTill = (value: string, formData: Record<string, any>): string | null => {
//     if (!formData.allocatedFrom) {
//       return "Allocation From must be set first.";
//     }
//     const fromDate = new Date(formData.allocatedFrom);
//     fromDate.setHours(0, 0, 0, 0);
//     if (isNaN(fromDate.getTime())) {
//       return "Invalid Allocation From date.";
//     }
//     const tillDate = new Date(value);
//     tillDate.setHours(0, 0, 0, 0);
//     if (tillDate <= fromDate) {
//       return "Allocation Till must be strictly after Allocation From.";
//     }
//     const maxTill = new Date(fromDate);
//     maxTill.setFullYear(fromDate.getFullYear() + 2);
//     if (tillDate > maxTill) {
//       return "Allocation Till cannot exceed 2 years from Allocation From.";
//     }
//     return null;
//   };

//   const fields: FormField[] = [
//     { name: "empCode", label: "Emp Code", type: "text", required: true, disabled: mode === 'edit', validation: validateEmpCode },
//     { name: "name", label: "Resource Name", type: "text", required: true, disabled: mode === 'edit', validation: validateText },
//     { name: "department", label: "Department", type: "text", required: true, disabled: mode === 'edit', validation: validateText },
//     { name: "designation", label: "Designation", type: "text", required: true, disabled: mode === 'edit', validation: validateText },
//     { name: "experience", label: "Experience (years)", type: "number", required: true, disabled: mode === 'edit', validation: validateExperience },
//     { name: "allocatedHours", label: "Allocation Hours", type: "number", required: true, validation: validateAllocatedHours },
//     { name: "allocatedFrom", label: "Allocation From", type: "date", required: true, validation: validateAllocationFrom },
//     {
//       name: "allocatedtill",
//       label: "Allocation Till",
//       type: "date",
//       required: true,
//     },
//   ];

//   const editFields = fields.filter(f => !f.disabled);

//   const initialState = resource
//     ? { ...resource }
//     : {
//         empCode: "", name: "", department: "", designation: "", experience: 0,
//         allocatedHours: 0, allocatedFrom: "", allocatedtill: "",
//       };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-end z-50 bg-black/50">
//       <div className="bg-white h-full w-full max-w-xl shadow-xl flex flex-col">
//         <GenericForm
//           title={mode === 'add' ? "Add Resource" : "Edit Resource Allocation"}
//           fields={mode === 'add' ? fields : editFields}
//           initialState={initialState}
//           onSubmit={handleSubmit}
//           onCancel={onClose}
//           submitButtonText={mode === 'add' ? "Save" : "Update"}
//         />
//       </div>
//     </div>
//   );
// };

// export default AddResourceModal;

// ==================================================

// import React from "react";
// import { useDispatch } from "react-redux";
// import toast from "react-hot-toast";
// import GenericForm, { type FormField } from "../../../components/common/GenericForm";
// import { allocateEmployeeToProject, updateResourceAllocation } from "../../../store/slice/projectSlice";
// import type { AppDispatch } from "../../../store/store";
// import type { ProjectResource } from "../../../types/project";

// interface AddResourceModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   mode: "add" | "edit";
//   projectId: string;
//   resource: ProjectResource | null;
// }

// const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose, mode, projectId, resource }) => {
//   const dispatch = useDispatch<AppDispatch>();

//   const handleSubmit = (formData: Record<string, any>) => {
//     const tillError = validateAllocationTill(formData.allocatedtill, formData);
//     if (tillError) {
//       toast.error(tillError);
//       return;
//     }

//     let promise;
//     let messages;

//     if (mode === 'add') {
//       const newResource = {
//         empCode: formData.empCode,
//         name: formData.name,
//         department: formData.department,
//         designation: formData.designation,
//         allocatedHours: Number(formData.allocatedHours),
//         allocatedFrom: formData.allocatedFrom,
//         allocatedtill: formData.allocatedtill,
//         hoursLogged: 0,
//         experience: Number(formData.experience),
//         isDeleted: false,
//       };
//       promise = dispatch(allocateEmployeeToProject({ projectId, resource: newResource })).unwrap();
//       messages = {
//         loading: `Adding ${formData.name} to the project...`,
//         success: `${formData.name} added successfully!`,
//         error: (err: any) => `Failed to add resource: ${err}`,
//       };
//     } else if (mode === 'edit' && resource) {
//       const updatedData = {
//         allocatedHours: Number(formData.allocatedHours),
//         allocatedFrom: formData.allocatedFrom,
//         allocatedtill: formData.allocatedtill,
//       };
//       promise = dispatch(updateResourceAllocation({ resourceId: resource.id, data: updatedData })).unwrap();
//       messages = {
//         loading: `Updating allocation for ${resource.name}...`,
//         success: "Resource allocation updated successfully!",
//         error: (err: any) => `Failed to update allocation: ${err}`,
//       };
//     } else {
//       return;
//     }

//     toast.promise(promise, messages)
//       .then(() => {
//         onClose();
//       })
//       .catch((err: any) => {
//         // The toast.promise handles displaying the error message,
//         // so we just log the error here.
//         console.error(err);
//       });
//   };

//   // Define custom validation functions for each field
//   const validateEmpCode = (value: string): string | null => {
//     const empCodeRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
//     if (!empCodeRegex.test(value)) {
//       return "Emp Code must contain at least one letter and one number, and only contain letters and numbers.";
//     }
//     return null;
//   };

//   const validateText = (value: string): string | null => {
//     const textRegex = /^[a-zA-Z\s]+$/;
//     if (!textRegex.test(value)) {
//       return "This field can only contain letters and spaces.";
//     }
//     return null;
//   };

//   const validateExperience = (value: number | string): string | null => {
//     const num = Number(value);
//     if (isNaN(num) || num < 0 || num > 50) {
//       return "Experience must be a positive number and not greater than 50.";
//     }
//     return null;
//   };

//   const validateAllocatedHours = (value: number | string): string | null => {
//     const num = Number(value);
//     if (isNaN(num) || num <= 0) {
//       return "Allocation Hours must be a positive number.";
//     }
//     return null;
//   };

//   const validateAllocationFrom = (value: string): string | null => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const maxFuture = new Date(today);
//     maxFuture.setDate(today.getDate() + 90);
//     const fromDate = new Date(value);
//     fromDate.setHours(0, 0, 0, 0);
//     if (fromDate < today) {
//       return "Allocation From cannot be in the past.";
//     }
//     if (fromDate > maxFuture) {
//       return "Allocation From cannot be more than 90 days in the future.";
//     }
//     return null;
//   };

//   const validateAllocationTill = (value: string, formData: Record<string, any>): string | null => {
//     if (!formData.allocatedFrom) {
//       return "Allocation From must be set first.";
//     }
//     const fromDate = new Date(formData.allocatedFrom);
//     fromDate.setHours(0, 0, 0, 0);
//     if (isNaN(fromDate.getTime())) {
//       return "Invalid Allocation From date.";
//     }
//     const tillDate = new Date(value);
//     tillDate.setHours(0, 0, 0, 0);
//     if (tillDate <= fromDate) {
//       return "Allocation Till must be strictly after Allocation From.";
//     }
//     const maxTill = new Date(fromDate);
//     maxTill.setFullYear(fromDate.getFullYear() + 2);
//     if (tillDate > maxTill) {
//       return "Allocation Till cannot exceed 2 years from Allocation From.";
//     }
//     return null;
//   };

//   const fields: FormField[] = [
//     { name: "empCode", label: "Emp Code", type: "text", required: true, disabled: mode === 'edit', validation: validateEmpCode },
//     { name: "name", label: "Resource Name", type: "text", required: true, disabled: mode === 'edit', validation: validateText },
//     { name: "department", label: "Department", type: "text", required: true, disabled: mode === 'edit', validation: validateText },
//     { name: "designation", label: "Designation", type: "text", required: true, disabled: mode === 'edit', validation: validateText },
//     { name: "experience", label: "Experience (years)", type: "number", required: true, disabled: mode === 'edit', validation: validateExperience },
//     { name: "allocatedHours", label: "Allocation Hours", type: "number", required: true, validation: validateAllocatedHours },
//     { name: "allocatedFrom", label: "Allocation From", type: "date", required: true, validation: validateAllocationFrom },
//     {
//       name: "allocatedtill",
//       label: "Allocation Till",
//       type: "date",
//       required: true,
//     },
//   ];

//   const editFields = fields.filter(f => !f.disabled);

//   const initialState = resource
//     ? { ...resource }
//     : {
//         empCode: "", name: "", department: "", designation: "", experience: 0,
//         allocatedHours: 0, allocatedFrom: "", allocatedtill: "",
//       };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-end z-50 bg-black/50">
//       <div className="bg-white h-full w-full max-w-xl shadow-xl flex flex-col">
//         <GenericForm
//           title={mode === 'add' ? "Add Resource" : "Edit Resource Allocation"}
//           fields={mode === 'add' ? fields : editFields}
//           initialState={initialState}
//           onSubmit={handleSubmit}
//           onCancel={onClose}
//           submitButtonText={mode === 'add' ? "Save" : "Update"}
//         />
//       </div>
//     </div>
//   );
// };

// export default AddResourceModal;

// ===========
// AddResourceModal.tsx

import React from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import GenericForm, {
  type FormField,
} from "../../../components/common/GenericForm";
import {
  allocateEmployeeToProject,
  updateResourceAllocation,
} from "../../../store/slice/projectSlice";
import type { AppDispatch } from "../../../store/store";
import type { ProjectResource } from "../../../types/project";

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  projectId: string;
  resource: ProjectResource | null;
  onResourceAdded: () => void; // ✅ new prop
}

const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  mode,
  projectId,
  resource,
  onResourceAdded, // ✅ destructured
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (formData: Record<string, any>) => {
    const tillError = validateAllocationTill(formData.allocatedtill, formData);
    if (tillError) {
      toast.error(tillError);
      return;
    }

    let promise;
    let messages;

    if (mode === "add") {
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
      promise = dispatch(
        allocateEmployeeToProject({ projectId, resource: newResource })
      ).unwrap();
      messages = {
        loading: `Adding ${formData.name} to the project...`,
        success: `${formData.name} added successfully!`,
        error: "Failed to add resource.",
      };
    } else if (mode === "edit" && resource) {
      const updatedData = {
        allocatedHours: Number(formData.allocatedHours),
        allocatedFrom: formData.allocatedFrom,
        allocatedtill: formData.allocatedtill,
      };
      promise = dispatch(
        updateResourceAllocation({ resourceId: resource.id, data: updatedData })
      ).unwrap();
      messages = {
        loading: `Updating allocation for ${resource.name}...`,
        success: "Resource allocation updated successfully!",
        error: "Failed to update allocation.",
      };
    } else {
      return;
    }

    toast
      .promise(promise, messages)
      .then(() => {
        onResourceAdded(); // ✅ trigger callback
        onClose(); // ✅ also close modal on success
      })
      .catch((err) => {
        console.error(err);
        // Keep modal open on error
      });
  };

  // ✅ validation functions
  const validateEmpCode = (value: string): string | null => {
    const empCodeRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
    if (!empCodeRegex.test(value)) {
      return "Emp Code must contain at least one letter and one number, and only contain letters and numbers.";
    }
    return null;
  };

  const validateText = (value: string): string | null => {
    const textRegex = /^[a-zA-Z\s]+$/;
    if (!textRegex.test(value)) {
      return "This field can only contain letters and spaces.";
    }
    return null;
  };

  const validateExperience = (value: number | string): string | null => {
    const num = Number(value);
    if (isNaN(num) || num < 0 || num > 50) {
      return "Experience must be a positive number and not greater than 50.";
    }
    return null;
  };

  const validateAllocatedHours = (value: number | string): string | null => {
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return "Allocation Hours must be a positive number.";
    }
    return null;
  };

  const validateAllocationFrom = (value: string): string | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxFuture = new Date(today);
    maxFuture.setDate(today.getDate() + 90);
    const fromDate = new Date(value);
    fromDate.setHours(0, 0, 0, 0);
    if (fromDate < today) {
      return "Allocation From cannot be in the past.";
    }
    if (fromDate > maxFuture) {
      return "Allocation From cannot be more than 90 days in the future.";
    }
    return null;
  };

  const validateAllocationTill = (
    value: string,
    formData: Record<string, any>
  ): string | null => {
    if (!formData.allocatedFrom) {
      return "Allocation From must be set first.";
    }
    const fromDate = new Date(formData.allocatedFrom);
    fromDate.setHours(0, 0, 0, 0);
    if (isNaN(fromDate.getTime())) {
      return "Invalid Allocation From date.";
    }
    const tillDate = new Date(value);
    tillDate.setHours(0, 0, 0, 0);
    if (tillDate <= fromDate) {
      return "Allocation Till must be strictly after Allocation From.";
    }
    const maxTill = new Date(fromDate);
    maxTill.setFullYear(fromDate.getFullYear() + 2);
    if (tillDate > maxTill) {
      return "Allocation Till cannot exceed 2 years from Allocation From.";
    }
    return null;
  };

  // ✅ form fields
  const fields: FormField[] = [
    {
      name: "empCode",
      label: "Emp Code",
      type: "text",
      required: true,
      disabled: mode === "edit",
      validation: validateEmpCode,
    },
    // {
    //   name: "name",
    //   label: "Resource Name",
    //   type: "text",
    //   required: true,
    //   disabled: mode === "edit",
    //   validation: validateText,
    // },
    // {
    //   name: "department",
    //   label: "Department",
    //   type: "text",
    //   required: true,
    //   disabled: mode === "edit",
    //   validation: validateText,
    // },
    // {
    //   name: "designation",
    //   label: "Designation",
    //   type: "text",
    //   required: true,
    //   disabled: mode === "edit",
    //   validation: validateText,
    // },
    {
      name: "experience",
      label: "Experience (years)",
      type: "number",
      required: true,
      disabled: mode === "edit",
      validation: validateExperience,
    },
    {
      name: "allocatedHours",
      label: "Allocation Hours",
      type: "number",
      required: true,
      validation: validateAllocatedHours,
    },
    {
      name: "allocatedFrom",
      label: "Allocation From",
      type: "date",
      required: true,
      validation: validateAllocationFrom,
    },
    {
      name: "allocatedtill",
      label: "Allocation Till",
      type: "date",
      required: true,
    },
  ];

  const editFields = fields.filter((f) => !f.disabled);

  const initialState = resource
    ? { ...resource }
    : {
        empCode: "",
        name: "",
        department: "",
        designation: "",
        experience: 0,
        allocatedHours: 0,
        allocatedFrom: "",
        allocatedtill: "",
      };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-end z-50 bg-black/50">
      <div className="bg-white h-full w-full max-w-xl shadow-xl flex flex-col">
        <GenericForm
          title={mode === "add" ? "Add Resource" : "Edit Resource Allocation"}
          fields={mode === "add" ? fields : editFields}
          initialState={initialState}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitButtonText={mode === "add" ? "Save" : "Update"}
        />
      </div>
    </div>
  );
};

export default AddResourceModal;
