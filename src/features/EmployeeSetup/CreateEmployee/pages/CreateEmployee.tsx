// import React, { useState } from 'react';
// import { Calendar, ChevronDown } from 'lucide-react';

// // 🔧 Mock dropdown options (you can fetch these from API later)
// const dropdownOptions = {
//   title: ['MR', 'MRS', 'MS'],
//   gender: ['Male', 'Female', 'Other'],
//   department: ['Engineering', 'Human Resources', 'Sales', 'Marketing', 'Designing', 'Development', 'Management'],
//   designation: ['Software Engineer', 'HR Manager', 'Sales Executive', 'Marketing Lead', 'UI/UX Designer', 'Project Manager'],
//   role: ['Admin', 'Manager', 'Employee'],
//   leaveType: ['Standard', 'Enhanced', 'Custom'],
//   reportingManager: ['Kushal Singh (1001)', 'Rohit Sharma (1002)', 'Jane Doe (1003)'],
//   location: ['Noida', 'New York', 'London', 'Tokyo', 'Jaipur'],
//   payslipComponent: ['Default', 'Group 1', 'Executive'],
//   workingPattern: ['5-day week', '6-day week', 'Flexible'],
//   holidayGroup: ['National Holidays', 'Regional Holidays']
// };

// // 🔤 Input Field Type
// type InputFieldProps = {
//   label: string;
//   type?: string;
//   placeholder?: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   name: string;
//   required?: boolean;
//   className?: string;
//   disabled?: boolean;
// };

// // 🧩 Input Component
// const InputField: React.FC<InputFieldProps> = ({
//   label,
//   type = 'text',
//   placeholder,
//   value,
//   onChange,
//   name,
//   required = true,
//   className = '',
//   disabled = false
// }) => (
//   <div className="flex flex-col space-y-1">
//     <label htmlFor={name} className="text-sm font-medium text-gray-700">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <input
//       id={name}
//       name={name}
//       type={type}
//       placeholder={placeholder || `Enter ${label.toLowerCase()}`}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       className={`w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent ${className}`}
//     />
//   </div>
// );

// // 🧩 Select Component Type
// type SelectFieldProps = {
//   label: string;
//   options: string[];
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   name: string;
//   required?: boolean;
//   optional?: boolean;
// };

// // 🧩 Select Component
// const SelectField: React.FC<SelectFieldProps> = ({
//   label,
//   options,
//   value,
//   onChange,
//   name,
//   required = true,
//   optional = false,
// }) => (
//   <div className="flex flex-col space-y-1">
//     <label htmlFor={name} className="text-sm font-medium text-gray-700">
//       {label} {required && <span className="text-red-500">*</span>} {optional && <span className="text-gray-400">(Optional)</span>}
//     </label>
//     <div className="relative">
//       <select
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent"
//       >
//         <option value="" disabled>Please Select</option>
//         {options.map(option => (
//           <option key={option} value={option}>{option}</option>
//         ))}
//       </select>
//       <ChevronDown className="absolute w-5 h-5 text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//     </div>
//   </div>
// );

// // 📅 Date Field Props
// type DateFieldProps = {
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   name: string;
//   required?: boolean;
// };

// // 📅 Date Field Component
// const DateField: React.FC<DateFieldProps> = ({ label, value, onChange, name, required = true }) => (
//   <div className="flex flex-col space-y-1">
//     <label htmlFor={name} className="text-sm font-medium text-gray-700">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     <div className="relative">
//       <input
//         id={name}
//         name={name}
//         type="date"
//         value={value}
//         onChange={onChange}
//         className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent appearance-none"
//         style={{ colorScheme: 'light' }}
//       />
//       <Calendar className="absolute w-5 h-5 text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
//     </div>
//   </div>
// );

// const CreateEmployeeForm: React.FC = () => {
//   const [formData, setFormData] = useState({
//     title: 'MR',
//     firstName: '',
//     lastName: '',
//     email: '',
//     gender: '',
//     joiningDate: new Date().toISOString().split('T')[0],
//     department: '',
//     designation: '',
//     role: '',
//     ctc: '',
//     phone: '',
//     leaveType: '',
//     reportingManager: 'Kushal Singh (1001)',
//     location: '',
//     payslipComponent: '',
//     workingPattern: '',
//     holidayGroup: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log('Form Data:', formData);
//     alert('Submitted!');
//   };

//   const handleCancel = () => {
//     setFormData({
//       title: 'MR',
//       firstName: '',
//       lastName: '',
//       email: '',
//       gender: '',
//       joiningDate: new Date().toISOString().split('T')[0],
//       department: '',
//       designation: '',
//       role: '',
//       ctc: '',
//       phone: '',
//       leaveType: '',
//       reportingManager: 'Kushal Singh (1001)',
//       location: '',
//       payslipComponent: '',
//       workingPattern: '',
//       holidayGroup: '',
//     });
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-6">
//           <h1 className="text-xl font-semibold text-gray-800">Create Employee</h1>
//           <div className="text-sm text-gray-500 space-x-1">
//             <a href="#" className="text-[#BA2BE2] hover:underline">Dashboard</a>
//             <span>/</span>
//             <a href="#" className="text-[#BA2BE2] hover:underline">Employee Setup</a>
//             <span>/</span>
//             <span className="text-gray-500">Create</span>
//           </div>
//         </header>

//         <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
//           <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-6">Employee Information</h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
//               <SelectField label="Title" name="title" options={dropdownOptions.title} value={formData.title} onChange={handleChange} />
//               <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
//               <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />

//               <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
//               <SelectField label="Gender" name="gender" options={dropdownOptions.gender} value={formData.gender} onChange={handleChange} />
//               <DateField label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />

//               <SelectField label="Department" name="department" options={dropdownOptions.department} value={formData.department} onChange={handleChange} />
//               <SelectField label="Designation" name="designation" options={dropdownOptions.designation} value={formData.designation} onChange={handleChange} />
//               <SelectField label="Role" name="role" options={dropdownOptions.role} value={formData.role} onChange={handleChange} />

//               <InputField label="CTC (Annual)" name="ctc" type="number" value={formData.ctc} onChange={handleChange} />
//               <InputField label="Phone number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
//               <SelectField label="Leave Type" name="leaveType" options={dropdownOptions.leaveType} value={formData.leaveType} onChange={handleChange} />

//               <SelectField label="Reporting Manager" name="reportingManager" options={dropdownOptions.reportingManager} value={formData.reportingManager} onChange={handleChange} />
//               <SelectField label="Location" name="location" options={dropdownOptions.location} value={formData.location} onChange={handleChange} />
//               <SelectField label="Payslip Component" name="payslipComponent" options={dropdownOptions.payslipComponent} value={formData.payslipComponent} onChange={handleChange} />

//               <SelectField label="Working Pattern" name="workingPattern" options={dropdownOptions.workingPattern} value={formData.workingPattern} onChange={handleChange} />
//               <SelectField label="Holiday Group" name="holidayGroup" options={dropdownOptions.holidayGroup} value={formData.holidayGroup} onChange={handleChange} optional={true} required={false} />
//             </div>

//             <div className="flex justify-end items-center pt-6 mt-6 border-t border-gray-200 space-x-4">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-8 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
//               >
//                 CANCEL
//               </button>
//               <button
//                 type="submit"
//                 className="px-8 py-2.5 text-sm font-semibold text-white bg-[#BA2BE2] rounded-lg shadow-md hover:bg-[#a71ad9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BA2BE2] transition-colors"
//               >
//                 SUBMIT
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateEmployeeForm;

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchDepartments } from '../../../../store/slice/departmentSlice';
import { fetchEmployeeDesignations, resetEmployeeDesignations } from '../../../../store/slice/employeeDesignationSlice';
import { type RootState } from '../../../../store/store';
import axios from 'axios';

//  API URL for employee creation
const EMPLOYEE_API_URL = 'http://172.50.5.49:3000/employees';

// Mock dropdown options (excluding department and designation)
const dropdownOptions = {
  title: ['MR', 'MRS', 'MS'],
  gender: ['Male', 'Female', 'Other'],
  role: ['Admin', 'Manager', 'Employee'],
  leaveType: ['Standard', 'Enhanced', 'Custom'],
  reportingManager: ['Kushal Singh (1001)', 'Rohit Sharma (1002)', 'Jane Doe (1003)'],
  location: ['Noida', 'New York', 'London', 'Tokyo', 'Jaipur'],
  payslipComponent: ['Default', 'Group 1', 'Executive'],
  workingPattern: ['5-day week', '6-day week', 'Flexible'],
  holidayGroup: ['National Holidays', 'Regional Holidays']
};

//  Input Field Type
type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
};

// Input Component
const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  required = true,
  className = '',
  disabled = false
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent ${className}`}
    />
  </div>
);

// 🧩 Select Component Type
type SelectFieldProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
};

// 🧩 Select Component
const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  value,
  onChange,
  name,
  required = true,
  optional = false,
  disabled = false,
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>} {optional && <span className="text-gray-400">(Optional)</span>}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent"
      >
        <option value="" disabled>Please Select</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute w-5 h-5 text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  </div>
);

// 📅 Date Field Props
type DateFieldProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
};

// 📅 Date Field Component
const DateField: React.FC<DateFieldProps> = ({ label, value, onChange, name, required = true }) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        type="date"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent appearance-none"
        style={{ colorScheme: 'light' }}
      />
      <Calendar className="absolute w-5 h-5 text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  </div>
);

// 🧩 Form Data Type
interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  joiningDate: string;
  department: string;
  designation: string;
  role: string;
  ctc: string;
  phone: string;
  leaveType: string;
  reportingManager: string;
  location: string;
  payslipComponent: string;
  workingPattern: string;
  holidayGroup: string;
}

const CreateEmployeeForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state: RootState) => state.auth.token);
  const departments = useAppSelector((state: RootState) => state.departments.items);
  const departmentStatus = useAppSelector((state: RootState) => state.departments.status);
  const designations = useAppSelector((state: RootState) => state.employeeDesignations.items);
  const designationStatus = useAppSelector((state: RootState) => state.employeeDesignations.status);
  const [formData, setFormData] = useState<FormData>({
    title: 'MR',
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    joiningDate: new Date().toISOString().split('T')[0],
    department: '',
    designation: '',
    role: '',
    ctc: '',
    phone: '',
    leaveType: '',
    reportingManager: 'Kushal Singh (1001)',
    location: '',
    payslipComponent: '',
    workingPattern: '',
    holidayGroup: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch departments on component mount
  useEffect(() => {
    if (departmentStatus === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [departmentStatus, dispatch]);

  // Fetch designations when department changes
  useEffect(() => {
    if (formData.department) {
      dispatch(fetchEmployeeDesignations(formData.department));
    } else {
      dispatch(resetEmployeeDesignations());
    }
  }, [formData.department, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Reset designation when department changes
    if (name === 'department') {
      setFormData(prev => ({ ...prev, designation: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication token is missing. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(EMPLOYEE_API_URL, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Employee Created:', response.data);
      alert('Employee created successfully!');
      handleCancel(); // Reset form on success
    } catch (err) {
      console.error('Error creating employee:', err);
      setError('Failed to create employee. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: 'MR',
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      joiningDate: new Date().toISOString().split('T')[0],
      department: '',
      designation: '',
      role: '',
      ctc: '',
      phone: '',
      leaveType: '',
      reportingManager: 'Kushal Singh (1001)',
      location: '',
      payslipComponent: '',
      workingPattern: '',
      holidayGroup: '',
    });
    setError(null);
    dispatch(resetEmployeeDesignations());
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Create Employee</h1>
          <div className="text-sm text-gray-500 space-x-1">
            <a href="#" className="text-[#BA2BE2] hover:underline">Dashboard</a>
            <span>/</span>
            <a href="#" className="text-[#BA2BE2] hover:underline">Employee Setup</a>
            <span>/</span>
            <span className="text-gray-500">Create</span>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-6">Employee Information</h2>
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              <SelectField
                label="Title"
                name="title"
                options={dropdownOptions.title}
                value={formData.title}
                onChange={handleChange}
              />
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />

              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <SelectField
                label="Gender"
                name="gender"
                options={dropdownOptions.gender}
                value={formData.gender}
                onChange={handleChange}
              />
              <DateField
                label="Joining Date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />

              <SelectField
                label="Department"
                name="department"
                options={departments.map(dep => dep.name)}
                value={formData.department}
                onChange={handleChange}
                disabled={departmentStatus === 'loading'}
              />
              <SelectField
                label="Designation"
                name="designation"
                options={designations.map(des => des.name)}
                value={formData.designation}
                onChange={handleChange}
                disabled={designationStatus === 'loading' || !formData.department}
              />
              <SelectField
                label="Role"
                name="role"
                options={dropdownOptions.role}
                value={formData.role}
                onChange={handleChange}
              />

              <InputField
                label="CTC (Annual)"
                name="ctc"
                type="number"
                value={formData.ctc}
                onChange={handleChange}
              />
              <InputField
                label="Phone number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
              <SelectField
                label="Leave Type"
                name="leaveType"
                options={dropdownOptions.leaveType}
                value={formData.leaveType}
                onChange={handleChange}
              />

              <SelectField
                label="Reporting Manager"
                name="reportingManager"
                options={dropdownOptions.reportingManager}
                value={formData.reportingManager}
                onChange={handleChange}
              />
              <SelectField
                label="Location"
                name="location"
                options={dropdownOptions.location}
                value={formData.location}
                onChange={handleChange}
              />
              <SelectField
                label="Payslip Component"
                name="payslipComponent"
                options={dropdownOptions.payslipComponent}
                value={formData.payslipComponent}
                onChange={handleChange}
              />

              <SelectField
                label="Working Pattern"
                name="workingPattern"
                options={dropdownOptions.workingPattern}
                value={formData.workingPattern}
                onChange={handleChange}
              />
              <SelectField
                label="Holiday Group"
                name="holidayGroup"
                options={dropdownOptions.holidayGroup}
                value={formData.holidayGroup}
                onChange={handleChange}
                optional={true}
                required={false}
              />
            </div>

            <div className="flex justify-end items-center pt-6 mt-6 border-t border-gray-200 space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                disabled={isSubmitting}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 text-sm font-semibold text-white bg-[#BA2BE2] rounded-lg shadow-md hover:bg-[#a71ad9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BA2BE2] transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeForm;