import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast"; 
import Table, { type Column } from "../../../../components/common/Table";
import Modal from "../../../../components/common/NotificationModal";
import { Filter } from "lucide-react";
import {
  fetchEmployees,
  deleteEmployee,
  updateEmployeeStatus,
  setFilters as setReduxFilters,
  clearFilters as clearReduxFilters,
  sendInviteEmail,
  resetInviteStatus,
} from "../../../../store/slice/employeeSlice";
import type { RootState, AppDispatch } from "../../../../store/store";
import ActionDropdown from "./ActionDropdown";
import FilterSidebar from "./FilterSidebar";
import CreatePayslipModal from "./CreatePayslipModal";
import type { Employee } from "../../../../types";

// Skeleton Loader Component
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex space-x-4 px-4">
        <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
      </div>

      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border-t border-gray-100"
          >
            <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

//main body
const EmployeesTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPageFromUrl = parseInt(searchParams.get("page") || "1", 10);

  const {
    employees: employeesFromStore,
    loading,
    error,
    filters: reduxFilters,
    limit,
    total,
    inviteStatus,
  } = useSelector((state: RootState) => state.employees);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<
    "warning" | "info" | "success" | "error"
  >("warning");
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalMessage, setModalMessage] = useState<string>("");
  const [employeeForModal, setEmployeeForModal] = useState<Employee | null>(
    null
  );
  const [actionToConfirm, setActionToConfirm] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);

  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    dispatch(fetchEmployees({ page: currentPageFromUrl, limit }));
  }, [dispatch, currentPageFromUrl, limit]);

  useEffect(() => {
    if (error) {
      toast.error(`Error fetching employees: ${error}`, {
        className: "bg-red-50 text-red-800",
      });
    }
  }, [error]);

  useEffect(() => {
    if (inviteStatus === "succeeded") {
      toast.success("Invitation email sent successfully!", {
        className: "bg-green-50 text-green-800",
      });
      dispatch(resetInviteStatus());
    } else if (inviteStatus === "failed") {
      toast.error("Failed to send invitation email.", {
        className: "bg-red-50 text-red-800",
      });
      dispatch(resetInviteStatus());
    }
  }, [inviteStatus, dispatch]);

  const employeesData = useMemo(() => {
    if (!Array.isArray(employeesFromStore)) return [];
    return employeesFromStore.map((apiEmp: any) => ({
      id: apiEmp.id,
      code: apiEmp.employeeCode,
      name: apiEmp.employeeName,
      date: new Date(apiEmp.joiningDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      designation: apiEmp.designation,
      department: apiEmp.department,
      location: apiEmp.location,
      payslip: apiEmp.payslipComponent || "Default",
      gender: apiEmp.gender,
      status: apiEmp.status,
    }));
  }, [employeesFromStore]);

  const filteredEmployees = useMemo(() => {
    return employeesData.filter((emp) => {
      const empDate = new Date(
        emp.date.replace(/(\d{2}) (\w{3}) (\d{4})/, "$2 $1, $3")
      );
      const startDate = reduxFilters.startDate
        ? new Date(reduxFilters.startDate)
        : null;
      const endDate = reduxFilters.endDate
        ? new Date(reduxFilters.endDate)
        : null;
      const matchDate =
        (!startDate || empDate >= startDate) &&
        (!endDate || empDate <= endDate);
      const matchDepartment =
        reduxFilters.department === "All" ||
        emp.department === reduxFilters.department;
      const matchDesignation =
        reduxFilters.designation === "All" ||
        emp.designation === reduxFilters.designation;
      const matchLocation =
        !reduxFilters.location ||
        emp.location
          .toLowerCase()
          .includes(reduxFilters.location.toLowerCase());
      return matchDate && matchDepartment && matchDesignation && matchLocation;
    });
  }, [employeesData, reduxFilters]);

  const handleNextPage = () => {
    setSearchParams({ page: `${currentPageFromUrl + 1}` });
  };

  const handlePrevPage = () => {
    setSearchParams({ page: `${currentPageFromUrl - 1}` });
  };

  const handleAction = (actionName: string, employee: Employee) => {
    setEmployeeForModal(employee);
    setActionToConfirm(actionName);
    switch (actionName) {
      case "View Details":
        navigate(`/employees/list/detail/${employee.code}/${employee.id}`, {
          state: {
            mainEmployeeId: employee.id,
            payslipComponent: employee.payslip,
          },
        });
        break;
      case "Create Payslip":
        setIsPayslipModalOpen(true);
        break;
      case "Delete":
        setModalType("error");
        setModalTitle("Delete Employee?");
        setModalMessage(`Are you sure you want to delete ${employee.name}?`);
        setIsModalOpen(true);
        break;
      case "Invite":
        setModalType("info");
        setModalTitle("Invite User?");
        setModalMessage(
          `Do you want to send an invitation to employee ${employee.name} (${employee.code})?`
        );
        setIsModalOpen(true);
        break;
      case "Re-invite":
        setModalType("warning");
        setModalTitle("Re-invite User?");
        setModalMessage(
          `Are you sure you want to re-invite ${employee.name} for login?`
        );
        setIsModalOpen(true);
        break;
      case "Make Inactive":
        setModalType("warning");
        setModalTitle("Make Inactive?");
        setModalMessage(
          `Are you sure you want to make employee ${employee.name} inactive?`
        );
        setIsModalOpen(true);
        break;
      case "Make Active":
        setModalType("info");
        setModalTitle("Make Active?");
        setModalMessage(
          `Are you sure you want to make employee ${employee.name} active?`
        );
        setIsModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmAction = async () => {
    if (!employeeForModal || !actionToConfirm) return;

    const toastId = toast.loading("Processing your request...");

    try {
      switch (actionToConfirm) {
        case "Delete":
          await dispatch(deleteEmployee(employeeForModal.id)).unwrap();
          toast.success(
            `Employee ${employeeForModal.name} deleted successfully.`,
            {
              id: toastId,
              className: "bg-green-50 text-green-800",
            }
          );
          break;
        case "Make Inactive":
          await dispatch(
            updateEmployeeStatus({
              id: employeeForModal.id,
              status: "Inactive",
            })
          ).unwrap();
          toast.success(`${employeeForModal.name} is now inactive.`, {
            id: toastId,
            className: "bg-blue-50 text-blue-800",
          });
          break;
        case "Make Active":
          await dispatch(
            updateEmployeeStatus({
              id: employeeForModal.id,
              status: "Active",
            })
          ).unwrap();
          toast.success(`${employeeForModal.name} is now active.`, {
            id: toastId,
            className: "bg-blue-50 text-blue-800",
          });
          break;
        case "Invite":
        case "Re-invite":
          await dispatch(sendInviteEmail(employeeForModal.code)).unwrap();
          toast.dismiss(toastId);
          break;
        default:
          toast.dismiss(toastId);
          break;
      }
    } catch (err: any) {
      toast.error(
        err.message || `Failed to perform action: ${actionToConfirm}`,
        {
          id: toastId,
          className: "bg-red-50 text-red-800",
        }
      );
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleApplyFilters = (filters: any) => {
    dispatch(setReduxFilters(filters));
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    dispatch(clearReduxFilters());
  };

  const handleProceedPayslip = (year: string, month: string) => {
    if (employeeForModal && year && month) {
      const params = new URLSearchParams({
        year,
        month,
        name: employeeForModal.name,
        empid: employeeForModal.code,
      });
      navigate(`/employees/list/SalaryComponent?${params.toString()}`);
      setIsPayslipModalOpen(false);
    }
  };

  const columns: Column<Employee>[] = [
    { key: "code", header: "Employee Code" },
    { key: "name", header: "Employee Name" },
    { key: "date", header: "Joining date" },
    { key: "designation", header: "Designation" },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    { key: "payslip", header: "Payslip Component" },
    { key: "gender", header: "Gender" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <ActionDropdown employee={row} onAction={handleAction} />
      ),
    },
  ];

  const renderTableContent = () => {
    if (loading && employeesFromStore.length === 0) {
      return <TableSkeleton rows={limit} />;
    }

    if (error)
      return (
        <div className="text-center p-10 text-red-600">
          Could not load employee data. Please try again later.
        </div>
      );
    if (filteredEmployees.length === 0)
      return <div className="text-center p-10">No employees found.</div>;
    return (
      <Table
        data={filteredEmployees}
        columns={columns}
        className="w-[70vw] text-sm"
      />
    );
  };

  return (
    <div className="px-4 py-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <div className="text-sm font-medium">
          <Link to="/dashboard" className="text-gray-500 hover:text-[#741CDD]">
            Dashboard
          </Link>
          <span className="text-gray-500 mx-2">/</span>
          <Link to="/dashboard" className="text-gray-500 hover:text-[#741CDD]">
            Employee Setup
          </Link>
          <span className="text-gray-500 mx-2">/</span>
          <span className="text-gray-700">List</span>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
        <div className="flex justify-between items-center flex-wrap mb-4">
          <button
            onClick={() => navigate("/employees/create")}
            className="bg-[#741CDD] hover:bg-[#5b14a9] text-white px-4 py-2 text-sm rounded transition duration-200 cursor-pointer"
          >
            + NEW EMPLOYEE
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="p-2 bg-[#741CDD] rounded text-white hover:bg-[#5f3dbb] transition duration-200 cursor-pointer"
            aria-label="Open filters"
          >
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">{renderTableContent()}</div>

        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPageFromUrl <= 1 || loading}
            className={`px-4 py-2 text-sm rounded transition duration-200 ${
              currentPageFromUrl <= 1 || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#741CDD] hover:bg-[#5b14a9] text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPageFromUrl} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPageFromUrl >= totalPages || loading}
            className={`px-4 py-2 text-sm rounded transition duration-200 ${
              currentPageFromUrl >= totalPages || loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#741CDD] hover:bg-[#5b14a9] text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilters={reduxFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <CreatePayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        onProceed={handleProceedPayslip}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleConfirmAction}
        type={modalType}
      />
    </div>
  );
};

export default EmployeesTable;
