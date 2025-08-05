
// import React, {
//   useState,
//   type ChangeEvent,
//   type FormEvent,
//   useEffect,
// } from "react";

// // --- TYPE DEFINITIONS ---

// export interface FormFieldOption {
//   value: string | number;
//   label: string;
// }

// export interface FormField {
//   name: string;
//   label: string;
//   type:
//     | "text"
//     | "number"
//     | "textarea"
//     | "select"
//     | "date"
//     | "switch"
//     | "password"
//     | "email";
//   placeholder?: string;
//   required?: boolean;
//   options?: FormFieldOption[];
//   spanFull?: boolean;
// }

// export interface GenericFormProps {
//   title: string;
//   fields: FormField[];
//   initialState: Record<string, any>;
//   onSubmit: (data: Record<string, any>) => void;
//   onCancel?: () => void;
//   submitButtonText?: string;
//   cancelButtonText?: string;
// }

// // --- GENERIC FORM COMPONENT (Styled for Modal) ---

// const GenericForm: React.FC<GenericFormProps> = ({
//   title,
//   fields,
//   initialState,
//   onSubmit,
//   onCancel,
//   submitButtonText = "Submit",
//   cancelButtonText = "Cancel",
// }) => {
//   const [formData, setFormData] = useState<Record<string, any>>(initialState);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, type } = e.target;
//     const isCheckbox = type === "checkbox";
//     const checkedValue = (e.target as HTMLInputElement).checked;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: isCheckbox ? checkedValue : value,
//     }));
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const renderField = (field: FormField) => {
//     const commonInputClasses =
//       "w-full p-2 border border-slate-300 rounded-md bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#714CDD] focus:border-[#714CDD] transition-colors duration-200 ease-in-out";

//     const value =
//       formData[field.name] ?? (field.type === "switch" ? false : "");

//     switch (field.type) {
//       case "select":
//         return (
//           <select
//             id={field.name}
//             name={field.name}
//             value={value}
//             onChange={handleChange}
//             required={field.required}
//             className={commonInputClasses}
//           >
//             <option value="" disabled>
//               Please Select
//             </option>
//             {field.options?.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         );
//       case "textarea":
//         return (
//           <textarea
//             id={field.name}
//             name={field.name}
//             value={value}
//             onChange={handleChange}
//             placeholder={field.placeholder}
//             required={field.required}
//             rows={3}
//             className={commonInputClasses}
//           />
//         );
//       // Other cases remain the same...
//       default:
//         return (
//           <input
//             id={field.name}
//             name={field.name}
//             type={field.type}
//             value={value}
//             onChange={handleChange}
//             placeholder={field.placeholder}
//             required={field.required}
//             className={commonInputClasses}
//           />
//         );
//     }
//   };

//   return (
//     // The form is now designed to fit within a modal container
//     <div className="bg-white h-full flex flex-col  ">
//       {/* Modal Header with Centered Title */}
//       <div className="relative flex justify-center items-center p-6 border-b border-slate-200 ">
//         <h2 className="text-xl font-bold text-slate-800">{title}</h2>
//         {onCancel && (
//           <button
//             onClick={onCancel}
//             className="absolute right-6 text-slate-400 hover:text-slate-600"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M6 18L18 6M6 6l12 12"
//               ></path>
//             </svg>
//           </button>
//         )}
//       </div>

//       {/* Form Body with Scrolling */}
//       <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
//             {fields.map((field) => (
//               <div
//                 key={field.name}
//                 className={field.spanFull ? "md:col-span-3" : ""}
//               >
//                 <label
//                   htmlFor={field.name}
//                   className="block text-sm font-medium text-slate-600 mb-1.5"
//                 >
//                   {field.label}
//                   {field.required && (
//                     <span className="text-red-500 ml-1">*</span>
//                   )}
//                 </label>
//                 {renderField(field)}
//               </div>
//             ))}
//           </div>
//         </div>
//       </form>

//       {/* Modal Footer with Centered and Bigger Buttons */}
//       <div className="flex items-center justify-center gap-4 p-6 border-t border-slate-200">
//         {onCancel && (
//           <button
//             type="button"
//             onClick={onCancel}
//             className="py-2.5 px-8 font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
//           >
//             {cancelButtonText}
//           </button>
//         )}
//         <button
//           type="submit"
//           onClick={handleSubmit}
//           className="py-2.5 px-8 font-semibold text-white bg-[#714CDD] rounded-md hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#714CDD] transition-colors shadow-sm"
//         >
//           {submitButtonText}
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- EXAMPLE APP TO DEMONSTRATE THE MODAL FORM ---

// export default function App() {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Define the form structure based on the image
//   const employeeFormFields: FormField[] = [
//     {
//       name: "title",
//       label: "Title",
//       type: "select",
//       required: true,
//       options: [
//         { value: "Mr", label: "Mr." },
//         { value: "Mrs", label: "Mrs." },
//         { value: "Ms", label: "Ms." },
//       ],
//     },
//     {
//       name: "firstName",
//       label: "First Name",
//       type: "text",
//       required: true,
//       placeholder: "Enter first name",
//     },
//     {
//       name: "lastName",
//       label: "Last Name",
//       type: "text",
//       required: true,
//       placeholder: "Enter last name",
//     },
//     {
//       name: "employeeId",
//       label: "Employee ID",
//       type: "text",
//       required: true,
//       placeholder: "Enter employee ID",
//       spanFull: true,
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "select",
//       required: true,
//       spanFull: true,
//       options: [
//         { value: "Active", label: "Active" },
//         { value: "Inactive", label: "Inactive" },
//       ],
//     },
//     {
//       name: "gender",
//       label: "Gender",
//       type: "select",
//       required: true,
//       spanFull: true,
//       options: [
//         { value: "Male", label: "Male" },
//         { value: "Female", label: "Female" },
//         { value: "Other", label: "Other" },
//       ],
//     },
//     {
//       name: "phone",
//       label: "Phone Number",
//       type: "text",
//       required: true,
//       placeholder: "Enter phone number",
//       spanFull: true,
//     },
//     {
//       name: "maritalStatus",
//       label: "Marital Status",
//       type: "select",
//       required: true,
//       spanFull: true,
//       options: [
//         { value: "Single", label: "Single" },
//         { value: "Married", label: "Married" },
//       ],
//     },
//     {
//       name: "email",
//       label: "Email/Primary",
//       type: "email",
//       required: true,
//       placeholder: "Enter primary email",
//       spanFull: true,
//     },
//     {
//       name: "secondaryEmail",
//       label: "Secondary Email",
//       type: "email",
//       placeholder: "Enter secondary email",
//       spanFull: true,
//     },
//     {
//       name: "pan",
//       label: "PAN Number",
//       type: "text",
//       placeholder: "Enter PAN number",
//       spanFull: true,
//     },
//     {
//       name: "aadhar",
//       label: "Aadhar Number",
//       type: "text",
//       placeholder: "Enter Aadhar number",
//       spanFull: true,
//     },
//     {
//       name: "currentAddress",
//       label: "Current Address",
//       type: "textarea",
//       placeholder: "Enter current address",
//       spanFull: true,
//     },
//     {
//       name: "permanentAddress",
//       label: "Permanent Address",
//       type: "textarea",
//       placeholder: "Enter permanent address",
//       spanFull: true,
//     },
//     {
//       name: "totalExperience",
//       label: "Total Experience",
//       type: "text",
//       placeholder: "Enter total experience",
//       spanFull: true,
//     },
//   ];

//   // Set initial state to be empty for a new form
//   const initialEmployeeState = {
//     title: "",
//     firstName: "",
//     lastName: "",
//     employeeId: "",
//     status: "",
//     gender: "",
//     phone: "",
//     maritalStatus: "",
//     email: "",
//     secondaryEmail: "",
//     pan: "",
//     aadhar: "",
//     currentAddress: "",
//     permanentAddress: "",
//     totalExperience: "",
//   };

//   const handleFormSubmit = (data: Record<string, any>) => {
//     console.log("Form Submitted!", data);
//     alert("Form submitted! Check the console for the data.");
//     setIsModalOpen(false); // Close modal on submit
//   };

//   const handleFormCancel = () => {
//     console.log("Form cancelled.");
//     setIsModalOpen(false);
//   };

//   return (
//     <div className="bg-slate-50 min-h-screen w-full flex flex-col items-center justify-center p-4 font-sans ">
//       <h1 className="text-3xl font-bold text-slate-700 mb-8">
//         Employee Management
//       </h1>
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="px-6 py-3 font-semibold text-white bg-[#714CDD] rounded-lg hover:bg-[#5f3dbb] transition-colors shadow-lg"
//       >
//         Add New Employee
//       </button>

//       {/* Modal container */}
//       <div
//         className={`fixed inset-0 z-40 transition-opacity duration-300 ${
//           isModalOpen
//             ? "opacity-50 bg-black/50"
//             : "opacity-0 pointer-events-none"
//         }`}
//       >
//         {/* Overlay */}
//         <div
//           className="absolute inset-0 bg-black/50 bg-opacity-50"
//           onClick={() => setIsModalOpen(false)}
//         ></div>

//         {/* Modal Panel */}
//         <div
//           className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
//             isModalOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <GenericForm
//             title="Employee Information"
//             fields={employeeFormFields}
//             initialState={initialEmployeeState}
//             onSubmit={handleFormSubmit}
//             onCancel={handleFormCancel}
//             submitButtonText="Create"
//             cancelButtonText="Cancel"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
// src/components/common/forms/GenericForm.tsx
import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
} from "react";

// --- TYPE DEFINITIONS ---

export interface FormFieldOption {
  value: string | number;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "textarea"
    | "select"
    | "date"
    | "switch"
    | "password"
    | "email";
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  spanFull?: boolean;
}

export interface GenericFormProps {
  title: string;
  fields: FormField[];
  initialState: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
}

// --- GENERIC FORM COMPONENT (Styled for Modal) ---

const GenericForm: React.FC<GenericFormProps> = ({
  title,
  fields,
  initialState,
  onSubmit,
  onCancel,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialState);

  // Sync state when initialState changes, e.g., when the modal opens with new data
  useEffect(() => {
    setFormData(initialState);
  }, [initialState]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === "checkbox";
    const checkedValue = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox ? checkedValue : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const commonInputClasses =
      "w-full p-2 border border-slate-300 rounded-md bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#714CDD] focus:border-[#714CDD] transition-colors duration-200 ease-in-out";

    const value =
      formData[field.name] ?? (field.type === "switch" ? false : "");

    switch (field.type) {
      case "select":
        return (
          <select
            id={field.name}
            name={field.name}
            value={value}
            onChange={handleChange}
            required={field.required}
            className={commonInputClasses}
          >
            <option value="" disabled>
              Please Select
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "textarea":
        return (
          <textarea
            id={field.name}
            name={field.name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            rows={3}
            className={commonInputClasses}
          />
        );
      // Other cases remain the same...
      default:
        return (
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className={commonInputClasses}
          />
        );
    }
  };

  return (
    // The form is now designed to fit within a modal container
    <div className="bg-white h-full flex flex-col  ">
      {/* Modal Header with Centered Title */}
      <div className="relative flex justify-center items-center p-6 border-b border-slate-200 ">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute right-6 text-slate-400 hover:text-slate-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        )}
      </div>

      {/* Form Body with Scrolling */}
      <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.spanFull ? "md:col-span-3" : ""}
              >
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-slate-600 mb-1.5"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* Modal Footer with Centered and Bigger Buttons */}
      <div className="flex items-center justify-center gap-4 p-6 border-t border-slate-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-8 font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
          >
            {cancelButtonText}
          </button>
        )}
        <button
          type="submit"
          onClick={handleSubmit}
          className="py-2.5 px-8 font-semibold text-white bg-[#714CDD] rounded-md hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#714CDD] transition-colors shadow-sm"
        >
          {submitButtonText}
        </button>
      </div>
    </div>
  );
};

export default GenericForm;