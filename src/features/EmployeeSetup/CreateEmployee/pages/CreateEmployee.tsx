import React, { useState, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchDepartments } from "../../../../store/slice/departmentSlice";
import {
  fetchEmployeeDesignations,
  resetEmployeeDesignations,
} from "../../../../store/slice/employeeDesignationSlice";
import { fetchLeaveSetups } from "../../../../store/slice/leaveSetupSlice";
import { fetchLocations } from "../../../../store/slice/locationSlice";
import { fetchSalaryStructures } from "../../../../store/slice/salaryStructureSlice";
import { fetchWorkingPatterns } from "../../../../store/slice/workingPatternsSlice";
import { fetchHolidayConfigurations } from "../../../../store/slice/holidayconfigurationSlice";
import {
  createEmployee,
  resetCreateState,
} from "../../../../store/slice/createEmployeeSlice";
import { fetchRoles } from "../../../../store/slice/roleSlice";
import { type NewEmployee } from "../../../../types/index";
import { type RootState } from "../../../../store/store";
import toast from "react-hot-toast";
import { employeeSchema, type FormData } from "../../../../utils/employeeSchema"; // --- 1. IMPORT ZOD SCHEMA ---

// Static mock dropdown options
const staticDropdownOptions = {
  title: ["MR", "MRS", "MS"],
  gender: ["Male", "Female", "Other"],
  reportingManager: [
    "Kushal Singh (1001)",
    "Rohit Sharma (1002)",
    "Jane Doe (1003)",
  ],
};

// --- ERROR TYPE DEFINITION ---
type FormErrors = Partial<Record<keyof FormData, string>>;

// --- REUSABLE FORM COMPONENTS (UNCHANGED) ---

type InputFieldProps = {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string;
  placeholder?: string; required?: boolean; className?: string;
  disabled?: boolean; error?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label, name, value, onChange, type = "text", placeholder,
  required = true, className = "", disabled = false, error,
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input id={name} name={name} type={type}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      value={value} onChange={onChange} disabled={disabled}
      className={`w-full px-3 py-2 text-sm bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
        error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#BA2BE2]"
      } ${className}`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

type SelectFieldProps = {
  label: string; name: string; value: string; options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean; optional?: boolean; disabled?: boolean; error?: string;
};

const SelectField: React.FC<SelectFieldProps> = ({
  label, name, value, options, onChange, required = true,
  optional = false, disabled = false, error,
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}{" "}
      {optional && <span className="text-gray-400">(Optional)</span>}
    </label>
    <div className="relative">
      <select id={name} name={name} value={value} onChange={onChange} disabled={disabled}
        className={`w-full px-3 py-2 text-sm text-gray-700 bg-white border rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:border-transparent ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#BA2BE2]"
        }`}
      >
        <option value="" disabled>Please Select</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="absolute w-5 h-5 text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

type DateFieldProps = {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; error?: string;
};

const DateField: React.FC<DateFieldProps> = ({
  label, name, value, onChange, required = true, error,
}) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input id={name} name={name} type="date" value={value} onChange={onChange}
        className={`w-full px-3 py-2 text-sm bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent appearance-none ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-[#BA2BE2]"
        }`}
        style={{ colorScheme: "light" }}
      />
      <Calendar className="absolute w-5 h-5 text-gray-400 right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);


// --- MAIN CREATE EMPLOYEE FORM COMPONENT ---
const CreateEmployeeForm: React.FC = () => {
  const dispatch = useAppDispatch();

  // --- SELECTORS (UNCHANGED) ---
  const departments = useAppSelector(state => state.departments.items);
  const designations = useAppSelector(state => state.employeeDesignations.items);
  const leaveSetups = useAppSelector(state => state.leaveSetups.items);
  const locations = useAppSelector(state => state.locations.items);
  const salaryStructures = useAppSelector(state => state.salaryStructures.data);
  const workingPatterns = useAppSelector(state => state.workingPatterns.items);
  const holidayConfigurations = useAppSelector(state => state.holidayConfigurations.items);
  const roles = useAppSelector(state => state.roles.items);
  const { createStatus, createError } = useAppSelector(state => state.createEmployee);
  const departmentStatus = useAppSelector(state => state.departments.status);
  const designationStatus = useAppSelector(state => state.employeeDesignations.status);
  const leaveSetupsStatus = useAppSelector(state => state.leaveSetups.status);
  const locationsStatus = useAppSelector(state => state.locations.status);
  const salaryStructuresStatus = useAppSelector(state => state.salaryStructures.status);
  const workingPatternsStatus = useAppSelector(state => state.workingPatterns.status);
  const holidayConfigurationsStatus = useAppSelector(state => state.holidayConfigurations.status);
  const rolesStatus = useAppSelector(state => state.roles.status);

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState<FormData>({
    title: "MR", firstName: "", lastName: "", email: "", gender: "",
    joiningDate: new Date().toISOString().split("T")[0],
    department: "", designation: "", role: "", ctc: "", phone: "",
    leaveType: "", reportingManager: "Kushal Singh (1001)",
    location: "", payslipComponent: "", workingPattern: "", holidayGroup: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [toastId, setToastId] = useState<string | null>(null);

  // --- EFFECTS (UNCHANGED) ---
  useEffect(() => {
    if (departmentStatus === "idle") dispatch(fetchDepartments());
    if (leaveSetupsStatus === "idle") dispatch(fetchLeaveSetups());
    if (locationsStatus === "idle") dispatch(fetchLocations());
    if (salaryStructuresStatus === "idle") dispatch(fetchSalaryStructures());
    if (workingPatternsStatus === "idle") dispatch(fetchWorkingPatterns());
    if (holidayConfigurationsStatus === "idle") dispatch(fetchHolidayConfigurations());
    if (rolesStatus === "idle") dispatch(fetchRoles());
  }, [ /* dependencies */ ]);

  useEffect(() => {
    if (formData.department) {
      dispatch(fetchEmployeeDesignations(formData.department));
    } else {
      dispatch(resetEmployeeDesignations());
    }
  }, [formData.department, dispatch]);

  useEffect(() => {
    if (createStatus === "succeeded") {
      toast.success("Employee created successfully!", { id: toastId });
      handleCancel();
      dispatch(resetCreateState());
      setToastId(null);
    }
  }, [createStatus, dispatch, toastId]);

  useEffect(() => {
    if (createStatus === "failed" && createError) {
      toast.error(createError, { id: toastId });
      setToastId(null);
    }
  }, [createStatus, createError, toastId]);

  // --- EVENT HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }

    if (name === "department") {
      setFormData((prev) => ({ ...prev, designation: "" }));
      if (errors.designation) {
        setErrors((prev) => ({ ...prev, designation: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createStatus === "loading") return;

    // --- 2. VALIDATE WITH ZOD'S SAFEPARSE ---
    const result = employeeSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: FormErrors = {};
      // Flatten Zod errors to a simple key-value object
      for (const [key, value] of Object.entries(result.error.flatten().fieldErrors)) {
        if (value) formattedErrors[key as keyof FormData] = value[0];
      }
      setErrors(formattedErrors);
      toast.error("Please fill all required fields correctly.", {
        className: "bg-red-50 text-red-800",
      });
      return;
    }

    const id = toast.loading("Creating employee...", { className: "bg-gray-50 text-gray-800" });
    setToastId(id);

    // --- 3. DISPATCH VALIDATED DATA ---
    dispatch(createEmployee(result.data));
  };

  const handleCancel = () => {
    setFormData({
      title: "MR", firstName: "", lastName: "", email: "", gender: "",
      joiningDate: new Date().toISOString().split("T")[0],
      department: "", designation: "", role: "", ctc: "", phone: "",
      leaveType: "", reportingManager: "Kushal Singh (1001)",
      location: "", payslipComponent: "", workingPattern: "", holidayGroup: "",
    });
    setErrors({});
    dispatch(resetEmployeeDesignations());
    dispatch(resetCreateState());
  };

  // --- DROPDOWN OPTIONS (UNCHANGED) ---
  const getLeaveTypeOptions = () => leaveSetups.map((leave) => leave.name);
  const getLocationOptions = () => locations.map((loc) => loc.city);
  const getPayslipComponentOptions = () => salaryStructures.map((salary) => salary.groupName);
  const getWorkingPatternOptions = () => workingPatterns.map((pattern) => pattern.name);
  const getHolidayGroupOptions = () => holidayConfigurations.map((config) => config.name);

  // --- RENDER (UNCHANGED) ---
  return (
    <div className="bg-gray-50 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Create Employee</h1>
          {/* Breadcrumbs */}
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-6">
            Employee Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {/* All InputField, SelectField, and DateField components now receive their 'error' prop */}
              <SelectField label="Title" name="title" options={staticDropdownOptions.title} value={formData.title} onChange={handleChange} />
              <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
              <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
              <InputField label="Email" name="email" type="text" value={formData.email} onChange={handleChange} error={errors.email} />
              <SelectField label="Gender" name="gender" options={staticDropdownOptions.gender} value={formData.gender} onChange={handleChange} error={errors.gender} />
              <DateField label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} error={errors.joiningDate} />
              <SelectField label="Department" name="department" options={departments.map((dep) => dep.name)} value={formData.department} onChange={handleChange} disabled={departmentStatus === "loading"} error={errors.department} />
              <SelectField label="Designation" name="designation" options={designations.filter((des) => des.status === "active").map((des) => des.designationName)} value={formData.designation} onChange={handleChange} disabled={designationStatus === "loading" || !formData.department} error={errors.designation} />
              <SelectField label="Role" name="role" options={roles.filter((role) => role.status === "Active").map((role) => role.name)} value={formData.role} onChange={handleChange} disabled={rolesStatus === "loading"} error={errors.role} />
              <InputField label="CTC (Annual)" name="ctc" type="text" value={formData.ctc} onChange={handleChange} error={errors.ctc} />
              <InputField label="Phone number" name="phone" type="tel" value={formData.phone} onChange={handleChange} error={errors.phone} />
              <SelectField label="Leave Type" name="leaveType" options={getLeaveTypeOptions()} value={formData.leaveType} onChange={handleChange} disabled={leaveSetupsStatus === "loading"} error={errors.leaveType} />
              <SelectField label="Reporting Manager" name="reportingManager" options={staticDropdownOptions.reportingManager} value={formData.reportingManager} onChange={handleChange} />
              <SelectField label="Location" name="location" options={getLocationOptions()} value={formData.location} onChange={handleChange} disabled={locationsStatus === "loading"} error={errors.location} />
              <SelectField label="Payslip Component" name="payslipComponent" options={getPayslipComponentOptions()} value={formData.payslipComponent} onChange={handleChange} disabled={salaryStructuresStatus === "loading"} error={errors.payslipComponent} />
              <SelectField label="Working Pattern" name="workingPattern" options={getWorkingPatternOptions()} value={formData.workingPattern} onChange={handleChange} disabled={workingPatternsStatus === "loading"} error={errors.workingPattern} />
              <SelectField label="Holiday Group" name="holidayGroup" options={getHolidayGroupOptions()} value={formData.holidayGroup} onChange={handleChange} optional={true} required={false} disabled={holidayConfigurationsStatus === "loading"} />
            </div>

            <div className="flex justify-end items-center pt-6 mt-6 border-t border-gray-200 space-x-4">
              <button type="button" onClick={handleCancel} className="px-8 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none" disabled={createStatus === "loading"}>
                CANCEL
              </button>
              <button type="submit" className="px-8 py-2.5 text-sm font-semibold text-white bg-[#BA2BE2] rounded-lg shadow-md hover:bg-[#a71ad9] focus:outline-none disabled:opacity-50" disabled={createStatus === "loading"}>
                {createStatus === "loading" ? "SUBMITTING..." : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeForm;