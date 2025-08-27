import React, { useState, useEffect } from "react";

import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../../../../store/store";
import { fetchEmployeeDetails } from "../../../../store/slice/employeeSlice";
import {
  addBankDetails,
  updateBankDetails,
} from "../../../../store/slice/bankSlice";
import {
  addPfDetails,
  updatePfDetails,
  type PfDataPayload,
} from "../../../../store/slice/pfSlice";
import { updateGeneralInfo } from "../../../../store/slice/generalSlice";
import { updateProfessionalInfo } from "../../../../store/slice/professionalSlice";
import type {
  EmployeeDetail,
  LoanDetails,
} from "../../../../store/slice/employeeSlice";
import {
  addLoanRequest,
  editLoan,
  approveLoan,
  cancelLoan,
  type EditLoanPayload,
} from "../../../../store/slice/loanSlice";

import ProfileSidebar, { menuItems } from "../layout/ProfileSidebar";
import { PlaceholderComponent } from "../common/DetailItem";
import GeneralInfo from "../common/GeneralInfo";
import ProfessionalInfo from "../common/ProfessionalInfo";
import BankDetailsSection from "../common/BankDetailsSection";
import LoanAdvances from "../common/LoanAdvances";
import PfEsiComponent from "../common/pfEsiComponent";
import Declarations from "../common/declarations";
import Attendance from "../common/Attendance";

import GenericForm, {
  type FormField,
} from "../../../../components/common/GenericForm";
import LoanDetailModal from "../modal/LoanDetailModal";
import LoanConfirmationModal from "../modal/LoanConfirmationModal";
import AddLoanModal from "../modal/AddLoanModal";
import PreviousJobDetails from "../common/PreviousJobDetails";
import SalaryDistribution from "../common/SalaryDistribution";
import ProjectsSection from "../common/ProjectsSection";
import EmployeeActivities from "../common/EmployeeActivities";
import {
  addPreviousJob,
  editPreviousJob,
  type CreatePreviousJobPayload,
  type PreviousJob, // Import the specific payload type
} from "../../../../store/slice/previousJobSlice";

// Skeleton for the Header section (Employee Name & Breadcrumbs)
const EmployeeDetailHeaderSkeleton: React.FC = () => (
  <header className="mb-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-2"></div>
    <div className="h-5 bg-gray-200 rounded-md w-1/2"></div>
  </header>
);

// Skeleton for the Profile Sidebar
const ProfileSidebarSkeleton: React.FC = () => {
  const SKELETON_ITEM_COUNT = 12; // Matches your menu item count
  return (
    <div className="w-full md:w-[260px] font-sans shrink-0 animate-pulse">
      <ul className="list-none m-0 p-0 overflow-hidden rounded-lg border-2 border-gray-200">
        {Array.from({ length: SKELETON_ITEM_COUNT }).map((_, index) => (
          <li
            key={index}
            className="py-4 pr-6 pl-6 border-b border-gray-200 last:border-b-0"
          >
            <div className="h-5 bg-gray-200 rounded"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Skeleton for the main content area on the right
const MainContentSkeleton: React.FC = () => (
  <div className="flex-grow w-full bg-white p-6 rounded-lg border border-gray-200 animate-pulse">
    <div className="space-y-4">
      <div className="h-8 w-1/4 bg-gray-200 rounded-md"></div>
      <div className="h-5 w-full bg-gray-200 rounded-md"></div>
      <div className="h-5 w-5/6 bg-gray-200 rounded-md"></div>
      <div className="h-5 w-3/4 bg-gray-200 rounded-md mt-6"></div>
    </div>
  </div>
);

const generalInfoFields: FormField[] = [
  {
    name: "title",
    label: "Title",
    type: "select",
    required: true,
    options: [
      { value: "MR", label: "MR" },
      { value: "MRS", label: "MRS" },
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

const loanInfoFields: FormField[] = [
  {
    name: "loanAmount",
    label: "Loan Amount",
    type: "number",
    required: true,
    placeholder: "e.g., 154250.00",
  },
  {
    name: "installments",
    label: "Installments",
    type: "number",
    required: true,
    placeholder: "e.g., 12",
  },
  {
    name: "firstInstallmentDate",
    label: "1st Installment Date",
    type: "date",
    required: true,
  },
  {
    name: "staffNotes",
    label: "Staff Notes",
    type: "textarea",
    spanFull: true,
    placeholder: "Sample Text",
  },
];

export const approveLoanFields: FormField[] = [
  { name: "loanAmount", label: "Loan Amount", type: "number", required: true },
  {
    name: "installments",
    label: "Installments",
    type: "number",
    required: true,
  },
  {
    name: "paymentReleaseMonth",
    label: "Payment Release Month",
    type: "date",
    required: true,
  },
  { name: "staffNote", label: "Staff Note", type: "textarea", spanFull: true },
];

export const declineLoanFields: FormField[] = [
  {
    name: "cancelReason",
    label: "Cancel Reason",
    type: "textarea",
    required: true,
    spanFull: true,
  },
];

const addLoanRequestFields: FormField[] = [
  {
    name: "empName",
    label: "Employee Name",
    type: "text",
    required: true,
    placeholder: "Employee Name",
    spanFull: true,
  },
  {
    name: "amountReq",
    label: "Requested Amount",
    type: "number",
    required: true,
    placeholder: "e.g., 500000",
    spanFull: true,
  },
  {
    name: "note",
    label: "Note",
    type: "textarea",
    required: true,
    spanFull: true,
    placeholder: "Need for home",
  },
  {
    name: "staffNote",
    label: "Staff Note",
    type: "textarea",
    required: true,
    spanFull: true,
    placeholder: "Urgent requirement",
  },
];

const editLoanFields: FormField[] = [
  {
    name: "amountApp",
    label: "Approved Amount",
    type: "number",
    required: true,
    placeholder: "e.g., 400000",
    spanFull: true,
  },
  {
    name: "staffNote",
    label: "Staff Note",
    type: "textarea",
    spanFull: true,
    placeholder: "Updated based on limit",
  },
];

const pfEsiFields: FormField[] = [
  {
    name: "employeePfEnable",
    label: "Employee PF Enabled",
    type: "select", // Changed from 'toggle'
    options: [
      // Added options
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  { name: "pfNum", label: "Employee PF Number", type: "text" },
  { name: "uanNum", label: "Employee UAN Number", type: "text" },
  {
    name: "employeerPfEnable",
    label: "Employer PF Enabled",
    type: "select",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  {
    name: "esiEnable",
    label: "ESI Enabled",
    type: "select",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  { name: "esiNum", label: "ESI Number", type: "text" },
  {
    name: "professionalTax",
    label: "Professional Tax Enabled",
    type: "select",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
  {
    name: "labourWelfare",
    label: "Labour Welfare Fund Enabled",
    type: "select",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  },
];
// --- MAIN PAGE COMPONENT ---

export default function EmployeeDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { employeeCode } = useParams<{ employeeCode: string }>();
  const location = useLocation();
  const mainEmployeeId = (location.state as { mainEmployeeId?: string })
    ?.mainEmployeeId;
  const payslipComponent = (location.state as { payslipComponent?: string })
    ?.payslipComponent;
  console.log("Payslip component from location state:", payslipComponent);

  const { currentEmployee, loading, error } = useSelector(
    (state: RootState) => state.employees
  );
  const [currentSection, setCurrentSection] = useState<string>("general");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLoan, setEditingLoan] = useState<LoanDetails | null>(null);
  const [viewingLoan, setViewingLoan] = useState<LoanDetails | null>(null);
  const [confirmingLoan, setConfirmingLoan] = useState<LoanDetails | null>(
    null
  );
  const [confirmationAction, setConfirmationAction] = useState<
    "approve" | "decline" | null
  >(null);

  useEffect(() => {
    if (employeeCode) {
      dispatch(fetchEmployeeDetails(employeeCode));
    }
  }, [dispatch, employeeCode]);

  const handleAddLoan = () => {
    setIsAddModalOpen(true);
  };

  const getSectionTitle = () => {
    const item = menuItems.find(
      (m: string) =>
        m.toLowerCase().replace(/, | & | /g, "_") === currentSection
    );
    return item || "General Info"; // Provide a sensible default
  };
  const handleEdit = (section: string, itemToEdit?: any) => {
    setEditingSection(section);
    if (section === "loan_and_advances" && itemToEdit) {
      setEditingLoan(itemToEdit as LoanDetails);
    } else {
      setEditingLoan(null);
    }
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    if (!currentEmployee) return;
    const employeeId = currentEmployee.general.id;

    if (editingSection === "general") {
      const generalData = {
        ...data,
        name: {
          title: data.title,
          first: data.firstName,
          last: data.lastName,
        },
        phoneNum: {
          code: "+91",
          num: data.phoneNum,
        },
      };
      delete generalData.title;
      delete generalData.firstName;
      delete generalData.lastName;

      dispatch(
        updateGeneralInfo({
          generalId: currentEmployee.general.id,
          empCode: employeeCode,
          generalData,
        })
      );
    } else if (editingSection === "professional") {
      dispatch(
        updateProfessionalInfo({
          professionalId: currentEmployee.professional.id,
          empCode: employeeCode,
          professionalData: data,
        })
      );
    } else if (editingSection === "bank_detail") {
      if (currentEmployee.bankDetails?.id) {
        dispatch(
          updateBankDetails({
            bankDetailId: currentEmployee.bankDetails?.id,
            empCode: employeeCode,
            bankData: data,
          })
        );
      } else {
        if (mainEmployeeId) {
          dispatch(
            addBankDetails({
              employeeId: mainEmployeeId,
              empCode: employeeCode,
              bankData: data,
            })
          );
        } else {
          console.error(
            "Main Employee ID is missing. Cannot add bank details."
          );
        }
      }
    } else if (editingSection === "loan_and_advances") {
      if (editingLoan && mainEmployeeId && employeeCode) {
        const editPayload: EditLoanPayload = {
          loanId: editingLoan.id,
          amountApp: data.amountApp,
          staffNote: data.staffNote,
        };
        dispatch(
          editLoan({
            employeeId: mainEmployeeId,
            employeeCode: employeeCode,
            payload: editPayload,
          })
        );
      }
    } else if (editingSection === "pf_esi_pt") {
      const pfDataForApi = { ...data };
      const booleanKeys = [
        "employeePfEnable",
        "employeerPfEnable",
        "esiEnable",
        "professionalTax",
        "labourWelfare",
      ];

      booleanKeys.forEach((key) => {
        if (pfDataForApi[key] !== undefined) {
          pfDataForApi[key] = String(pfDataForApi[key]);
        }
      });
      // 👇 Add this new block
      if (currentEmployee.pf?.id) {
        // --- EDIT LOGIC ---
        dispatch(
          updatePfDetails({
            pfId: currentEmployee.pf.id,
            employeeCode: employeeCode, // Needed to refetch employee data
            pfData: pfDataForApi,
          })
        );
      } else {
        // --- ADD LOGIC ---
        if (mainEmployeeId) {
          dispatch(
            addPfDetails({
              employeeId: mainEmployeeId,
              employeeCode: employeeCode,
              pfData: pfDataForApi as PfDataPayload,
            })
          );
        } else {
          console.error("Main Employee ID is missing. Cannot add PF details.");
        }
      }
    }
    setEditingSection(null);
    setEditingLoan(null);
  };

  const handleAddLoanSubmit = (data: Record<string, any>) => {
    console.log("--- DEBUG: Submitting Add Loan Form ---");
    console.log("Value of mainEmployeeId:", mainEmployeeId);
    console.log("Value of employeeCode:", employeeCode);
    if (!currentEmployee || !employeeCode || !employeeCode) return;

    const apiPayload = {
      empName: data.empName,
      amountReq: String(data.amountReq),
      staffNote: data.staffNote,
      note: data.note,
    };
    dispatch(
      addLoanRequest({
        employeeId: mainEmployeeId,
        employeeCode: employeeCode,
        loanData: apiPayload,
      })
    );
    setIsAddModalOpen(false);
  };

  const handleViewDetails = (loanItem: LoanDetails) => {
    setViewingLoan(loanItem);
  };

  const handleApproveLoan = (loanId: string) => {
    const loanToApprove = currentEmployee?.loan?.find(
      (loan) => loan.id === loanId
    );
    if (loanToApprove) {
      setConfirmingLoan(loanToApprove);
      setConfirmationAction("approve");
      setViewingLoan(null);
    }
  };

  const handleDeclineLoan = (loanId: string) => {
    const loanToDecline = currentEmployee?.loan?.find(
      (loan) => loan.id === loanId
    );
    if (loanToDecline) {
      setConfirmingLoan(loanToDecline);
      setConfirmationAction("decline");
      setViewingLoan(null);
    }
  };

  const handleConfirmationSubmit = (data: Record<string, any>) => {
    if (!confirmingLoan || !employeeCode || !confirmationAction) return;

    if (confirmationAction === "approve") {
      const loanAmount = data.loanAmount;
      const installments = data.installments;
      const paymentReleaseMonth = data.paymentReleaseMonth;
      const staffNote = data.staffNote;

      if (
        String(loanAmount).trim().length === 0 ||
        String(installments).trim().length === 0 ||
        String(paymentReleaseMonth).trim().length === 0 ||
        String(staffNote).trim().length === 0
      ) {
        alert("Please fill in all required fields for loan approval.");
        return;
      }

      const approvalPayload = {
        amountApp: String(loanAmount),
        installment: String(installments),
        date: paymentReleaseMonth,
        staffNote: staffNote,
        loanId: confirmingLoan.id,
      };

      dispatch(
        approveLoan({ employeeId: employeeCode, payload: approvalPayload })
      );
    } else if (confirmationAction === "decline") {
      if (!data.cancelReason.trim()) {
        alert("Please provide a reason for declining the loan.");
        return;
      }
      const declinePayload = {
        cancelReason: data.cancelReason,
        loanId: confirmingLoan.id,
      };
      dispatch(
        cancelLoan({ employeeId: employeeCode, payload: declinePayload })
      );
    }

    setConfirmingLoan(null);
    setConfirmationAction(null);
  };

  const handlePreviousJobSave = (
    jobData: Partial<PreviousJob>,
    jobId?: string
  ) => {
    // Ensure you have the necessary IDs. 'mainEmployeeId' is from location.state
    if (!employeeCode || !mainEmployeeId) {
      console.error("Cannot save job: Employee identifiers are missing.");
      return;
    }

    if (jobId) {
      // --- EDIT LOGIC ---
      dispatch(
        editPreviousJob({
          empId: mainEmployeeId,
          employeeCode,
          payload: { jobId, ...jobData },
        })
      );
    } else {
      // --- ADD LOGIC ---
      dispatch(
        addPreviousJob({
          empId: mainEmployeeId,
          employeeCode,
          jobData: jobData as CreatePreviousJobPayload,
        })
      );
    }
  };

  const renderSection = () => {
    if (!currentEmployee) return null;
    switch (currentSection) {
      case "general":
        return (
          <GeneralInfo
            data={currentEmployee}
            onEdit={() => handleEdit("general", currentEmployee.general)}
            employeeId={employeeCode}
          />
        );
      case "professional":
        return (
          <ProfessionalInfo
            data={currentEmployee}
            onEdit={() =>
              handleEdit("professional", currentEmployee.professional)
            }
          />
        );
      case "bank_detail":
        return (
          <BankDetailsSection
            data={currentEmployee}
            onEdit={() =>
              handleEdit("bank_detail", currentEmployee.bankDetails)
            }
          />
        );

      case "pf_esi_pt":
        return (
          <PfEsiComponent
            title="PF, ESI & PT"
            // onEdit={() => handleEdit("pf_esi_pt", currentEmployee.pf)}
            data={currentEmployee} // 👈 Pass the employee data
            onEdit={() => handleEdit("pf_esi_pt", currentEmployee.pf)}
          />
        );
      case "declaration":
        return (
          <Declarations
            title="Declaration"
            onEdit={() => handleEdit("declaration", null)}
          />
        );
      case "salary_distribution":
        if (!payslipComponent || payslipComponent.trim() === "") {
          return (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-bold text-yellow-800">
                Salary Data Not Available
              </h3>
              <p className="text-yellow-700">
                This employee has not been assigned a payslip component group.
              </p>
            </div>
          );
        }
        // Render the actual component with the required prop
        return <SalaryDistribution groupname={payslipComponent} />;
      case "payslips":
        return (
          <PlaceholderComponent
            title="Payslips"
            onEdit={() => handleEdit("payslips", null)}
          />
        );
      case "attendance":
        return (
          <Attendance
            title="Attendance"
            onEdit={() => handleEdit("attendance", null)}
          />
        );
      case "loan_and_advances":
        return (
          <LoanAdvances
            loans={currentEmployee.loan || []}
            onEdit={(loanItem) => handleEdit("loan_and_advances", loanItem)}
            onViewDetails={handleViewDetails}
            data={currentEmployee}
            onAddLoan={handleAddLoan} // <-- This is the crucial connection
          />
        );

      case "previous_job_details":
        return (
          <PreviousJobDetails
            data={currentEmployee}
            onSave={handlePreviousJobSave}
          />
        );
      case "employee_activities":
        return <EmployeeActivities data={currentEmployee} />;

      case "projects":
        return <ProjectsSection data={currentEmployee} />;
      default:
        return (
          <GeneralInfo
            data={currentEmployee}
            onEdit={() => handleEdit("general", currentEmployee.general)}
            employeeId={employeeCode}
          />
        );
    }
  };

  const renderEditModal = () => {
    if (!editingSection || !currentEmployee) return null;

    let formProps: {
      title: string;
      fields: FormField[];
      initialState: Record<string, any>;
    } | null = null;

    const handleCancel = () => {
      setEditingSection(null);
      setEditingLoan(null);
    };

    switch (editingSection) {
      case "general":
        formProps = {
          title: "Edit General Info",
          fields: generalInfoFields,
          initialState: {
            ...currentEmployee.general,
            title: currentEmployee.general.name.title,
            firstName: currentEmployee.general.name.first,
            lastName: currentEmployee.general.name.last,
            phoneNum: currentEmployee.general.phoneNum.num,
          },
        };
        break;
      case "professional":
        formProps = {
          title: "Edit Professional Info",
          fields: professionalInfoFields,
          initialState: currentEmployee.professional,
        };
        break;
      case "bank_detail":
        formProps = {
          title: currentEmployee.bankDetails
            ? "Edit Bank Details"
            : "Add Bank Details",
          fields: bankDetailsFields,
          initialState: currentEmployee.bankDetails ?? {},
        };
        break;
      case "loan_and_advances":
        if (!editingLoan) return null;
        formProps = {
          title: "Edit Loan Request",
          fields: editLoanFields,
          initialState: {
            amountApp: editingLoan.amountApp || editingLoan.amountReq,
            staffNote: editingLoan.staffNote || "",
          },
        };
        break;
      case "pf_esi_pt": // 👇 Add this new case
        const hasPfData = !!currentEmployee.pf?.id;
        formProps = {
          title: hasPfData
            ? "Edit PF, ESI & PT Details"
            : "Add PF, ESI & PT Details",
          fields: pfEsiFields,
          initialState: hasPfData
            ? currentEmployee.pf
            : {
                // Default state for adding new details
                employeePfEnable: false,
                pfNum: "",
                uanNum: "",
                employeerPfEnable: false,
                esiEnable: false,
                esiNum: "",
                professionalTax: false,
                labourWelfare: false,
              },
        };
        break;
      default:
        return null;
    }

    if (!formProps) return null;

    return (
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          editingSection ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={handleCancel}
        ></div>
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            editingSection ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <GenericForm
            title={formProps.title}
            fields={formProps.fields}
            initialState={formProps.initialState}
            onSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  };

  const renderAddLoanModal = () => {
    if (!isAddModalOpen || !currentEmployee) return null;
    const initialAddState = {
      empName: `${currentEmployee.general.name.first} ${currentEmployee.general.name.last}`,
      amountReq: "",
      note: "",
      staffNote: "",
    };

    return (
      <AddLoanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLoanSubmit}
        initialState={initialAddState}
      />
    );
  };

  const renderViewModal = () => {
    if (!viewingLoan) return null;

    return (
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          viewingLoan ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setViewingLoan(null)}
        ></div>
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            viewingLoan ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <LoanDetailModal
            loan={viewingLoan}
            onClose={() => setViewingLoan(null)}
            onApprove={handleApproveLoan}
            onDecline={handleDeclineLoan}
          />
        </div>
      </div>
    );
  };

  const renderConfirmationModal = () => {
    if (!confirmingLoan || !confirmationAction) return null;

    let modalProps;
    let fields;
    let initialState;

    if (confirmationAction === "approve") {
      modalProps = {
        title: "Approve Loan Request Confirmation",
        message:
          "You can change loan amount and number of installment before approving this Loan Request.",
      };
      fields = approveLoanFields;
      initialState = {
        loanAmount: confirmingLoan.amountReq,
        installments: confirmingLoan.paybackTerm?.installment || "",
        paymentReleaseMonth: "",
        staffNote: "",
      };
    } else {
      modalProps = {
        title: "Decline Loan Request Confirmation",
        message: "This loan request will be canceled.",
      };
      fields = declineLoanFields;
      initialState = { cancelReason: "" };
    }

    return (
      <LoanConfirmationModal
        isOpen={true}
        onClose={() => setConfirmingLoan(null)}
        loan={confirmingLoan}
        onConfirm={handleConfirmationSubmit}
        onCancel={() => setConfirmingLoan(null)}
        formFields={fields}
        initialState={initialState}
        confirmButtonText="Yes"
        cancelButtonText="No"
        {...modalProps}
      />
    );
  };

  if (loading) {
    // return (
    //   <div className="flex justify-center items-center h-screen bg-slate-50">
    //     <p className="text-lg text-gray-500 animate-pulse">
    //       Loading Employee Details...
    //     </p>
    //   </div>
    // );
    return (
      <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <EmployeeDetailHeaderSkeleton />
          <div className="flex flex-col md:flex-row items-start gap-6">
            <ProfileSidebarSkeleton />
            <MainContentSkeleton />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    // return (
    //   <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-center">
    //     <h1 className="text-2xl font-bold text-red-600">Failed to Load Data</h1>
    //     <p className="text-md text-gray-600 mt-2">{error}</p>
    //   </div>
    // );
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-center">
        <h1 className="text-2xl font-bold text-red-600">Failed to Load Data</h1>
        <p className="text-md text-gray-600 mt-2">{error}</p>
      </div>
    );
  }
  if (!currentEmployee) {
    // return (
    //   <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-center">
    //     <h1 className="text-2xl font-bold text-red-600">Employee Not Found</h1>
    //     <p className="text-md text-gray-600 mt-2">
    //       No employee with ID '{employeeCode}' could be found.
    //     </p>
    //   </div>
    // );
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

  console.log("EmployeeDetailPage is rendering. PF Data:", currentEmployee.pf);
  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{employeeName}</h1>
          {/* 3. Replaced static breadcrumbs with the new dynamic structure */}
          <p className="text-sm text-gray-500 mt-1">
            <Link to="/dashboard" className="hover:text-[#741CDD]">
              Dashboard
            </Link>
            <span className="mx-2">/</span>
            {/* Note: Linking Employee Setup to the list page as it's a more common UX pattern. */}
            <Link to="/dashboard" className="hover:text-[#741CDD]">
              Employee Setup
            </Link>
            <span className="mx-2">/</span>
            <Link to="/employees/list" className="hover:text-[#741CDD]">
              List
            </Link>
            <span className="mx-2">/</span>
            <Link to={`/employees/list`} className="hover:text-[#741CDD]">
              Detail
            </Link>
            <span className="mx-2">/</span>
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
      {renderEditModal()}
      {renderViewModal()}
      {renderConfirmationModal()}
      {renderAddLoanModal()}
    </div>
  );
}
