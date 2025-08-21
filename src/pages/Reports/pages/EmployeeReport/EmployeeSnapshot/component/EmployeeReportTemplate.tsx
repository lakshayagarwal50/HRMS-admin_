import React, { useState } from "react";
import Table, { type Column } from "../../../../../../components/common/Table"; // Adjust path as needed
import { Check } from "lucide-react";
import Modal from "../../../../../../components/common/NotificationModal";
import { Link } from "react-router-dom"; // 1. Import the reusable Modal component

// Define the type for each field in the template
interface TemplateField {
  id: number;
  s_no: number;
  name: string;
  label: string;
  value: string;
  isEnabled: boolean;
}

// Initial mock data for the template fields
const initialFields: TemplateField[] = [
  {
    id: 1,
    s_no: 1,
    name: "employee_name",
    label: "Name",
    value: "",
    isEnabled: true,
  },
  {
    id: 2,
    s_no: 2,
    name: "employee_number",
    label: "Employee ID",
    value: "",
    isEnabled: true,
  },
  {
    id: 3,
    s_no: 3,
    name: "employee_status",
    label: "Status",
    value: "",
    isEnabled: true,
  },
  {
    id: 4,
    s_no: 4,
    name: "designation_name",
    label: "Designation",
    value: "",
    isEnabled: false,
  },
  {
    id: 5,
    s_no: 5,
    name: "department_name",
    label: "Department",
    value: "",
    isEnabled: false,
  },
  {
    id: 6,
    s_no: 6,
    name: "location_name",
    label: "Location",
    value: "",
    isEnabled: false,
  },
  {
    id: 7,
    s_no: 7,
    name: "employee_gender",
    label: "Gender",
    value: "",
    isEnabled: false,
  },
  {
    id: 8,
    s_no: 8,
    name: "employee_email_primary",
    label: "Email Primary",
    value: "",
    isEnabled: false,
  },
  {
    id: 9,
    s_no: 9,
    name: "group_name",
    label: "Group",
    value: "",
    isEnabled: false,
  },
  {
    id: 10,
    s_no: 10,
    name: "attendance_status",
    label: "Status",
    value: "",
    isEnabled: false,
  },
];

interface EmployeeReportTemplateProps {
  onBack: () => void;
}

const EmployeeReportTemplate: React.FC<EmployeeReportTemplateProps> = ({
  onBack,
}) => {
  const [fields, setFields] = useState<TemplateField[]>(initialFields);

  // 2. Add state to manage the modal's content and visibility
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning" as "warning" | "info" | "success" | "error",
  });

  const handleLabelChange = (id: number, newValue: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  const handleCheckboxChange = (id: number) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, isEnabled: !field.isEnabled } : field
      )
    );
  };

  // --- Modal Logic ---
  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  const handleUpdateClick = () => {
    setModalState({
      isOpen: true,
      title: "Do you want to continue with savings?",
      message:
        "This will update report template settings and sequence as you select",
      onConfirm: confirmUpdate,
      type: "warning",
    });
  };

  const handleRefreshClick = () => {
    setModalState({
      isOpen: true,
      title: "Do you want to refresh page?",
      message:
        "This will refresh the page and whatever you changed will not save",
      onConfirm: confirmRefresh,
      type: "warning",
    });
  };

  const confirmUpdate = () => {
    console.log("Saving updated fields:", fields);
    alert("Template updated successfully!");
    closeModal();
  };

  const confirmRefresh = () => {
    setFields(initialFields);
    alert("Template has been refreshed.");
    closeModal();
  };

  const columns: Column<TemplateField>[] = [
    { key: "s_no", header: "S no.", className: "w-1/12" },
    { key: "name", header: "Name", className: "w-4/12 font-mono text-sm" },
    {
      key: "label",
      header: "Label",
      className: "w-5/12",
      render: (row) => (
        <input
          type="text"
          placeholder={row.label}
          value={row.value}
          onChange={(e) => handleLabelChange(row.id, e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      ),
    },
    {
      key: "action",
      header: "Action",
      className: "w-2/12 text-center",
      render: (row) => (
        <label className="flex justify-center items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.isEnabled}
            onChange={() => handleCheckboxChange(row.id)}
            className="sr-only peer"
          />
          <div className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center peer-checked:bg-[#741CDD] peer-checked:border-[#741CDD]">
            <Check
              size={16}
              className={`text-white ${
                row.isEnabled ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </label>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Employees Summary Report Template
        </h1>
        
        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link>
          {" / "}
          <Link to="/reports/all">All Reports</Link>
          {" / "}
          Employee Summary Report Template
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Table
          data={fields}
          columns={columns}
          showSearch={false}
          showPagination={false}
        />
      </div>

      <div className="mt-8 flex items-center space-x-4">
        {/* 3. Wire up the new onClick handlers */}
        <button
          onClick={handleUpdateClick}
          className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          UPDATE
        </button>
        <button
          onClick={handleRefreshClick}
          className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          REFRESH
        </button>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
        >
          BACK
        </button>
      </div>

      {/* 4. Render the Modal component */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </div>
  );
};

export default EmployeeReportTemplate;
