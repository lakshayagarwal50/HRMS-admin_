import React, { useState, useRef, useEffect } from "react";
// import Table, { type Column } from "../Table/Table";
import Table, { type Column } from "../../../components/layout/Table";
import { MoreVertical } from "lucide-react";
import Modal from "../../../components/layout/Modal";

interface Employee {
  code: string;
  name: string;
  date: string;
  designation: string;
  department: string;
  location: string;
  payslip: string;
  gender: string;
  status: string;
}

interface ActionDropdownProps {
  employee: Employee;
  onAction: (actionName: string, employee: Employee) => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  employee,
  onAction,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    "View Details",
    "Create Payslip",
    employee.status === "Active" ? "Make Inactive" : "Make Active",
    "Delete",
    employee.status === "Inactive" ? "Re-invite" : "Invite",
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none flex flex-col">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                setOpen(false);
                onAction(action, employee);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-[#f5f5f5]"
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const EmployeesTable: React.FC = () => {
  const [employeesData, setEmployeesData] = useState<Employee[]>([
    {
      code: "1651",
      name: "Cody Fisher",
      date: "15 Feb 2022",
      designation: "Designing",
      department: "Designing",
      location: "Noida",
      payslip: "Default",
      gender: "Male",
      status: "Active",
    },
    {
      code: "8541",
      name: "Ralph Edwards",
      date: "10 Jan 2022",
      designation: "Development",
      department: "Development",
      location: "Noida",
      payslip: "Default",
      gender: "Male",
      status: "Active",
    },
    {
      code: "8541",
      name: "Ralph Edwards",
      date: "05 Feb 2019",
      designation: "Development",
      department: "Development",
      location: "Jaipur",
      payslip: "Group 1",
      gender: "Male",
      status: "Active",
    },
    {
      code: "8541",
      name: "Ralph Edwards",
      date: "21 Dec 2020",
      designation: "Development",
      department: "Development",
      location: "Jaipur",
      payslip: "Group 1",
      gender: "Male",
      status: "Active",
    },
    {
      code: "8542",
      name: "Robert Fox",
      date: "30 Sep 2021",
      designation: "Development",
      department: "Development",
      location: "Noida",
      payslip: "Group 1",
      gender: "Male",
      status: "Inactive",
    },
    {
      code: "8542",
      name: "Robert Fox",
      date: "20 Oct 2021",
      designation: "Development",
      department: "Development",
      location: "Noida",
      payslip: "Group 1",
      gender: "Male",
      status: "Inactive",
    },
    {
      code: "8542",
      name: "Robert Fox",
      date: "05 Feb 2019",
      designation: "Development",
      department: "Development",
      location: "Jaipur",
      payslip: "Group 1",
      gender: "Male",
      status: "Inactive",
    },
    {
      code: "1152",
      name: "Arlene McCoy",
      date: "21 Dec 2020",
      designation: "Management",
      department: "Project Manager",
      location: "Noida",
      payslip: "Default",
      gender: "Female",
      status: "Active",
    },
    {
      code: "1152",
      name: "Arlene McCoy",
      date: "20 Oct 2021",
      designation: "Management",
      department: "Project Manager",
      location: "Jaipur",
      payslip: "Default",
      gender: "Female",
      status: "Inactive",
    },
    {
      code: "1152",
      name: "Arlene McCoy",
      date: "15 Feb 2022",
      designation: "Management",
      department: "Project Manager",
      location: "Noida",
      payslip: "Default",
      gender: "Female",
      status: "Active",
    },
  ]);

  // Modal State
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

  // Filter sidebar state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    departments: [] as string[],
    designations: [] as string[],
    location: "",
  });

  const handleAction = (actionName: string, employee: Employee) => {
    setEmployeeForModal(employee);
    setActionToConfirm(actionName);

    switch (actionName) {
      case "Delete":
        setModalType("error");
        setModalTitle("Delete Employee?");
        setModalMessage(
          `Are you absolutely sure you want to delete employee ${employee.name} (${employee.code})? This action cannot be undone.`
        );
        setIsModalOpen(true);
        break;
      case "Invite":
        setModalType("info");
        setModalTitle("Invite User?");
        setModalMessage(
          `Do you want to send an invitation to employee ${employee.name} (${employee.code}) for login?`
        );
        setIsModalOpen(true);
        break;
      case "Re-invite":
        setModalType("warning");
        setModalTitle("Re-invite User?");
        setModalMessage(
          `Are you sure you want to re-send the invitation to employee ${employee.name} (${employee.code})?`
        );
        setIsModalOpen(true);
        break;
      case "Make Inactive":
        setModalType("warning");
        setModalTitle("Make Inactive?");
        setModalMessage(
          `Are you sure you want to make employee ${employee.name} (${employee.code}) inactive?`
        );
        setIsModalOpen(true);
        break;
      case "Make Active":
        setModalType("info");
        setModalTitle("Make Active?");
        setModalMessage(
          `Are you sure you want to make employee ${employee.name} (${employee.code}) active?`
        );
        setIsModalOpen(true);
        break;
      default:
        alert(`${actionName} clicked for ${employee.name}`);
        break;
    }
  };

  const handleConfirmAction = () => {
    if (employeeForModal && actionToConfirm) {
      console.log(
        `Confirming ${actionToConfirm} for employee:`,
        employeeForModal
      );

      if (actionToConfirm === "Delete") {
        setEmployeesData(
          employeesData.filter((emp) => emp.code !== employeeForModal.code)
        );
        alert(`Employee ${employeeForModal.name} deleted.`);
      } else if (
        actionToConfirm === "Invite" ||
        actionToConfirm === "Re-invite"
      ) {
        alert(`Invitation sent to ${employeeForModal.name}.`);
      } else if (actionToConfirm === "Make Inactive") {
        setEmployeesData(
          employeesData.map((emp) =>
            emp.code === employeeForModal.code
              ? { ...emp, status: "Inactive" }
              : emp
          )
        );
        alert(`Employee ${employeeForModal.name} made inactive.`);
      } else if (actionToConfirm === "Make Active") {
        setEmployeesData(
          employeesData.map((emp) =>
            emp.code === employeeForModal.code
              ? { ...emp, status: "Active" }
              : emp
          )
        );
        alert(`Employee ${employeeForModal.name} made active.`);
      }
    }
    setIsModalOpen(false);
    setEmployeeForModal(null);
    setActionToConfirm(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEmployeeForModal(null);
    setActionToConfirm(null);
  };

  const filteredEmployees = employeesData.filter((emp) => {
    const empDate = new Date(
      emp.date.replace(/(\d{2}) (\w{3}) (\d{4})/, "$2 $1, $3")
    );

    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    const matchDate =
      (!startDate || empDate >= startDate) && (!endDate || empDate <= endDate);

    const matchDepartment =
      filters.departments.length === 0 ||
      filters.departments.includes(emp.department);

    const matchDesignation =
      filters.designations.length === 0 ||
      filters.designations.includes(emp.designation);

    const matchLocation =
      !filters.location ||
      emp.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchDate && matchDepartment && matchDesignation && matchLocation;
  });

  const uniqueDepartments = Array.from(
    new Set(employeesData.map((emp) => emp.department))
  );
  const uniqueDesignations = Array.from(
    new Set(employeesData.map((emp) => emp.designation))
  );

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

  return (
    // This div will now correctly fill the space provided by App.tsx's lg:ml-72.
    // We've removed 'container mx-auto' to avoid double-centering/padding.
    // 'px-4 py-6' provides the desired internal padding.
    <div className="px-4 py-6 w-full">
      {" "}
      {/* MODIFIED: Removed 'container mx-auto' */}
      {/* This is the white box with shadow and internal padding that holds the table and controls */}
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Employees
          </h2>
          <div className="text-sm text-gray-500 space-x-1">
            <a href="#" className="text-[#BA2BE2] hover:underline">
              Dashboard
            </a>{" "}
            /{" "}
            <a href="#" className="text-[#BA2BE2] hover:underline">
              Employee Setup
            </a>{" "}
            /{" "}
            <a href="#" className="text-[#BA2BE2] hover:underline">
              List
            </a>
          </div>
        </div>

        {/* Action buttons and Filter */}
        <div className="flex justify-between items-center flex-wrap mb-4">
          <button className="bg-[#BA2BE2] hover:bg-[#a71ad9] text-white px-4 py-2 text-sm rounded transition duration-200">
            + NEW EMPLOYEE
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="border border-[#BA2BE2] text-[#BA2BE2] hover:bg-[#f5e8fc] px-4 py-2 text-sm rounded transition duration-200"
          >
            Filter
          </button>
        </div>

        {/* Table Wrapper for Responsiveness */}
        {/* This div is crucial for horizontal scrolling if table content overflows */}
        <div className="overflow-x-auto">
          <Table
            data={filteredEmployees} // Render filtered data
            columns={columns}
            className="w-[70vw] text-sm"
          />
        </div>
      </div>
      {/* Filter Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end animate-fade-in-right">
          <div className="bg-white w-full sm:w-96 h-full shadow-lg p-6 relative overflow-y-auto transform translate-x-0 transition-transform duration-300 ease-out">
            {/* Close button */}
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Filter Employees
            </h2>

            {/* Joining Date */}
            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block font-medium text-sm text-gray-700 mb-1"
              >
                Joining Date (From)
              </label>
              <input
                type="date"
                id="startDate"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block font-medium text-sm text-gray-700 mb-1"
              >
                Joining Date (To)
              </label>
              <input
                type="date"
                id="endDate"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent"
              />
            </div>

            {/* Department */}
            <div className="mb-4">
              <label
                htmlFor="department"
                className="block font-medium text-sm text-gray-700 mb-1"
              >
                Department
              </label>
              <select
                id="department"
                multiple
                value={filters.departments}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    departments: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent h-32"
              >
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div className="mb-4">
              <label
                htmlFor="designation"
                className="block font-medium text-sm text-gray-700 mb-1"
              >
                Designation
              </label>
              <select
                id="designation"
                multiple
                value={filters.designations}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    designations: Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    ),
                  })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent h-32"
              >
                {uniqueDesignations.map((desig) => (
                  <option key={desig} value={desig}>
                    {desig}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block font-medium text-sm text-gray-700 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#BA2BE2] focus:border-transparent"
                placeholder="e.g., Noida"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() =>
                  setFilters({
                    startDate: "",
                    endDate: "",
                    departments: [],
                    designations: [],
                    location: "",
                  })
                }
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition duration-200"
              >
                CLEAR
              </button>
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                }}
                className="bg-[#BA2BE2] hover:bg-[#a71ad9] text-white px-6 py-2 rounded-md text-sm transition duration-200"
              >
                APPLY FILTERS
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Generic Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleConfirmAction}
        type={modalType}
      />
    </div>
  );
};

export default EmployeesTable;
