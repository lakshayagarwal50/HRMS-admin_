import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

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
  generalInfoFields,
  bankDetailsFields,
  loanInfoFields,
  approveLoanFields,
  declineLoanFields,
  addLoanRequestFields,
  editLoanFields,
  pfEsiFields,
  // ... import all other field configurations
} from "../layout/formFields";
import {
  EmployeeDetailHeaderSkeleton,
  ProfileSidebarSkeleton,
  MainContentSkeleton,
} from "../components/EmployeeDetailSkeletons";
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
// import Declarations from "../common/declarations";
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
  type PreviousJob,
} from "../../../../store/slice/previousJobSlice";

import {
  fetchLocations,
  type Location,
} from "../../../../store/slice/locationSlice"; // Add this

import {
  fetchDepartments,
  type Department,
} from "../../../../store/slice/departmentSlice";

import {
  fetchSalaryStructures,
  type SalaryStructure,
} from "../../../../store/slice/salaryStructureSlice";

import {
  fetchEmployeeDesignations,
  resetEmployeeDesignations,
  type Designation,
} from "../../../../store/slice/employeeDesignationSlice";

import { fetchRoles, type Role } from "../../../../store/slice/roleSlice";
import { useMemo } from "react"; // Add this

export default function EmployeeDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { items: locations, status: locationStatus } = useSelector(
    (state: RootState) => state.locations
  );

  const { items: departments, status: departmentStatus } = useSelector(
    (state: RootState) => state.departments
  );

  const { data: salaryStructures } = useSelector(
    (state: RootState) => state.salaryStructures
  );

  const { items: roles } = useSelector((state: RootState) => state.roles);

  const { items: designations } = useSelector(
    (state: RootState) => state.employeeDesignations
  );

  const { employeeCode } = useParams<{ employeeCode: string }>();
  const location = useLocation();
  const mainEmployeeId = (location.state as { mainEmployeeId?: string })
    ?.mainEmployeeId;
  const payslipComponent = (location.state as { payslipComponent?: string })
    ?.payslipComponent;

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

  const professionalInfoFields: FormField[] = useMemo(
    () => [
      {
        name: "location",
        label: "Location",
        type: "select",
        options:
          locations.map((loc: Location) => ({
            value: loc.city,
            label: loc.city,
          })) || [],
      },
      {
        name: "department",
        label: "Department",
        type: "select",
        options:
          departments.map((dept: Department) => ({
            value: dept.name,
            label: dept.name,
          })) || [],
      },
      {
        name: "designation",
        label: "Designation",
        type: "select",
        options:
          designations.map((des: Designation) => ({
            value: des.designationName,
            label: des.designationName,
          })) || [],
      },
      {
        name: "payslipComponent",
        label: "Payslip Component",
        type: "select",

        options:
          salaryStructures.map((structure: SalaryStructure) => ({
            value: structure.groupName,
            label: structure.groupName,
          })) || [],
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
      {
        name: "role",
        label: "Role",
        type: "select",
        options:
          roles.map((role: Role) => ({
            value: role.name,
            label: role.name,
          })) || [],
      },
      {
        name: "reportingManager",
        label: "Reporting Manager",
        type: "select",
        options: [
          { value: "Kushal Singh (1001)", label: "Kushal Singh (1001)" },
          { value: "Rohit Sharma (1002)", label: "Rohit Sharma (1002)" },
          { value: "Jane Doe (1003)", label: "Jane Doe (1003)" },
        ],
      },
      {
        name: "workWeek",
        label: "Work Pattern",
        type: "select",
        options: [
          { value: "Alternate", label: "Alternate" },
          { value: "5 days Week", label: "5 days Week" },
        ],
      },
      { name: "ctcAnnual", label: "Yearly CTC", type: "number" },
      { name: "rentalCity", label: "Rental City", type: "text" },
      { name: "joiningDate", label: "Joining Date", type: "date" },
      { name: "leavingDate", label: "Leaving Date", type: "date" },
    ],
    [locations]
  );

  useEffect(() => {
    dispatch(fetchLocations());
    dispatch(fetchDepartments());
    dispatch(fetchSalaryStructures());
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (employeeCode) {
      dispatch(fetchEmployeeDetails(employeeCode));
    }
  }, [dispatch, employeeCode]);

  useEffect(() => {
    if (error) {
      toast.error(`Failed to load employee data: ${error}`, {
        className: "bg-red-50 text-red-800",
      });
    }
  }, [error]);

  const handleAddLoan = () => {
    setIsAddModalOpen(true);
  };
  const handleEdit = (section: string, itemToEdit?: any) => {
    if (
      section === "professional" &&
      currentEmployee?.professional.department
    ) {
      dispatch(
        fetchEmployeeDesignations(currentEmployee.professional.department)
      );
    }
    setEditingSection(section);
    if (section === "loan_and_advances" && itemToEdit) {
      setEditingLoan(itemToEdit as LoanDetails);
    } else {
      setEditingLoan(null);
    }
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    if (!currentEmployee) return;

    const toastId = toast.loading("Saving changes...");

    try {
      if (editingSection === "general") {
        const generalData = {
          ...data,
          name: {
            title: data.title,
            first: data.firstName,
            last: data.lastName,
          },
          phoneNum: { code: "+91", num: data.phoneNum },
        };
        delete generalData.title;
        delete generalData.firstName;
        delete generalData.lastName;

        await dispatch(
          updateGeneralInfo({
            generalId: currentEmployee.general.id,
            empCode: employeeCode,
            generalData,
          })
        ).unwrap();
      } else if (editingSection === "professional") {
        await dispatch(
          updateProfessionalInfo({
            professionalId: currentEmployee.professional.id,
            empCode: employeeCode,
            professionalData: data,
          })
        ).unwrap();
      } else if (editingSection === "bank_detail") {
        if (currentEmployee.bankDetails?.id) {
          await dispatch(
            updateBankDetails({
              bankDetailId: currentEmployee.bankDetails.id,
              empCode: employeeCode,
              bankData: data,
            })
          ).unwrap();
        } else if (mainEmployeeId) {
          await dispatch(
            addBankDetails({
              employeeId: mainEmployeeId,
              empCode: employeeCode,
              bankData: data,
            })
          ).unwrap();
        } else {
          throw new Error("Employee ID is missing.");
        }
      } else if (editingSection === "loan_and_advances") {
        if (editingLoan && mainEmployeeId && employeeCode) {
          const editPayload: EditLoanPayload = {
            loanId: editingLoan.id,
            amountApp: data.amountApp,
            staffNote: data.staffNote,
          };
          await dispatch(
            editLoan({
              employeeId: mainEmployeeId,
              employeeCode: employeeCode,
              payload: editPayload,
            })
          ).unwrap();
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

        if (currentEmployee.pf?.id) {
          await dispatch(
            updatePfDetails({
              pfId: currentEmployee.pf.id,
              employeeCode: employeeCode,
              pfData: pfDataForApi,
            })
          ).unwrap();
        } else if (mainEmployeeId) {
          await dispatch(
            addPfDetails({
              employeeId: mainEmployeeId,
              employeeCode: employeeCode,
              pfData: pfDataForApi as PfDataPayload,
            })
          ).unwrap();
        } else {
          throw new Error("Employee ID is missing.");
        }
      }

      toast.success("Information updated successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to update information.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    } finally {
      setEditingSection(null);
      setEditingLoan(null);
    }
  };

  const handleAddLoanSubmit = async (data: Record<string, any>) => {
    if (!currentEmployee || !employeeCode || !mainEmployeeId) {
      toast.error("Cannot submit loan request: Missing employee data.");
      return;
    }

    const toastId = toast.loading("Submitting loan request...");

    try {
      const apiPayload = {
        empName: data.empName,
        amountReq: String(data.amountReq),
        staffNote: data.staffNote,
        note: data.note,
      };

      await dispatch(
        addLoanRequest({
          employeeId: mainEmployeeId,
          employeeCode: employeeCode,
          loanData: apiPayload,
        })
      ).unwrap();

      toast.success("Loan request submitted successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to submit loan request.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    } finally {
      setIsAddModalOpen(false);
    }
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

  const handleConfirmationSubmit = async (data: Record<string, any>) => {
    if (!confirmingLoan || !employeeCode || !confirmationAction) return;

    const toastId = toast.loading("Processing loan status...");

    try {
      if (confirmationAction === "approve") {
        const approvalPayload = {
          amountApp: String(data.loanAmount),
          installment: String(data.installments),
          date: data.paymentReleaseMonth,
          staffNote: data.staffNote,
          loanId: confirmingLoan.id,
        };
        await dispatch(
          approveLoan({ employeeId: employeeCode, payload: approvalPayload })
        ).unwrap();
        toast.success("Loan approved successfully!", {
          id: toastId,
          className: "bg-green-50 text-green-800",
        });
      } else if (confirmationAction === "decline") {
        const declinePayload = {
          cancelReason: data.cancelReason,
          loanId: confirmingLoan.id,
        };
        await dispatch(
          cancelLoan({ employeeId: employeeCode, payload: declinePayload })
        ).unwrap();
        toast.success("Loan declined successfully.", {
          id: toastId,
          className: "bg-blue-50 text-blue-800",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process the request.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
    } finally {
      setConfirmingLoan(null);
      setConfirmationAction(null);
    }
  };

  const handlePreviousJobSave = async (
    jobData: Partial<PreviousJob>,
    jobId?: string
  ) => {
    if (!employeeCode || !mainEmployeeId) {
      toast.error("Cannot save: Employee identifiers are missing.");
      return;
    }

    const toastId = toast.loading("Saving previous job details...");

    try {
      if (jobId) {
        await dispatch(
          editPreviousJob({
            empId: mainEmployeeId,
            employeeCode,
            payload: { jobId, ...jobData },
          })
        ).unwrap();
      } else {
        await dispatch(
          addPreviousJob({
            empId: mainEmployeeId,
            employeeCode,
            jobData: jobData as CreatePreviousJobPayload,
          })
        ).unwrap();
      }
      toast.success("Job details saved successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to save job details.", {
        id: toastId,
        className: "bg-red-50 text-red-800",
      });
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
            data={currentEmployee}
            onEdit={() => handleEdit("pf_esi_pt", currentEmployee.pf)}
          />
        );
      case "declaration":
        return (
          <PlaceholderComponent
            title="Declaration"
            onEdit={() => handleEdit("payslips", null)}
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
            onAddLoan={handleAddLoan}
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
      dispatch(resetEmployeeDesignations());
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
      case "pf_esi_pt":
        const hasPfData = !!currentEmployee.pf?.id;
        formProps = {
          title: hasPfData
            ? "Edit PF, ESI & PT Details"
            : "Add PF, ESI & PT Details",
          fields: pfEsiFields,
          initialState: hasPfData
            ? currentEmployee.pf
            : {
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
            <Link to="/employees/list" className="hover:text-[#741CDD]">
              Employee List
            </Link>
            <span className="mx-2">/</span>
            <button
              type="button"
              onClick={() => {}}
              className="hover:text-[#741CDD] "
            >
              Detail
            </button>
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
