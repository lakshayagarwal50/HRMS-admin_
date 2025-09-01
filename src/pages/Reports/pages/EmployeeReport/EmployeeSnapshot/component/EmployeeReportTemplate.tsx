
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../../../../services";
import { isAxiosError } from "axios";
import Table, { type Column } from "../../../../../../components/common/Table";
import Modal from "../../../../../../components/common/NotificationModal";


interface TemplateField {
  id: number;
  s_no: number;
  name: string;
  isEnabled: boolean;
}

const newFieldNames = [
  "name",
  "emp_id",
  "status",
  "joining_date",
  "designation",
  "department",
  "location",
  "gender",
  "email",
  "pan",
  "gross_salary",
  "lossOfPay",
  "taxPaid",
  "netPay",
  "leave",
  "leaveAdjustment",
  "leaveBalance",
  "workingPattern",
  "phone",
];

const initialFields: TemplateField[] = newFieldNames.map((name, index) => ({
  id: index + 1,
  s_no: index + 1,
  name: name,
  isEnabled: true, 
}));


interface EmployeeReportTemplateProps {
  onBack: () => void;
  templateId: string | null;
}

const EmployeeReportTemplate: React.FC<EmployeeReportTemplateProps> = ({
  onBack,
  templateId,
}) => {
  const [fields, setFields] = useState<TemplateField[]>(initialFields);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning" as "warning" | "info" | "success" | "error",
  });


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
      title: "Do you want to continue with saving?",
      message:
        "This will update report template settings and sequence as you select",
      onConfirm: confirmUpdate,
      type: "warning",
    });
  };

  const handleRefreshClick = () => {
    setFields(initialFields);
    toast.success("Template has been reset to default.");
  };

  const confirmUpdate = async () => {
    closeModal();
    if (!templateId) {
      toast.error("Template ID is missing. Cannot update.");
      return;
    }

    const updatedTemplate = fields.reduce((acc, field) => {
      acc[field.name] = field.isEnabled;
      return acc;
    }, {} as Record<string, boolean>);

    const toastId = toast.loading("Updating template...");

    try {
      const response = await axiosInstance.patch(
        `/report/updateTemplate/employeeSnapshot/${templateId}`,
        updatedTemplate
      );

      toast.success(response.data.message || "Template updated successfully!", {
        id: toastId,
      });
      onBack();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update template.",
          { id: toastId }
        );
      } else {
        toast.error("An unknown error occurred.", { id: toastId });
      }
    }
  };

  const columns: Column<TemplateField>[] = [
    { key: "s_no", header: "S no.", className: "w-1/12" },
    {
      key: "name",
      header: "Field Name",
      className: "w-9/12 font-mono text-sm",
    },
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
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Employees Snapshot Report Template
        </h1>
        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link> {" / "}
          <Link to="/reports/all">All Reports</Link> {" / "}
          Employee Snapshot Report Template
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm flex-grow">
        <Table
          data={fields}
          columns={columns}
          showSearch={false}
          showPagination={false}
          defaultItemsPerPage={fields.length}
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
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </div>
  );
};

export default EmployeeReportTemplate;
