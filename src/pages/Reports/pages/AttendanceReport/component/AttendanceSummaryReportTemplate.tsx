// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { Check } from "lucide-react";
// import Table, { type Column } from "../../../../../components/common/Table"; // Adjust path as needed
// import Modal from "../../../../../components/common/NotificationModal"; // Adjust path as needed

// // Define the type for each field in the template
// interface TemplateField {
//   id: number;
//   s_no: number;
//   name: string;
//   label: string;
//   value: string;
//   isEnabled: boolean;
// }

// // Data specific to an Attendance Summary Report
// const initialFields: TemplateField[] = [
//   {
//     id: 1,
//     s_no: 1,
//     name: "employee_name",
//     label: "Name",
//     value: "",
//     isEnabled: true,
//   },
//   {
//     id: 2,
//     s_no: 2,
//     name: "employee_id",
//     label: "Employee ID",
//     value: "",
//     isEnabled: true,
//   },
//   {
//     id: 3,
//     s_no: 3,
//     name: "status",
//     label: "Status",
//     value: "",
//     isEnabled: true,
//   },
//   {
//     id: 4,
//     s_no: 4,
//     name: "attendance_type",
//     label: "Attendance Type",
//     value: "",
//     isEnabled: true,
//   },
//   { id: 5, s_no: 5, name: "date", label: "Date", value: "", isEnabled: true },
//   {
//     id: 6,
//     s_no: 6,
//     name: "in_time",
//     label: "In Time",
//     value: "",
//     isEnabled: false,
//   },
//   {
//     id: 7,
//     s_no: 7,
//     name: "out_time",
//     label: "Out Time",
//     value: "",
//     isEnabled: false,
//   },
//   {
//     id: 8,
//     s_no: 8,
//     name: "time_spent",
//     label: "Time Spent",
//     value: "",
//     isEnabled: false,
//   },
//   {
//     id: 9,
//     s_no: 9,
//     name: "late_by",
//     label: "Late by",
//     value: "",
//     isEnabled: false,
//   },
//   {
//     id: 10,
//     s_no: 10,
//     name: "early_by",
//     label: "Early by",
//     value: "",
//     isEnabled: false,
//   },
//   {
//     id: 11,
//     s_no: 11,
//     name: "overtime",
//     label: "Overtime",
//     value: "",
//     isEnabled: false,
//   },
// ];

// interface AttendanceSummaryReportTemplateProps {
//   onBack?: () => void;
// }

// const AttendanceSummaryReportTemplate: React.FC<
//   AttendanceSummaryReportTemplateProps
// > = ({ onBack }) => {
//   const [fields, setFields] = useState<TemplateField[]>(initialFields);

//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     onConfirm: () => {},
//     type: "warning" as "warning" | "info" | "success" | "error",
//   });

//   const handleLabelChange = (id: number, newValue: string) => {
//     setFields(
//       fields.map((field) =>
//         field.id === id ? { ...field, value: newValue } : field
//       )
//     );
//   };

//   const handleCheckboxChange = (id: number) => {
//     setFields(
//       fields.map((field) =>
//         field.id === id ? { ...field, isEnabled: !field.isEnabled } : field
//       )
//     );
//   };

//   const closeModal = () => setModalState({ ...modalState, isOpen: false });

//   const handleUpdateClick = () => {
//     setModalState({
//       isOpen: true,
//       title: "Do you want to continue with savings?",
//       message:
//         "This will update report template settings and sequence as you select.",
//       onConfirm: confirmUpdate,
//       type: "warning",
//     });
//   };

//   const handleRefreshClick = () => {
//     setModalState({
//       isOpen: true,
//       title: "Do you want to refresh the page?",
//       message:
//         "This will refresh the page and any changes you made will not be saved.",
//       onConfirm: confirmRefresh,
//       type: "warning",
//     });
//   };

//   const confirmUpdate = () => {
//     console.log("Saving updated fields:", fields);
//     closeModal();
//   };

//   const confirmRefresh = () => {
//     setFields(initialFields);
//     closeModal();
//   };

//   const columns: Column<TemplateField>[] = [
//     { key: "s_no", header: "S no.", className: "w-1/12" },
//     { key: "name", header: "Name", className: "w-4/12 font-mono text-sm" },
//     {
//       key: "label",
//       header: "Label",
//       className: "w-5/12",
//       render: (row) => (
//         <input
//           type="text"
//           placeholder={row.label}
//           value={row.value || row.label}
//           onChange={(e) => handleLabelChange(row.id, e.target.value)}
//           className="w-full p-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-500"
//         />
//       ),
//     },
//     {
//       key: "action",
//       header: "Action",
//       className: "w-2/12 text-center",
//       render: (row) => (
//         <label className="flex justify-center items-center cursor-pointer">
//           <input
//             type="checkbox"
//             checked={row.isEnabled}
//             onChange={() => handleCheckboxChange(row.id)}
//             className="sr-only peer"
//           />
//           <div className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center peer-checked:bg-[#741CDD] peer-checked:border-[#741CDD] transition-colors">
//             <Check
//               size={16}
//               className={`text-white ${
//                 row.isEnabled ? "opacity-100" : "opacity-0"
//               }`}
//             />
//           </div>
//         </label>
//       ),
//     },
//   ];

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Attendance Summary Report Template
//         </h1>
//         <p className="text-sm text-gray-500">
//           <Link to="/reports/all">Reports</Link>
//           {" / "}
//           <Link to="/reports/scheduled">Scheduled Reports</Link>
//           {" / "}
//           Attendance Summary Report Template
//         </p>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <Table
//           data={fields}
//           columns={columns}
//           showSearch={false}
//           showPagination={false}
//         />
//       </div>

//       <div className="mt-8 flex items-center space-x-4">
//         <button
//           onClick={handleUpdateClick}
//           className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
//         >
//           UPDATE
//         </button>
//         <button
//           onClick={handleRefreshClick}
//           className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
//         >
//           REFRESH
//         </button>
//         <button
//           onClick={onBack}
//           className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
//         >
//           BACK
//         </button>
//       </div>

//       <Modal
//         isOpen={modalState.isOpen}
//         onClose={closeModal}
//         onConfirm={modalState.onConfirm}
//         title={modalState.title}
//         message={modalState.message}
//         type={modalState.type}
//         confirmButtonText="CONFIRM"
//         cancelButtonText="CANCEL"
//       />
//     </div>
//   );
// };

// export default AttendanceSummaryReportTemplate;

// src/pages/Reports/pages/AttendanceReport/component/AttendanceSummaryReportTemplate.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { toast } from "react-toastify";
import Table, { type Column } from "../../../../../components/common/Table";
import Modal from "../../../../../components/common/NotificationModal";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { updateAttendanceTemplate, type AttendanceTemplateConfig } from "../../../../../store/slice/attendanceReportSlice";

interface TemplateField {
  id: number;
  s_no: number;
  name: string; // Must match API keys
  label: string;
  isEnabled: boolean;
}

const initialFields: TemplateField[] = [
  { id: 1, s_no: 1, name: "name", label: "Name", isEnabled: true },
  { id: 2, s_no: 2, name: "emp_id", label: "Employee ID", isEnabled: true },
  { id: 3, s_no: 3, name: "status", label: "Status", isEnabled: true },
  { id: 4, s_no: 4, name: "attendanceStatus", label: "Attendance Type", isEnabled: true },
  { id: 5, s_no: 5, name: "date", label: "Date", isEnabled: true },
  { id: 6, s_no: 6, name: "inTime", label: "In Time", isEnabled: false },
  { id: 7, s_no: 7, name: "outTime", label: "Out Time", isEnabled: false },
  { id: 8, s_no: 8, name: "timeSpent", label: "Time Spent", isEnabled: false },
  { id: 9, s_no: 9, name: "lateBy", label: "Late by", isEnabled: false },
  { id: 10, s_no: 10, name: "earlyBy", label: "Early by", isEnabled: false },
  { id: 11, s_no: 11, name: "overTime", label: "Overtime", isEnabled: false },
];

interface AttendanceSummaryReportTemplateProps {
  onBack?: () => void;
}

const AttendanceSummaryReportTemplate: React.FC<AttendanceSummaryReportTemplateProps> = ({ onBack }) => {
  const [fields, setFields] = useState<TemplateField[]>(initialFields);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { templateId, loading, error } = useAppSelector((state) => state.attendanceReport);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleCheckboxChange = (id: number) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, isEnabled: !field.isEnabled } : field
      )
    );
  };

  const handleUpdateClick = () => {
    setIsModalOpen(true);
  };

  const confirmUpdate = () => {
    if (!templateId) {
      toast.error("Template ID not found. Please load the report first.");
      setIsModalOpen(false);
      return;
    }

    const payload: AttendanceTemplateConfig = fields.reduce((acc, field) => {
      acc[field.name] = field.isEnabled;
      return acc;
    }, {} as AttendanceTemplateConfig);

    dispatch(updateAttendanceTemplate({ id: templateId, data: payload }))
      .unwrap()
      .then(() => {
        toast.success("Template updated successfully!");
        if (onBack) onBack();
      })
      .catch((err) => {
        // Error is already handled by the useEffect hook, but you can log it
        console.error("Template update failed:", err);
      });

    setIsModalOpen(false);
  };

  const confirmRefresh = () => {
    setFields(initialFields);
    toast.info("Template has been reset to default.");
  };

  const columns: Column<TemplateField>[] = [
    { key: "s_no", header: "S.No", className: "w-1/12 text-center" },
    { key: "label", header: "Name", className: "w-8/12" },
    {
      key: "action",
      header: "Show in Report",
      className: "w-3/12 text-center",
      render: (row) => (
        <label className="flex justify-center items-center cursor-pointer">
          <input type="checkbox" checked={row.isEnabled} onChange={() => handleCheckboxChange(row.id)} className="sr-only peer" />
          <div className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center peer-checked:bg-[#741CDD] peer-checked:border-[#741CDD] transition-colors">
            <Check size={16} className={`text-white ${row.isEnabled ? "opacity-100" : "opacity-0"}`} />
          </div>
        </label>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Summary Report Template</h1>
        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link> / Attendance Summary Report Template
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Table data={fields} columns={columns} showSearch={false} showPagination={false} />
      </div>

      <div className="mt-8 flex items-center space-x-4">
        <button onClick={handleUpdateClick} disabled={loading === 'pending'} className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {loading === 'pending' ? 'UPDATING...' : 'UPDATE'}
        </button>
        <button onClick={confirmRefresh} className="bg-gray-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors">
          RESET
        </button>
        <button onClick={onBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors">
          BACK
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmUpdate}
        title="Confirm Update"
        message="This will save the current template settings. Are you sure you want to continue?"
        type="warning"
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </div>
  );
};

export default AttendanceSummaryReportTemplate;