import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import toast from "react-hot-toast";
import Table, { type Column } from "../../../../../../components/common/Table";
import Modal from "../../../../../../components/common/NotificationModal";
import { axiosInstance } from "../../../../../../services"; 

// interface
interface TemplateField {
  id: number;
  s_no: number;
  name: string; 
  label: string; 
  value: string; 
  isEnabled: boolean;
}

const masterFieldList: TemplateField[] = [
  { id: 1, s_no: 1, name: "name", label: "Name", value: "", isEnabled: false },
  {
    id: 2,
    s_no: 2,
    name: "emp_id",
    label: "Employee ID",
    value: "",
    isEnabled: false,
  },
  {
    id: 3,
    s_no: 3,
    name: "status",
    label: "Status",
    value: "",
    isEnabled: false,
  },
  {
    id: 4,
    s_no: 4,
    name: "designation",
    label: "Designation",
    value: "",
    isEnabled: false,
  },
  {
    id: 5,
    s_no: 5,
    name: "department",
    label: "Department",
    value: "",
    isEnabled: false,
  },
  {
    id: 6,
    s_no: 6,
    name: "location",
    label: "Location",
    value: "",
    isEnabled: false,
  },
  {
    id: 7,
    s_no: 7,
    name: "basic",
    label: "Basic",
    value: "",
    isEnabled: false,
  },
  { id: 8, s_no: 8, name: "hra", label: "HRA", value: "", isEnabled: false },
  {
    id: 9,
    s_no: 9,
    name: "totalEarning",
    label: "Total Earning",
    value: "",
    isEnabled: false,
  },
  {
    id: 10,
    s_no: 10,
    name: "totalDeduction",
    label: "Total Deduction",
    value: "",
    isEnabled: false,
  },
  {
    id: 11,
    s_no: 11,
    name: "pt",
    label: "Professional Tax (PT)",
    value: "",
    isEnabled: false,
  },
  {
    id: 12,
    s_no: 12,
    name: "conveyance",
    label: "Conveyance",
    value: "",
    isEnabled: false,
  },
  {
    id: 13,
    s_no: 13,
    name: "pf",
    label: "Provident Fund (PF)",
    value: "",
    isEnabled: false,
  },
  {
    id: 14,
    s_no: 14,
    name: "eesi",
    label: "EESI",
    value: "",
    isEnabled: false,
  },
  {
    id: 15,
    s_no: 15,
    name: "epf",
    label: "Employer Provident Fund (EPF)",
    value: "",
    isEnabled: false,
  },
  { id: 16, s_no: 16, name: "esi", label: "ESI", value: "", isEnabled: false },
];

interface PayslipSummaryTemplateProps {
  onBack?: () => void;
}

//main body
const PayslipSummaryTemplate: React.FC<PayslipSummaryTemplateProps> = ({
  onBack,
}) => {
  const [fields, setFields] = useState<TemplateField[]>(masterFieldList);
  const [isLoading, setIsLoading] = useState(false); 
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning" as "warning" | "info" | "success" | "error",
  });

  const templateId = "YQTEAMoC0FF9GCmLtL3W"; 

  
  const fetchTemplateData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/report/getTemplate/${templateId}`
      );
      const templateData = response.data;

      const updatedFields = masterFieldList.map((field) => ({
        ...field,
        isEnabled: templateData[field.name] ?? false, 
      }));
      setFields(updatedFields);
    } catch (error) {
      console.error("Failed to fetch template:", error);
      toast.error("Could not load template settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplateData();
  }, []); 

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
      title: "Confirm Update",
      message:
        "This will save the current settings for the Payslip Summary template. Are you sure?",
      onConfirm: confirmUpdate,
      type: "warning",
    });
  };

  const handleRefreshClick = () => {
    setModalState({
      isOpen: true,
      title: "Confirm Refresh",
      message:
        "This will reset your changes to the last saved settings. Continue?",
      onConfirm: confirmRefresh,
      type: "warning",
    });
  };

  const confirmUpdate = async () => {
    closeModal();
    setIsLoading(true);

    const payload = fields.reduce((acc, field) => {
      acc[field.name] = field.isEnabled;
      return acc;
    }, {} as Record<string, boolean>);

    try {
      await axiosInstance.patch(
        `/report/updateTemplate/payslip/${templateId}`,
        payload
      );
      toast.success("Template updated successfully!");
      onBack && onBack(); 
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRefresh = () => {
    closeModal();
    fetchTemplateData(); 
    toast("Template has been refreshed.");
  };

  const columns: Column<TemplateField>[] = [
    { key: "s_no", header: "S no.", className: "w-1/12" },
    { key: "label", header: "Field Name", className: "w-9/12" },
    {
      key: "action",
      header: "Enable / Disable",
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
        <h1 className="text-3xl font-bold text-gray-800">
          Payslip Summary Template
        </h1>
        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link>
          {" / "}
          <Link to="/reports/scheduled">Scheduled Reports</Link>
          {" / "}
          Payslip Summary Template
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {isLoading && fields.every((f) => !f.isEnabled) ? (
          <p className="text-center p-10 text-gray-500">Loading Template...</p>
        ) : (
          <Table
            data={fields}
            columns={columns}
            showSearch={false}
            showPagination={false}
          />
        )}
      </div>

      <div className="mt-8 flex items-center space-x-4">
        <button
          onClick={handleUpdateClick}
          disabled={isLoading} 
          className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isLoading ? "SAVING..." : "UPDATE"}
        </button>
        <button
          onClick={handleRefreshClick}
          disabled={isLoading}
          className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          REFRESH
        </button>
        <button
          onClick={onBack}
          disabled={isLoading}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
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
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </div>
  );
};

export default PayslipSummaryTemplate;
