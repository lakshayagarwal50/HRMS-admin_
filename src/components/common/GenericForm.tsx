// import React, {
//   useState,
//   type ChangeEvent,
//   type FormEvent,
//   useEffect,
//   useRef,
//   forwardRef,
//   useImperativeHandle,
// } from "react";

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

// const GenericForm = forwardRef<{ handleSubmit: () => void }, GenericFormProps>(
//   (
//     {
//       title,
//       fields,
//       initialState,
//       onSubmit,
//       onCancel,
//       submitButtonText = "Submit",
//       cancelButtonText = "Cancel",
//     },
//     ref
//   ) => {
//     const [formData, setFormData] = useState<Record<string, any>>(initialState);
//     const formEl = useRef<HTMLFormElement>(null);

//     useEffect(() => {
//       setFormData(initialState);
//     }, [initialState]);

//     useImperativeHandle(ref, () => ({
//       handleSubmit: () => {
//         formEl.current?.requestSubmit();
//       },
//     }));

//     const handleChange = (
//       e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//     ) => {
//       const { name, value, type } = e.target;
//       const isCheckbox = type === "checkbox";

//       const checkedValue = (e.target as HTMLInputElement).checked;

//       setFormData((prev) => ({
//         ...prev,
//         [name]: isCheckbox ? checkedValue : value,
//       }));
//     };

//     const handleFormSubmit = (e: FormEvent) => {
//       e.preventDefault();
//       onSubmit(formData);
//     };

//     const renderField = (field: FormField) => {
//       const commonInputClasses =
//         "w-full p-2 border border-slate-300 rounded-md bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#714CDD] focus:border-[#714CDD] transition-colors duration-200 ease-in-out";

//       const value =
//         formData[field.name] ?? (field.type === "switch" ? false : "");

//       switch (field.type) {
//         case "select":
//           return (
//             <select
//               id={field.name}
//               name={field.name}
//               value={value}
//               onChange={handleChange}
//               required={field.required}
//               className={commonInputClasses}
//             >
//               <option value="" disabled>
//                 Please Select
//               </option>
//               {field.options?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           );
//         case "textarea":
//           return (
//             <textarea
//               id={field.name}
//               name={field.name}
//               value={value}
//               onChange={handleChange}
//               placeholder={field.placeholder}
//               required={field.required}
//               rows={3}
//               className={commonInputClasses}
//             />
//           );
//         case "switch":
//           return (
//             <label
//               htmlFor={field.name}
//               className="relative inline-flex items-center cursor-pointer"
//             >
//               <input
//                 type="checkbox"
//                 id={field.name}
//                 name={field.name}
//                 checked={!!value}
//                 onChange={handleChange}
//                 className="sr-only peer"
//               />
//               <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#714CDD]"></div>
//             </label>
//           );
//         default:
//           return (
//             <input
//               id={field.name}
//               name={field.name}
//               type={field.type}
//               value={value}
//               onChange={handleChange}
//               placeholder={field.placeholder}
//               required={field.required}
//               className={commonInputClasses}
//             />
//           );
//       }
//     };

//     return (
//       <div className="bg-white h-full flex flex-col">
//         {/* Header */}
//         <header className="relative flex justify-center items-center p-6 border-b border-slate-200">
//           <h2 className="text-xl font-bold text-slate-800">{title}</h2>
//           {onCancel && (
//             <button
//               onClick={onCancel}
//               className="absolute right-6 text-slate-400 hover:text-slate-600"
//             >
//               X
//             </button>
//           )}
//         </header>

//         <form
//           ref={formEl}
//           onSubmit={handleFormSubmit}
//           className="flex-grow overflow-y-auto p-6"
//         >
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
//         </form>

//         {/* Footer */}
//         <footer className="flex items-center justify-center gap-4 p-6 border-t border-slate-200">
//           {onCancel && (
//             <button
//               type="button"
//               onClick={onCancel}
//               className="py-2.5 px-8 font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
//             >
//               {cancelButtonText}
//             </button>
//           )}

//           <button
//             type="submit"
//             form={formEl.current?.id}
//             onClick={() => formEl.current?.requestSubmit()}
//             className="py-2.5 px-8 font-semibold text-white bg-[#714CDD] rounded-md hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#714CDD] transition-colors shadow-sm"
//           >
//             {submitButtonText}
//           </button>
//         </footer>
//       </div>
//     );
//   }
// );

// export default GenericForm;

// ⬇️ REPLACE the entire content of GenericForm.tsx with this updated code ⬇️
import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

export interface FormFieldOption {
  value: string | number | boolean;
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
  disabled?: boolean;
  validation?: (value: any) => string | null;
  allowedChars?: "alpha-space" | "numeric" | "alphanumeric";
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

const GenericForm = forwardRef<{ handleSubmit: () => void }, GenericFormProps>(
  (
    {
      title,
      fields,
      initialState,
      onSubmit,
      onCancel,
      submitButtonText = "Submit",
      cancelButtonText = "Cancel",
    },
    ref
  ) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialState);
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const formEl = useRef<HTMLFormElement>(null);

    useEffect(() => {
      setFormData(initialState);
    }, [initialState]);

    useImperativeHandle(ref, () => ({
      handleSubmit: () => {
        formEl.current?.requestSubmit();
      },
    }));

    const validateField = (name: string, value: any): string | null => {
      const field = fields.find((f) => f.name === name);
      if (!field) return null;

      // First, check if a required field is empty.
      if (field.required && (!value || String(value).trim() === "")) {
        return `${field.label} is required.`;
      }

      // If a validation function exists, ALWAYS run it.
      // It is the validation function's job to handle its own logic.
      if (field.validation) {
        return field.validation(value);
      }

      return null;
    };
    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value, type } = e.target;
      const field = fields.find((f) => f.name === name);

      // Handle switches/checkboxes separately
      if (type === "checkbox") {
        const checkedValue = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({ ...prev, [name]: checkedValue }));
        setErrors((prev) => ({ ...prev, [name]: null })); // Clear errors on toggle
        return;
      }

      // Filter input based on allowed characters
      if (field?.allowedChars) {
        let regex: RegExp;
        if (field.allowedChars === "numeric") {
          regex = /^\d*$/;
        } else if (field.allowedChars === "alphanumeric") {
          regex = /^[a-zA-Z0-9]*$/;
        } else {
          // 'alpha-space'
          regex = /^[A-Za-z\s]*$/;
        }

        if (!regex.test(value)) {
          // If an invalid character is typed, simply ignore it and exit.
          return;
        }
      }

      // For any valid input change, update the form data
      setFormData((prev) => ({ ...prev, [name]: value }));

      // And then run validation to give the user real-time feedback
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    };
    const validateForm = (): boolean => {
      const newErrors: Record<string, string | null> = {};
      let isValid = true;
      fields.forEach((field) => {
        const error = validateField(field.name, formData[field.name]);
        if (error) {
          isValid = false;
        }
        newErrors[field.name] = error;
      });
      setErrors(newErrors);
      return isValid;
    };

    const handleFormSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        onSubmit(formData);
      }
    };

    const renderField = (field: FormField) => {
      const fieldError = errors[field.name];
      const commonInputClasses =
        "w-full p-2 border rounded-md bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#714CDD] focus:border-[#714CDD] transition-colors duration-200 ease-in-out";
      const disabledClasses =
        "disabled:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-500";
      const errorClasses = fieldError ? "border-red-500" : "border-slate-300";
      const combinedClasses = `${commonInputClasses} ${disabledClasses} ${errorClasses}`;

      const value =
        formData[field.name] ?? (field.type === "switch" ? false : "");

      let inputElement;

      switch (field.type) {
        case "select":
          inputElement = (
            <select
              id={field.name}
              name={field.name}
              value={value}
              onChange={handleChange}
              required={field.required}
              disabled={field.disabled}
              className={combinedClasses}
            >
              <option value="" disabled>
                Please Select
              </option>
              {field.options?.map((option) => (
                <option key={String(option.value)} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
          break;
        case "textarea":
          inputElement = (
            <textarea
              id={field.name}
              name={field.name}
              value={value}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              rows={3}
              disabled={field.disabled}
              className={combinedClasses}
            />
          );
          break;
        case "switch":
          inputElement = (
            <label
              htmlFor={field.name}
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id={field.name}
                name={field.name}
                checked={!!value}
                onChange={handleChange}
                disabled={field.disabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#714CDD] peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
            </label>
          );
          break;
        default:
          inputElement = (
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              value={value}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              disabled={field.disabled}
              className={combinedClasses}
            />
          );
      }

      return (
        <>
          {inputElement}
          {fieldError && (
            <p className="mt-1 text-sm text-red-600">{fieldError}</p>
          )}
        </>
      );
    };

    return (
      <div className="bg-white h-full flex flex-col">
        {/* Header */}
        <header className="relative flex justify-center items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="absolute right-6 text-slate-400 hover:text-slate-600"
              aria-label="Close"
            >
              X
            </button>
          )}
        </header>

        {/* Form */}
        <form
          ref={formEl}
          onSubmit={handleFormSubmit}
          className="flex-grow overflow-y-auto p-6"
          noValidate
        >
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
        </form>

        {/* Footer */}
        <footer className="flex items-center justify-center gap-4 p-6 border-t border-slate-200">
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
            onClick={() => formEl.current?.requestSubmit()}
            className="py-2.5 px-8 font-semibold text-white bg-[#714CDD] rounded-md hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#714CDD] transition-colors shadow-sm"
          >
            {submitButtonText}
          </button>
        </footer>
      </div>
    );
  }
);

export default GenericForm;
