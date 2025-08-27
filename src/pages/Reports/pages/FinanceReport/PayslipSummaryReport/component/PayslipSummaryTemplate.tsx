import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Table, { type Column } from "../../../../../../components/common/Table"; // Adjust path as needed
import Modal from "../../../../../../components/common/NotificationModal"; // Adjust path as needed

// Define the type for each field in the template
interface TemplateField {
  id: number;
  s_no: number;
  name: string; // The data key
  label: string; // The user-friendly label
  value: string; // The custom value from the input field
  isEnabled: boolean;
}

// --- CHANGE HERE: New fields specific to the Payslip Summary ---
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
    name: "department_name",
    label: "Department",
    value: "",
    isEnabled: true,
  },
  { id: 5, s_no: 5, name: "basic", label: "Basic", value: "", isEnabled: true },
  { id: 6, s_no: 6, name: "hra", label: "HRA", value: "", isEnabled: true },
  {
    id: 7,
    s_no: 7,
    name: "conveyance",
    label: "Conveyance",
    value: "",
    isEnabled: false,
  },
  {
    id: 8,
    s_no: 8,
    name: "gross_paid",
    label: "Gross Paid",
    value: "",
    isEnabled: false,
  },
  {
    id: 9,
    s_no: 9,
    name: "loss_of_pay",
    label: "Loss of Pay",
    value: "",
    isEnabled: false,
  },
  {
    id: 10,
    s_no: 10,
    name: "net_paid",
    label: "Net Paid",
    value: "",
    isEnabled: false,
  },
  {
    id: 11,
    s_no: 11,
    name: "provident_fund",
    label: "Provident Fund",
    value: "",
    isEnabled: false,
  },
  {
    id: 12,
    s_no: 12,
    name: "total_deductions",
    label: "Total Deductions",
    value: "",
    isEnabled: false,
  },
  {
    id: 13,
    s_no: 13,
    name: "bank_name",
    label: "Bank Name",
    value: "",
    isEnabled: false,
  },
  {
    id: 14,
    s_no: 14,
    name: "account_number",
    label: "Account Number",
    value: "",
    isEnabled: false,
  },
];

// Props can be defined if needed, for example, an onBack function
interface PayslipSummaryTemplateProps {
  onBack?: () => void;
}

const PayslipSummaryTemplate: React.FC<PayslipSummaryTemplateProps> = ({
  onBack,
}) => {
  const [fields, setFields] = useState<TemplateField[]>(initialFields);

  // Reused state logic for modal management
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning" as "warning" | "info" | "success" | "error",
  });

  // Reused handler functions
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

  // --- Modal Logic (Copied directly from your reference) ---
  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  const handleUpdateClick = () => {
    setModalState({
      isOpen: true,
      title: "Do you want to continue with savings?",
      message:
        "This will update report template settings and sequence as you select.",
      onConfirm: confirmUpdate,
      type: "warning",
    });
  };

  const handleRefreshClick = () => {
    setModalState({
      isOpen: true,
      title: "Do you want to refresh the page?",
      message:
        "This will refresh the page and any changes you made will not be saved.",
      onConfirm: confirmRefresh,
      type: "warning",
    });
  };

  const confirmUpdate = () => {
    console.log("Saving updated fields:", fields);
    // You can add your API call here
    closeModal();
  };

  const confirmRefresh = () => {
    setFields(initialFields);
    closeModal();
  };

  // Reused column definition for the table
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
          value={row.value || row.label} // Show original label if custom value is empty
          onChange={(e) => handleLabelChange(row.id, e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-500"
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
          <div className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center peer-checked:bg-[#741CDD] peer-checked:border-[#741CDD] transition-colors">
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
        {/* --- CHANGE HERE: Updated Title --- */}
        <h1 className="text-3xl font-bold text-gray-800">
          Payslip Summary Template
        </h1>

        {/* --- CHANGE HERE: Updated Breadcrumbs --- */}
        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link>
          {" / "}
          <Link to="/reports/scheduled">Scheduled Reports</Link>
          {" / "}
          Payslip Summary Template
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
        {/* Reused buttons with copied onClick handlers */}
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

      {/* Reused Modal component for confirmations */}
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

export default PayslipSummaryTemplate;
