import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// --- REDUX & TYPE IMPORTS ---
import type { AppDispatch, RootState } from "../../../../store/store";
import {
  fetchEmployeeDetails,
  type EmployeeDetail,
} from "../../../../store/slice/employeeSlice";
import {
  addBankDetails,
  updateBankDetails,
} from "../../../../store/slice/bankSlice";
import { updateGeneralInfo } from "../../../../store/slice/generalSlice";
import { updateProfessionalInfo } from "../../../../store/slice/professionalSlice";

// --- COMPONENT IMPORTS ---
import ProfileSidebar, { menuItems } from "../layout/ProfileSidebar";

// --- TYPE DEFINITIONS ---
export interface FormFieldOption {
  value: string | number;
  label: string;
}
export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "date" | "email";
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOption[];
  spanFull?: boolean;
}
interface GenericFormProps {
  fields: FormField[];
  initialState: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
}

// --- REUSABLE UI COMPONENTS ---
const SectionHeader: React.FC<{
  title: string;
  action?: React.ReactNode;
}> = ({ title, action }) => (
  <div className="flex justify-between items-center pb-4">
    <h3 className="text-lg font-semibold text-[#741CDD]">{title}</h3>
    {action}
  </div>
);

const DetailItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "--"}</p>
  </div>
);

const EditButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
    Edit
  </button>
);

const AddButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-sm text-white bg-[#741CDD] hover:bg-[#5f3dbb] transition-colors px-3 py-1.5 rounded-md font-semibold"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    Add
  </button>
);

const PlaceholderComponent: React.FC<{ title: string; onEdit: () => void }> = ({
  title,
  onEdit,
}) => (
  <div>
    <SectionHeader title={title} action={<EditButton onClick={onEdit} />} />
    <div className="bg-gray-50 p-6 rounded-lg border border-dashed text-center text-gray-500">
      <p>Content for {title} will be displayed here.</p>
    </div>
  </div>
);

// --- PAGE-SPECIFIC SECTION COMPONENTS ---
const GeneralInfo: React.FC<{ data: EmployeeDetail; onEdit: () => void }> = ({
  data,
  onEdit,
}) => {
  const { general } = data;
  const fullName = `${general.name.first || ""} ${
    general.name.last || ""
  }`.trim();
  return (
    <div>
      <SectionHeader
        title="General Info"
        action={<EditButton onClick={onEdit} />}
      />
      <div className="space-y-2">
        <DetailItem label="Name" value={fullName} />
        <DetailItem label="Employee ID" value={general.empCode} />
        <DetailItem label="Status" value={general.status} />
        <DetailItem label="Gender" value={general.gender} />
        <DetailItem
          label="Phone Number"
          value={`${general.phoneNum.code} ${general.phoneNum.num}`}
        />
        <DetailItem label="Email Primary" value={general.primaryEmail} />
      </div>
    </div>
  );
};

const ProfessionalInfo: React.FC<{
  data: EmployeeDetail;
  onEdit: () => void;
}> = ({ data, onEdit }) => {
  const { professional } = data;
  return (
    <div>
      <SectionHeader
        title="Professional Details"
        action={<EditButton onClick={onEdit} />}
      />
      <div className="space-y-2">
        <DetailItem label="Designation" value={professional.designation} />
        <DetailItem label="Department" value={professional.department} />
        <DetailItem
          label="Joining Date"
          value={new Date(professional.joiningDate).toLocaleDateString()}
        />
        <DetailItem label="Location" value={professional.location} />
        <DetailItem
          label="Reporting Manager"
          value={professional.reportingManager}
        />
        <DetailItem label="Work Week" value={professional.workWeek} />
        <DetailItem label="Annual CTC" value={professional.ctcAnnual} />
        <DetailItem label="Holiday Group" value={professional.holidayGroup} />
        <DetailItem
          label="Payslip Component"
          value={professional.payslipComponent}
        />
      </div>
    </div>
  );
};

const BankDetailsSection: React.FC<{
  data: EmployeeDetail;
  onEdit: () => void;
}> = ({ data, onEdit }) => {
  return (
    <div>
      <SectionHeader
        title="Bank Detail"
        action={
          data.bankDetails && data.bankDetails.id ? (
            <EditButton onClick={onEdit} />
          ) : (
            <AddButton onClick={onEdit} />
          )
        }
      />
      <div className="space-y-2">
        <DetailItem
          label="Bank Name"
          value={data.bankDetails?.bankName ?? "--"}
        />
        <DetailItem
          label="Account Name"
          value={data.bankDetails?.accountName ?? "--"}
        />
        <DetailItem
          label="Branch Name"
          value={data.bankDetails?.branchName ?? "--"}
        />
        <DetailItem
          label="Account Type"
          value={data.bankDetails?.accountType ?? "--"}
        />
        <DetailItem
          label="Account No"
          value={data.bankDetails?.accountNum ?? "--"}
        />
        <DetailItem
          label="IFSC Code"
          value={data.bankDetails?.ifscCode ?? "--"}
        />
      </div>
    </div>
  );
};

// --- GENERIC FORM COMPONENT ---
const GenericForm = forwardRef<{ handleSubmit: () => void }, GenericFormProps>(
  ({ fields, initialState, onSubmit }, ref) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialState);
    const formEl = useRef<HTMLFormElement>(null);

    useEffect(() => {
      setFormData(initialState);
    }, [initialState]);

    useImperativeHandle(ref, () => ({
      handleSubmit: () => {
        formEl.current?.requestSubmit();
      },
    }));

    const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const renderField = (field: FormField) => {
      const commonInputClasses =
        "w-full p-2 border border-slate-300 rounded-md bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#714CDD] focus:border-[#714CDD] transition-colors duration-200 ease-in-out";
      const value = formData[field.name] ?? "";

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
      <form ref={formEl} onSubmit={handleFormSubmit} className="contents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          {fields.map((field) => (
            <div
              key={field.name}
              className={field.spanFull ? "md:col-span-2" : ""}
            >
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-slate-600 mb-1.5"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </form>
    );
  }
);

// --- GENERIC MODAL COMPONENT ---
const EditModal: React.FC<{
  editingSection: string;
  editingItemId: string | null;
  employeeData: EmployeeDetail;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
}> = ({ editingSection, editingItemId, employeeData, onClose, onSubmit }) => {
  const formRef = useRef<{ handleSubmit: () => void }>(null);

  const generalInfoFields: FormField[] = [
    {
      name: "title",
      label: "Title",
      type: "select",
      required: true,
      options: [
        { value: "MR", label: "MR" },
        { value: "MISS", label: "MISS" },
      ],
    },
    { name: "firstName", label: "First Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text", required: true },
    { name: "empCode", label: "Employee ID", type: "text", required: true },
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
    {
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      options: [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
      ],
    },
    { name: "phoneNum", label: "Phone Number", type: "text", required: true },
    {
      name: "maritalStatus",
      label: "Marital Status",
      type: "select",
      required: true,
      options: [
        { value: "Single", label: "Single" },
        { value: "Married", label: "Married" },
      ],
    },
    {
      name: "primaryEmail",
      label: "Email Primary",
      type: "email",
      required: true,
      spanFull: true,
    },
  ];

  const professionalInfoFields: FormField[] = [
    {
      name: "location",
      label: "Location",
      type: "select",
      options: [
        { value: "Noida", label: "Noida" },
        { value: "Gurgaon", label: "Gurgaon" },
      ],
    },
    {
      name: "department",
      label: "Department",
      type: "select",
      options: [
        { value: "HR", label: "HR" },
        { value: "Design", label: "Design" },
      ],
    },
    { name: "designation", label: "Designation", type: "text" },
    {
      name: "payslipComponent",
      label: "Payslip Component",
      type: "select",
      options: [
        { value: "Default", label: "Default" },
        { value: "Intern", label: "Intern" },
      ],
    },
    {
      name: "taxRegime",
      label: "Tax Regime",
      type: "select",
      options: [
        { value: "Old", label: "Old" },
        { value: "New", label: "New" },
      ],
    },
    {
      name: "holidayGroup",
      label: "Holiday Group",
      type: "select",
      options: [{ value: "National Holidays", label: "National Holidays" }],
    },
    { name: "role", label: "Role", type: "text" },
    { name: "reportingManager", label: "Reporting Manager", type: "text" },
    { name: "workWeek", label: "Work Pattern", type: "text" },
    { name: "ctcAnnual", label: "Yearly CTC", type: "number" },
    { name: "rentalCity", label: "Rental City", type: "text" },
    { name: "joiningDate", label: "Joining Date", type: "date" },
    { name: "leavingDate", label: "Leaving Date", type: "date" },
  ];

  const bankDetailsFields: FormField[] = [
    {
      name: "bankName",
      label: "Bank Name",
      type: "text",
      required: true,
      spanFull: true,
    },
    {
      name: "branchName",
      label: "Branch Name",
      type: "text",
      required: true,
      spanFull: true,
    },
    {
      name: "accountName",
      label: "Account Name",
      type: "text",
      required: true,
      spanFull: true,
    },
    {
      name: "accountType",
      label: "Account Type",
      type: "select",
      required: true,
      options: [
        { value: "Saving", label: "Saving" },
        { value: "Current", label: "Current" },
      ],
      spanFull: true,
    },
    {
      name: "accountNum",
      label: "Account No",
      type: "text",
      required: true,
      spanFull: true,
    },
    {
      name: "ifscCode",
      label: "IFSC Code",
      type: "text",
      required: true,
      spanFull: true,
    },
  ];

  let formProps: {
    title: string;
    fields: FormField[];
    initialState: Record<string, any>;
  } | null = null;

  switch (editingSection) {
    case "general":
      formProps = {
        title: "Edit General Info",
        fields: generalInfoFields,
        initialState: {
          ...employeeData.general,
          title: employeeData.general.name.title,
          firstName: employeeData.general.name.first,
          lastName: employeeData.general.name.last,
          phoneNum: employeeData.general.phoneNum.num,
        },
      };
      break;
    case "professional":
      formProps = {
        title: "Edit Professional Info",
        fields: professionalInfoFields,
        initialState: employeeData.professional,
      };
      break;
    case "bank_detail":
      formProps = {
        title: editingItemId ? "Edit Bank Details" : "Add Bank Details",
        fields: bankDetailsFields,
        initialState: employeeData.bankDetails ?? {},
      };
      break;
  }

  if (!formProps) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold mb-4">Edit Not Available</h2>
        <p>No edit form has been configured for this section.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="relative flex justify-center items-center p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">{formProps.title}</h2>
        <button
          onClick={onClose}
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
      </div>
      <div className="flex-grow overflow-y-auto p-6">
        <GenericForm
          ref={formRef}
          fields={formProps.fields}
          initialState={formProps.initialState}
          onSubmit={onSubmit}
        />
      </div>
      <div className="flex items-center justify-center gap-4 p-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="py-2.5 px-8 font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => formRef.current?.handleSubmit()}
          className="py-2.5 px-8 font-semibold text-white bg-[#714CDD] rounded-md hover:bg-[#5f3dbb]"
        >
          Update
        </button>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function EmployeeDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { employeeCode } = useParams<{ employeeCode: string }>();
  const location = useLocation();
  const mainEmployeeId = (location.state as { mainEmployeeId?: string })
    ?.mainEmployeeId;
  console.log("Main Employee ID received from navigation:", mainEmployeeId);

  const { currentEmployee, loading, error } = useSelector(
    (state: RootState) => state.employees
  );
  const [currentSection, setCurrentSection] = useState<string>("general");
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  useEffect(() => {
    if (employeeCode) {
      dispatch(fetchEmployeeDetails(employeeCode));
    }
  }, [dispatch, employeeCode]);

  const handleEdit = (section: string, id: string | null | undefined) => {
    setEditingSection(section);
    setEditingItemId(id || null);
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    if (!currentEmployee) return;
    const empCode = currentEmployee.general.empCode;

    if (editingSection === "general") {
      // Reconstruct nested name object for the API
      const generalData = {
        ...data,
        name: {
          title: data.title,
          first: data.firstName,
          last: data.lastName,
        },
        phoneNum: {
          code: "+91", // Assuming a static code for now
          num: data.phoneNum,
        },
      };
      // Remove flat properties that are now nested
      delete generalData.title;
      delete generalData.firstName;
      delete generalData.lastName;

      dispatch(
        updateGeneralInfo({ generalId: editingItemId, empCode, generalData })
      );
    } else if (editingSection === "professional") {
      dispatch(
        updateProfessionalInfo({
          professionalId: editingItemId,
          empCode,
          professionalData: data,
        })
      );
    } else if (editingSection === "bank_detail") {
      if (editingItemId) {
        dispatch(
          updateBankDetails({
            bankDetailId: editingItemId,
            empCode,
            bankData: data,
          })
        );
      } else {
        if (mainEmployeeId) {
          dispatch(
            addBankDetails({
              employeeId: mainEmployeeId,
              empCode,
              bankData: data,
            })
          );
        } else {
          console.error(
            "Main Employee ID is missing. Cannot add bank details."
          );
        }
      }
    }
    // else if (editingSection === "general") { /* handle general update */ }

    setEditingSection(null);
    setEditingItemId(null);
  };

  const renderSection = () => {
    if (!currentEmployee) return null;
    switch (currentSection) {
      case "general":
        return (
          <GeneralInfo
            data={currentEmployee}
            onEdit={() => handleEdit("general", currentEmployee.general.id)}
          />
        );
      case "professional":
        return (
          <ProfessionalInfo
            data={currentEmployee}
            onEdit={() =>
              handleEdit("professional", currentEmployee.professional.id)
            }
          />
        );
      case "bank_detail":
        return (
          <BankDetailsSection
            data={currentEmployee}
            onEdit={() =>
              handleEdit("bank_detail", currentEmployee.bankDetails?.id)
            }
          />
        );
      case "pf_esi_pt":
        return (
          <PlaceholderComponent
            title="PF, ESI & PT"
            onEdit={() => handleEdit("pf_esi_pt", currentEmployee.pf?.id)}
          />
        );
      case "declaration":
        return (
          <PlaceholderComponent
            title="Declaration"
            onEdit={() => handleEdit("declaration", null)}
          />
        );
      case "salary_distribution":
        return (
          <PlaceholderComponent
            title="Salary Distribution"
            onEdit={() => handleEdit("salary_distribution", null)}
          />
        );
      case "payslips":
        return (
          <PlaceholderComponent
            title="Payslips"
            onEdit={() => handleEdit("payslips", null)}
          />
        );
      case "attendance":
        return (
          <PlaceholderComponent
            title="Attendance"
            onEdit={() => handleEdit("attendance", null)}
          />
        );
      case "loan_and_advances":
        return (
          <PlaceholderComponent
            title="Loan and Advances"
            onEdit={() =>
              handleEdit("loan_and_advances", currentEmployee.loan?.id)
            }
          />
        );
      case "previous_job_details":
        return (
          <PlaceholderComponent
            title="Previous Job Details"
            onEdit={() => handleEdit("previous_job_details", null)}
          />
        );
      case "employee_activities":
        return (
          <PlaceholderComponent
            title="Employee Activities"
            onEdit={() => handleEdit("employee_activities", null)}
          />
        );
      case "projects":
        return (
          <PlaceholderComponent
            title="Projects"
            onEdit={() => handleEdit("projects", null)}
          />
        );
      default:
        return (
          <GeneralInfo
            data={currentEmployee}
            onEdit={() => handleEdit("general", currentEmployee.general.id)}
          />
        );
    }
  };

  const getSectionTitle = () => {
    const item = menuItems.find(
      (m) => m.toLowerCase().replace(/, | & | /g, "_") === currentSection
    );
    return item || "Details";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading Employee Details...
        </p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-center">
        <h1 className="text-2xl font-bold text-red-600">Failed to Load Data</h1>
        <p className="text-md text-gray-600 mt-2">{error}</p>
      </div>
    );
  }
  if (!currentEmployee) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-center">
        <h1 className="text-2xl font-bold text-red-600">Employee Not Found</h1>
        <p className="text-md text-gray-600 mt-2">
          No employee with ID '{employeeCode}' could be found.
        </p>
      </div>
    );
  }

  const employeeName = `${currentEmployee.general.name.first} ${currentEmployee.general.name.last}`;

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{employeeName}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard / Employee / Detail /{" "}
            <span className="text-[#741CDD] font-medium">
              {getSectionTitle()}
            </span>
          </p>
        </header>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <ProfileSidebar
            activeItem={currentSection}
            onSectionChange={setCurrentSection}
          />
          <main className="flex-grow w-full bg-white p-6 rounded-lg border border-gray-200">
            {renderSection()}
          </main>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          editingSection ? "bg-black/50" : "pointer-events-none opacity-0"
        }`}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          editingSection ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {editingSection && currentEmployee && (
          <EditModal
            editingSection={editingSection}
            editingItemId={editingItemId}
            employeeData={currentEmployee}
            onClose={() => {
              setEditingSection(null);
              setEditingItemId(null);
            }}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
}
