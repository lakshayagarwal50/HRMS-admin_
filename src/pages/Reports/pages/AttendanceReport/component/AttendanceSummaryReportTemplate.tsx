// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Check } from "lucide-react";
// import { toast } from "react-toastify";
// import Table, { type Column } from "../../../../../components/common/Table";
// import Modal from "../../../../../components/common/NotificationModal";
// import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import { updateAttendanceTemplate, type AttendanceTemplateConfig } from "../../../../../store/slice/attendanceReportSlice";
// import { fetchAttendanceTemplate } from "../../../../../store/slice/attendanceReportSlice";

// interface TemplateField {
//   id: number;
//   s_no: number;
//   name: string; // Must match API keys
//   label: string;
//   isEnabled: boolean;
// }

// const initialFields: TemplateField[] = [
//   { id: 1, s_no: 1, name: "name", label: "Name", isEnabled: true },
//   { id: 2, s_no: 2, name: "emp_id", label: "Employee ID", isEnabled: true },
//   { id: 3, s_no: 3, name: "status", label: "Status", isEnabled: true },
//   { id: 4, s_no: 4, name: "attendanceStatus", label: "Attendance Type", isEnabled: true },
//   { id: 5, s_no: 5, name: "date", label: "Date", isEnabled: true },
//   { id: 6, s_no: 6, name: "inTime", label: "In Time", isEnabled: false },
//   { id: 7, s_no: 7, name: "outTime", label: "Out Time", isEnabled: false },
//   { id: 8, s_no: 8, name: "timeSpent", label: "Time Spent", isEnabled: false },
//   { id: 9, s_no: 9, name: "lateBy", label: "Late by", isEnabled: false },
//   { id: 10, s_no: 10, name: "earlyBy", label: "Early by", isEnabled: false },
//   { id: 11, s_no: 11, name: "overTime", label: "Overtime", isEnabled: false },
// ];

// interface AttendanceSummaryReportTemplateProps {
//   onBack?: (shouldRefetch?: boolean) => void;
// }

// const AttendanceSummaryReportTemplate: React.FC<AttendanceSummaryReportTemplateProps> = ({ onBack }) => {
//   const [fields, setFields] = useState<TemplateField[]>(initialFields);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const dispatch = useAppDispatch();
//   const { templateId, loading, error, templateConfig, templateLoading } = useAppSelector(
//     (state) => state.attendanceReport
//   );

//   // Fetch template when component mounts or templateId changes
//   useEffect(() => {
//     if (templateId && templateLoading === "idle") {
//       dispatch(fetchAttendanceTemplate(templateId));
//     }
//   }, [dispatch, templateId, templateLoading]);

//   // Update fields when templateConfig changes
//   useEffect(() => {
//     if (templateConfig) {
//       setFields(prevFields => 
//         prevFields.map(field => ({
//           ...field,
//           isEnabled: templateConfig[field.name] || false
//         }))
//       );
//     }
//   }, [templateConfig]);

//   useEffect(() => {
//     if (error) toast.error(error);
//   }, [error]);

//   const handleCheckboxChange = (id: number) => {
//     setFields((prevFields) =>
//       prevFields.map((field) =>
//         field.id === id ? { ...field, isEnabled: !field.isEnabled } : field
//       )
//     );
//   };

//   const handleUpdateClick = () => {
//     setIsModalOpen(true);
//   };

//   const confirmUpdate = () => {
//     if (!templateId) {
//       toast.error("Template ID not found. Please load the report first.");
//       setIsModalOpen(false);
//       return;
//     }

//     const payload: AttendanceTemplateConfig = fields.reduce((acc, field) => {
//       acc[field.name] = field.isEnabled;
//       return acc;
//     }, {} as AttendanceTemplateConfig);

//     dispatch(updateAttendanceTemplate({ id: templateId, data: payload }))
//       .unwrap()
//       .then(() => {
//         toast.success("Template updated successfully!");
        
//         // Indicate that we need to refetch when going back
//         if (onBack) {
//           onBack(true); // Pass true to indicate refetch is needed
//         }
//       })
//       .catch((err) => {
//         console.error("Template update failed:", err);
//       });

//     setIsModalOpen(false);
//   };

//   const confirmRefresh = () => {
//     setFields(initialFields);
//     toast.info("Template has been reset to default.");
//   };

//   const handleBack = () => {
//     if (onBack) {
//       onBack(false); // Don't refetch
//     }
//   };

//   const columns: Column<TemplateField>[] = [
//     { key: "s_no", header: "S.No", className: "w-1/12 text-center" },
//     { key: "label", header: "Name", className: "w-8/12" },
//     {
//       key: "action",
//       header: "Show in Report",
//       className: "w-3/12 text-center",
//       render: (row) => (
//         <label className="flex justify-center items-center cursor-pointer">
//           <input type="checkbox" checked={row.isEnabled} onChange={() => handleCheckboxChange(row.id)} className="sr-only peer" />
//           <div className="w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center peer-checked:bg-[#741CDD] peer-checked:border-[#741CDD] transition-colors">
//             <Check size={16} className={`text-white ${row.isEnabled ? "opacity-100" : "opacity-0"}`} />
//           </div>
//         </label>
//       ),
//     },
//   ];

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Attendance Summary Report Template</h1>
//         <p className="text-sm text-gray-500">
//           <Link to="/reports/all">Reports</Link> / Attendance Summary Report Template
//         </p>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <Table data={fields} columns={columns} showSearch={false} showPagination={false} />
//       </div>

//       <div className="mt-8 flex items-center space-x-4">
//         <button onClick={handleUpdateClick} disabled={loading === 'pending'} className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//           {loading === 'pending' ? 'UPDATING...' : 'UPDATE'}
//         </button>
//         <button onClick={confirmRefresh} className="bg-gray-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors">
//           RESET
//         </button>
//         <button onClick={handleBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors">
//           BACK
//         </button>
//       </div>

//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={confirmUpdate}
//         title="Confirm Update"
//         message="This will save the current template settings. Are you sure you want to continue?"
//         type="warning"
//         confirmButtonText="CONFIRM"
//         cancelButtonText="CANCEL"
//       />
//     </div>
//   );
// };

// export default AttendanceSummaryReportTemplate;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { toast } from "react-toastify";
import Table, { type Column } from "../../../../../components/common/Table";
import Modal from "../../../../../components/common/NotificationModal";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { updateAttendanceTemplate, type AttendanceTemplateConfig, fetchAttendanceTemplate } from "../../../../../store/slice/attendanceReportSlice";


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
  onBack?: (shouldRefetch?: boolean) => void;
}

const AttendanceSummaryReportTemplate: React.FC<AttendanceSummaryReportTemplateProps> = ({ onBack }) => {
  const [fields, setFields] = useState<TemplateField[]>(initialFields);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { templateId, templateLoading, templateError, templateConfig } = useAppSelector(
    (state) => state.attendanceReport
  );

  // Fetch template when component mounts or templateId changes
  useEffect(() => {
    if (templateId && templateLoading === "idle") {
      dispatch(fetchAttendanceTemplate(templateId));
    }
  }, [dispatch, templateId, templateLoading]);

  // Update fields when templateConfig changes
  useEffect(() => {
    if (templateConfig) {
      setFields(prevFields =>
        prevFields.map(field => ({
          ...field,
          isEnabled: templateConfig[field.name] || false
        }))
      );
    }
  }, [templateConfig]);

  useEffect(() => {
    if (templateError) {
      toast.error(templateError);
    }
  }, [templateError]);

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
        if (onBack) {
          onBack(true); // Pass true to indicate refetch is needed
        }
      })
      .catch((err) => {
        console.error("Template update failed:", err);
      });

    setIsModalOpen(false);
  };

  const confirmRefresh = () => {
    setFields(initialFields);
    toast.info("Template has been reset to default.");
  };

  const handleBack = () => {
    if (onBack) {
      onBack(false); // Don't refetch
    }
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
        {templateLoading === "pending" && <p className="text-center p-4">Loading template...</p>}
        {templateLoading === "succeeded" && (
          <Table data={fields} columns={columns} showSearch={false} showPagination={false} />
        )}
        {templateLoading === "failed" && <p className="text-center text-red-500 p-4">Failed to load template.</p>}
      </div>

      <div className="mt-8 flex items-center space-x-4">
        <button onClick={handleUpdateClick} disabled={templateLoading === 'pending'} className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {templateLoading === 'pending' ? 'UPDATING...' : 'UPDATE'}
        </button>
        <button onClick={confirmRefresh} className="bg-gray-500 text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors">
          RESET
        </button>
        <button onClick={handleBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors">
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