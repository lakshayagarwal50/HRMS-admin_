import React, { useState } from "react";
import Table, { type Column } from "../../../../../../components/common/Table"; 
import { Check } from "lucide-react";
import Modal from "../../../../../../components/common/NotificationModal"; 
import { Link } from "react-router-dom";

interface TemplateField {
  id: number;
  s_no: number;
  name: string;
  label: string;
  value: string;
  isEnabled: boolean;
}

const initialFields: TemplateField[] = [
  {
    id: 1,
    s_no: 1,
    name: "std_deduction",
    label: "STD_DEDUCTION",
    value: "",
    isEnabled: true,
  },
  {
    id: 2,
    s_no: 2,
    name: "sec_10_13a",
    label: "10(13A)",
    value: "",
    isEnabled: true,
  },
  { id: 3, s_no: 3, name: "sec_80c", label: "80C", value: "", isEnabled: true },
  { id: 4, s_no: 4, name: "sec_80d", label: "80D", value: "", isEnabled: true },
  {
    id: 5,
    s_no: 5,
    name: "sec_80u",
    label: "80U",
    value: "",
    isEnabled: false,
  },
  {
    id: 6,
    s_no: 6,
    name: "sec_80e",
    label: "80E",
    value: "",
    isEnabled: false,
  },
  {
    id: 7,
    s_no: 7,
    name: "sec_24b",
    label: "24B",
    value: "",
    isEnabled: false,
  },
];

interface DeclarationReportTemplateProps {
  onBack: () => void;
}

const declarationReportTemplate: React.FC<DeclarationReportTemplateProps> = ({
  onBack,
}) => {
  const [fields, setFields] = useState<TemplateField[]>(initialFields);

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

 
  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  const handleUpdateClick = () => {
    setModalState({
      isOpen: true,
      title: "Update Template?",
      message:
        "This will save the current configuration for the report template.",
      onConfirm: confirmUpdate,
      type: "info",
    });
  };

  const handleRefreshClick = () => {
    setModalState({
      isOpen: true,
      title: "Refresh Template?",
      message:
        "Are you sure you want to discard your changes and reset the template?",
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
          Declarations Report Template
        </h1>
       
        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link>
          {" / "}
          <Link to="/reports/all">All Reports</Link>
          {" / "}
          Declarations Report Template
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

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </div>
  );
};

export default declarationReportTemplate;
