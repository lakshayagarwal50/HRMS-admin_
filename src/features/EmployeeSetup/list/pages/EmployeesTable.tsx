import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Table, { type Column } from "../../../../components/common/Table";
import Modal from "../../../../components/common/NotificationModal";
import { Filter, Search } from "lucide-react";
import useDebounce from "../../../../hooks/useDebounce";
import {
  fetchEmployees,
  fetchAllEmployees,
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

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (totalPages <= 1) return null;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-700">
      <span>
        Showing {startItem} to {endItem} of {totalItems} items
      </span>
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-[#741CDD] text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

//main body
const EmployeesTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentLimit = parseInt(searchParams.get("limit") || "10", 10);
  const currentSearch = searchParams.get("search") || "";

  const {
    employees,
    loading,
    error,
    filters: reduxFilters,
    total,
    inviteStatus,
    inviteError,
  } = useSelector((state: RootState) => state.employees);

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

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

  useEffect(() => {
    dispatch(
      fetchEmployees({
        page: currentPage,
        limit: currentLimit,
        search: currentSearch,
      })
    );
  }, [dispatch, currentPage, currentLimit, currentSearch]);
  useEffect(() => {
    if (debouncedSearchQuery !== currentSearch) {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set("page", "1");
          newParams.set("search", debouncedSearchQuery);
          return newParams;
        },
        { replace: true }
      );
    }
  }, [debouncedSearchQuery, currentSearch, setSearchParams]);

  useEffect(() => {
    if (error) {
      toast.error(` ${error}`, {
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
      dispatch(resetInviteStatus());
    }
  }, [inviteStatus, dispatch]);
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(employees)) return [];

    const employeesData = employees.map((apiEmp: any) => ({
      id: apiEmp.id,
      code: apiEmp.employeeCode,
      name: apiEmp.employeeName,
      date: new Date(apiEmp.joiningDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      joiningDateObj: new Date(apiEmp.joiningDate),
      designation: apiEmp.designation,
      department: apiEmp.department,
      location: apiEmp.location,
      payslip: apiEmp.payslipComponent || "Default",
      gender: apiEmp.gender,
      status: apiEmp.status,
    }));

    return employeesData.filter((emp) => {
      const empDate = emp.joiningDateObj;
      empDate.setHours(0, 0, 0, 0);

      const startDate = reduxFilters.startDate
        ? new Date(reduxFilters.startDate)
        : null;
      const endDate = reduxFilters.endDate
        ? new Date(reduxFilters.endDate)
        : null;

      if (startDate) {
        startDate.setHours(0, 0, 0, 0);
      }
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      const matchDate =
        (!startDate || empDate >= startDate) &&
        (!endDate || empDate <= endDate);

      const matchDepartment =
        reduxFilters.department.length === 0 ||
        reduxFilters.department.includes(emp.department);

      const matchDesignation =
        reduxFilters.designation.length === 0 ||
        reduxFilters.designation.includes(emp.designation);

      const matchLocation =
        reduxFilters.location.length === 0 ||
        reduxFilters.location.includes(emp.location);
      return matchDate && matchDepartment && matchDesignation && matchLocation;
    });
  }, [employees, reduxFilters]);

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
            { id: toastId }
          );
          dispatch(
            fetchEmployees({
              page: currentPage,
              limit: currentLimit,
              search: currentSearch,
            })
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
          });
          dispatch(
            fetchEmployees({
              page: currentPage,
              limit: currentLimit,
              search: currentSearch,
            })
          );
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
          });
          dispatch(
            fetchEmployees({
              page: currentPage,
              limit: currentLimit,
              search: currentSearch,
            })
          );
          break;

        case "Invite":
        case "Re-invite":
          await dispatch(sendInviteEmail(employeeForModal.code)).unwrap();
          toast.dismiss(toastId);
          dispatch(
            fetchEmployees({
              page: currentPage,
              limit: currentLimit,
              search: currentSearch,
            })
          );
          break;

        default:
          toast.dismiss(toastId);
          break;
      }
    } catch (err: any) {
      toast.error(
        String(err) || `Failed to perform action: ${actionToConfirm}`,
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

  const totalPages = Math.ceil(total / currentLimit) || 1;

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("limit", e.target.value);
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", String(newPage));
        return newParams;
      });
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
    if (loading && employees.length === 0) {
      return <TableSkeleton rows={currentLimit} />;
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
      <>
        <Table
          key={currentLimit}
          defaultItemsPerPage={currentLimit}
          data={filteredEmployees}
          columns={columns}
          className="[&_.table-controls]:hidden w-[75vw] text-sm"
          showPagination={false}
          showSearch={false}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={total}
          itemsPerPage={currentLimit}
          onPageChange={handlePageChange}
        />
      </>
    );
  };
  //main JSX
  return (
    <div className="px-4 py-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Employees List</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
        <div className="flex justify-between items-center flex-wrap mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/employees/create")}
              className="bg-[#741CDD] hover:bg-[#5b14a9] text-white px-4 py-2 text-sm rounded transition duration-200"
            >
              + NEW EMPLOYEE
            </button>
            <div className="flex items-center gap-2">
              <label
                htmlFor="limit-select"
                className="text-sm font-medium text-gray-700"
              >
                Show
              </label>
              <select
                id="limit-select"
                value={currentLimit}
                onChange={handleLimitChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#741CDD]"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm font-medium text-gray-700">entries</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or code..."
                className="border border-gray-300 rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#741CDD]"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-[#741CDD] rounded hover:bg-[#5b14a9] text-white p-2 text-sm transition duration-200"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">{renderTableContent()}</div>
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
