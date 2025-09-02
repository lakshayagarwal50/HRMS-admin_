
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { toast } from "react-toastify";
import Table, { type Column } from "../../../../../../components/common/Table";
import Modal from "../../../../../../components/common/NotificationModal";
import { useAppDispatch, useAppSelector } from "../../../../../../store/hooks";
import {
  updateEmployeeSnapshotTemplate,
  fetchTemplateSettings,
  type SnapshotTemplateConfig,
} from "../../../../../../store/slice/employeeSnapshotSlice";

interface TemplateField {
  id: number;
  s_no: number;
  name: string;
  label: string;
  isEnabled: boolean;
}

const masterFieldList: TemplateField[] = [
  { id: 1, s_no: 1, name: "name", label: "Name", isEnabled: true },
  { id: 2, s_no: 2, name: "emp_id", label: "Employee ID", isEnabled: true },
  { id: 3, s_no: 3, name: "status", label: "Status", isEnabled: true },
  {
    id: 4,
    s_no: 4,
    name: "joining_date",
    label: "Joining Date",
    isEnabled: true,
  },
  {
    id: 5,
    s_no: 5,
    name: "designation",
    label: "Designation",
    isEnabled: true,
  },
  { id: 6, s_no: 6, name: "department", label: "Department", isEnabled: true },
  { id: 7, s_no: 7, name: "location", label: "Location", isEnabled: true },
  { id: 8, s_no: 8, name: "gender", label: "Gender", isEnabled: true },
  { id: 9, s_no: 9, name: "email", label: "Email", isEnabled: true },
  { id: 10, s_no: 10, name: "pan", label: "PAN Number", isEnabled: true },
  {
    id: 11,
    s_no: 11,
    name: "gross_salary",
    label: "Gross Salary",
    isEnabled: true,
  },
  {
    id: 12,
    s_no: 12,
    name: "lossOfPay",
    label: "Loss of Pay",
    isEnabled: true,
  },
  { id: 13, s_no: 13, name: "taxPaid", label: "Tax Paid", isEnabled: true },
  { id: 14, s_no: 14, name: "netPay", label: "Net Pay", isEnabled: true },
  {
    id: 15,
    s_no: 15,
    name: "leave",
    label: "Last Leave Type",
    isEnabled: true,
  },
  {
    id: 16,
    s_no: 16,
    name: "leaveAdjustment",
    label: "Leaves Adjusted",
    isEnabled: true,
  },
  {
    id: 17,
    s_no: 17,
    name: "leaveBalance",
    label: "Leave Balance",
    isEnabled: true,
  },
  {
    id: 18,
    s_no: 18,
    name: "workingPattern",
    label: "Working Pattern",
    isEnabled: true,
  },
  { id: 19, s_no: 19, name: "phone", label: "Phone Number", isEnabled: true },
];

interface EmployeeReportTemplateProps {
  onBack: () => void;
}

const EmployeeReportTemplate: React.FC<EmployeeReportTemplateProps> = ({
  onBack,
}) => {
  const [fields, setFields] = useState<TemplateField[]>(masterFieldList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { templateId, templateData, status } = useAppSelector(
    (state) => state.employeeSnapshot
  );

  useEffect(() => {
    if (templateId) {
      dispatch(fetchTemplateSettings(templateId));
    }
  }, [dispatch, templateId]);

  useEffect(() => {
    if (templateData) {
      const updatedFields = masterFieldList.map((field) => ({
        ...field,
        isEnabled: templateData[field.name] ?? false,
      }));
      setFields(updatedFields);
    }
  }, [templateData]);

  const handleCheckboxChange = (id: number) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, isEnabled: !field.isEnabled } : field
      )
    );
  };

  const handleUpdateClick = () => setIsModalOpen(true);

  const confirmRefresh = () => {
    if (templateId) {
      dispatch(fetchTemplateSettings(templateId));
      toast.info("Template has been reset to the last saved state.");
    }
  };

  const confirmUpdate = () => {
    if (!templateId) {
      toast.error("Template ID not found.");
      setIsModalOpen(false);
      return;
    }
    const payload: SnapshotTemplateConfig = fields.reduce((acc, field) => {
      acc[field.name] = field.isEnabled;
      return acc;
    }, {} as SnapshotTemplateConfig);

    dispatch(updateEmployeeSnapshotTemplate({ id: templateId, data: payload }))
      .unwrap()
      .then(() => onBack && onBack())
      .catch((err) => console.error("Template update failed:", err));

    setIsModalOpen(false);
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
        />
      </div>
      <div className="mt-8 flex items-center space-x-4">
        <button
          onClick={handleUpdateClick}
          disabled={status === "loading"}
          className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "UPDATING..." : "UPDATE"}
        </button>
        <button
          onClick={confirmRefresh}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmUpdate}
        title="Confirm Update"
        message="This will save the current template settings for the Employee Snapshot report. Are you sure?"
        type="warning"
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </div>
  );
};

export default EmployeeReportTemplate;
