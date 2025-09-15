// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Check } from "lucide-react";
// import Table, { type Column } from "../../../../../components/common/Table";
// import Modal from "../../../../../components/common/NotificationModal";
// import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import {
//   fetchLeaveTemplate,
//   updateLeaveTemplate,
//   resetLeaveReportState,
//   selectLeaveReport,
// } from "../../../../../store/slice/leaveReportSlice";
// import { toast } from "react-toastify";

// interface TemplateField {
//   id: number;
//   s_no: number;
//   name: string;
//   label: string;
//   value: string;
//   isEnabled: boolean;
// }

// const initialFields: Omit<TemplateField, "isEnabled">[] = [
//   { id: 1, s_no: 1, name: "name", label: "Name", value: "" },
//   { id: 2, s_no: 2, name: "emp_id", label: "Employee ID", value: "" },
//   { id: 3, s_no: 3, name: "status", label: "Status", value: "" },
//   { id: 4, s_no: 4, name: "Sick", label: "Sick (All Columns)", value: "" },
//   { id: 5, s_no: 5, name: "Casual", label: "Casual (All Columns)", value: "" },
//   { id: 6, s_no: 6, name: "Privileged", label: "Privileged (All Columns)", value: "" },
//   { id: 7, s_no: 7, name: "Planned", label: "Planned (All Columns)", value: "" },
// ];

// interface LeaveReportTemplateProps {
//   onBack?: () => void;
//   templateId: string | null;
// }

// const LeaveReportTemplate: React.FC<LeaveReportTemplateProps> = ({ onBack, templateId }) => {
//   const dispatch = useAppDispatch();
//   const { template, loading, error, successMessage } = useAppSelector(selectLeaveReport);

//   const [fields, setFields] = useState<TemplateField[]>([]);
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     onConfirm: () => {},
//     type: "warning" as "warning" | "info" | "success" | "error",
//   });

//   useEffect(() => {
//     if (templateId) {
//       dispatch(fetchLeaveTemplate({ id: templateId }));
//     }
//     return () => {
//       dispatch(clearLeaveReportError());
//     };
//   }, [dispatch, templateId]);

//   useEffect(() => {
//     if (template) {
//       const updatedFields = initialFields.map((field) => ({
//         ...field,
//         isEnabled: template[field.name] === true,
//       }));
//       setFields(updatedFields);
//     } else {
//       setFields(initialFields.map(f => ({...f, isEnabled: false})));
//     }
//   }, [template]);

//   useEffect(() => {
//     if (successMessage) {
//       toast.success(successMessage);
//       dispatch(clearLeaveReportError());
//     }
//     if (error) {
//       toast.error(error);
//       dispatch(clearLeaveReportError());
//     }
//   }, [successMessage, error, dispatch]);

//   const handleCheckboxChange = (id: number) => {
//     setFields(
//       fields.map((field) =>
//         field.id === id ? { ...field, isEnabled: !field.isEnabled } : field
//       )
//     );
//   };
  
//   const handleLabelChange = (id: number, newValue: string) => {
//     setFields(
//       fields.map((field) =>
//         field.id === id ? { ...field, value: newValue } : field
//       )
//     );
//   };

//   const closeModal = () => setModalState({ ...modalState, isOpen: false });

//   const handleUpdateClick = () => {
//     if (!templateId) return;
//     setModalState({
//       isOpen: true,
//       title: "Do you want to continue with savings?",
//       message: "This will update report template settings and sequence as you select.",
//       onConfirm: confirmUpdate,
//       type: "warning",
//     });
//   };

//   const handleRefreshClick = () => {
//     if (!templateId) return;
//     setModalState({
//       isOpen: true,
//       title: "Do you want to refresh the page?",
//       message: "This will refresh the page and any changes you made will not be saved.",
//       onConfirm: confirmRefresh,
//       type: "warning",
//     });
//   };

//   const confirmUpdate = () => {
//     if (!templateId) return;
//     const dataToUpdate = fields.reduce((acc, field) => {
//       if (initialFields.some(f => f.name === field.name)) {
//         acc[field.name] = field.isEnabled;
//       }
//       return acc;
//     }, {} as { [key: string]: boolean });

//     dispatch(updateLeaveTemplate({ id: templateId, data: dataToUpdate }));
//     closeModal();
//   };

//   const confirmRefresh = () => {
//     if (!templateId) return;
//     dispatch(fetchLeaveTemplate({ id: templateId }));
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
        
//           disabled={loading === 'pending'}
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
          
//             disabled={loading === 'pending'}
//           />
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
//         <h1 className="text-3xl font-bold text-gray-800">Leave Report Template</h1>
//         <p className="text-sm text-gray-500">
//           <Link to="/reports/all">Reports</Link>{" / "}
//           <Link to="/reports/scheduled">Leave Report</Link>{" / "}Leave Report Template
//         </p>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <Table
//           data={fields}
//           columns={columns}
//           showSearch={false}
//           showPagination={false}
   
//           isLoading={loading === 'pending' && !template}
//         />
//       </div>

//       <div className="mt-8 flex items-center space-x-4">
//         <button
//           onClick={handleUpdateClick}
//           className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          
//           disabled={loading === 'pending' || !templateId}
//         >
//           {loading === 'pending' ? "UPDATING..." : "UPDATE"}
//         </button>
//         <button
//           onClick={handleRefreshClick}
//           className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
         
//           disabled={loading === 'pending' || !templateId}
//         >
//           REFRESH
//         </button>
//         <button
//           onClick={onBack}
//           className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
//           disabled={loading === 'pending'}
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

// export default LeaveReportTemplate;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Check } from "lucide-react";
// import Table, { type Column } from "../../../../../components/common/Table";
// import Modal from "../../../../../components/common/NotificationModal";
// import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import {
//   fetchLeaveTemplate,
//   updateLeaveTemplate,
//   resetLeaveReportState,
//   selectLeaveReport,
// } from "../../../../../store/slice/leaveReportSlice";
// import { toast } from "react-toastify";

// interface TemplateField {
//   id: number;
//   s_no: number;
//   name: string;
//   label: string;
//   value: string;
//   isEnabled: boolean;
// }

// const initialFields: Omit<TemplateField, "isEnabled">[] = [
//   { id: 1, s_no: 1, name: "name", label: "Name", value: "" },
//   { id: 2, s_no: 2, name: "emp_id", label: "Employee ID", value: "" },
//   { id: 3, s_no: 3, name: "status", label: "Status", value: "" },
//   { id: 4, s_no: 4, name: "Sick", label: "Sick (All Columns)", value: "" },
//   { id: 5, s_no: 5, name: "Casual", label: "Casual (All Columns)", value: "" },
//   { id: 6, s_no: 6, name: "Privileged", label: "Privileged (All Columns)", value: "" },
//   { id: 7, s_no: 7, name: "Planned", label: "Planned (All Columns)", value: "" },
// ];

// interface LeaveReportTemplateProps {
//   onBack?: () => void;
//   templateId: string | null;
// }

// const LeaveReportTemplate: React.FC<LeaveReportTemplateProps> = ({ onBack, templateId }) => {
//   const dispatch = useAppDispatch();
//   const { template, templateLoading, templateError, successMessage, error } =
//     useAppSelector(selectLeaveReport);

//   const [fields, setFields] = useState<TemplateField[]>([]);
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     title: "",
//     message: "",
//     onConfirm: () => {},
//     type: "warning" as "warning" | "info" | "success" | "error",
//   });

//   useEffect(() => {
//     if (templateId) {
//       dispatch(fetchLeaveTemplate({ id: templateId }));
//     }
//     return () => {
//       dispatch(clearLeaveReportError());
//     };
//   }, [dispatch, templateId]);

//   useEffect(() => {
//     if (template) {
//       const updatedFields = initialFields.map((field) => ({
//         ...field,
//         isEnabled: template[field.name] === true,
//       }));
//       setFields(updatedFields);
//     } else {
//       setFields(initialFields.map((f) => ({ ...f, isEnabled: false })));
//     }
//   }, [template]);

//   useEffect(() => {
//     if (successMessage) {
//       toast.success(successMessage);
//       dispatch(clearLeaveReportError());
//     }
//     if (error) {
//       toast.error(error);
//       dispatch(clearLeaveReportError());
//     }
//     if (templateError) {
//       toast.error(templateError);
//     }
//   }, [successMessage, error, templateError, dispatch]);

//   const handleCheckboxChange = (id: number) => {
//     setFields(
//       fields.map((field) =>
//         field.id === id ? { ...field, isEnabled: !field.isEnabled } : field
//       )
//     );
//   };

//   const handleLabelChange = (id: number, newValue: string) => {
//     setFields(
//       fields.map((field) =>
//         field.id === id ? { ...field, value: newValue } : field
//       )
//     );
//   };

//   const closeModal = () => setModalState({ ...modalState, isOpen: false });

//   const handleUpdateClick = () => {
//     if (!templateId) return;
//     setModalState({
//       isOpen: true,
//       title: "Do you want to continue with savings?",
//       message: "This will update report template settings and sequence as you select.",
//       onConfirm: confirmUpdate,
//       type: "warning",
//     });
//   };

//   const handleRefreshClick = () => {
//     if (!templateId) return;
//     setModalState({
//       isOpen: true,
//       title: "Do you want to refresh the page?",
//       message: "This will refresh the page and any changes you made will not be saved.",
//       onConfirm: confirmRefresh,
//       type: "warning",
//     });
//   };

//   const confirmUpdate = () => {
//     if (!templateId) return;
//     const dataToUpdate = fields.reduce((acc, field) => {
//       if (initialFields.some((f) => f.name === field.name)) {
//         acc[field.name] = field.isEnabled;
//       }
//       return acc;
//     }, {} as { [key: string]: boolean });

//     dispatch(updateLeaveTemplate({ id: templateId, data: dataToUpdate }));
//     closeModal();
//   };

//   const confirmRefresh = () => {
//     if (!templateId) return;
//     dispatch(fetchLeaveTemplate({ id: templateId }));
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
//           disabled={templateLoading === 'pending'}
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
//             disabled={templateLoading === 'pending'}
//           />
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
//         <h1 className="text-3xl font-bold text-gray-800">Leave Report Template</h1>
//         <p className="text-sm text-gray-500">
//           <Link to="/reports/all">Reports</Link>
//           {" / "}
//           <Link to="/reports/scheduled">Leave Report</Link>
//           {" / "}Leave Report Template
//         </p>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-sm">
//         <Table
//           data={fields}
//           columns={columns}
//           showSearch={false}
//           showPagination={false}
//           isLoading={templateLoading === 'pending' && !template}
//         />
//       </div>

//       <div className="mt-8 flex items-center space-x-4">
//         <button
//           onClick={handleUpdateClick}
//           className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
//           disabled={templateLoading === 'pending' || !templateId}
//         >
//           {templateLoading === 'pending' ? "UPDATING..." : "UPDATE"}
//         </button>
//         <button
//           onClick={handleRefreshClick}
//           className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
//           disabled={templateLoading === 'pending' || !templateId}
//         >
//           REFRESH
//         </button>
//         <button
//           onClick={onBack}
//           className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
//           disabled={templateLoading === 'pending'}
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

// export default LeaveReportTemplate;



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Table, { type Column } from "../../../../../components/common/Table";
import Modal from "../../../../../components/common/NotificationModal";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import {
  fetchLeaveTemplate,
  updateLeaveTemplate,
  clearLeaveReportError,
  selectLeaveReport,
} from "../../../../../store/slice/leaveReportSlice";
import { toast } from "react-toastify";

interface TemplateField {
  id: number;
  s_no: number;
  name: string;
  label: string;
  value: string;
  isEnabled: boolean;
}

const initialFields: Omit<TemplateField, "isEnabled">[] = [
  { id: 1, s_no: 1, name: "name", label: "Name", value: "" },
  { id: 2, s_no: 2, name: "emp_id", label: "Employee ID", value: "" },
  { id: 3, s_no: 3, name: "status", label: "Status", value: "" },
  { id: 4, s_no: 4, name: "Sick", label: "Sick (All Columns)", value: "" },
  { id: 5, s_no: 5, name: "Casual", label: "Casual (All Columns)", value: "" },
  { id: 6, s_no: 6, name: "Privileged", label: "Privileged (All Columns)", value: "" },
  { id: 7, s_no: 7, name: "Planned", label: "Planned (All Columns)", value: "" },
];

interface LeaveReportTemplateProps {
  onBack?: () => void;
  templateId: string | null;
}

const LeaveReportTemplate: React.FC<LeaveReportTemplateProps> = ({ onBack, templateId }) => {
  const dispatch = useAppDispatch();
  const { template, templateLoading, templateError, successMessage, error } =
    useAppSelector(selectLeaveReport);

  const [fields, setFields] = useState<TemplateField[]>([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning" as "warning" | "info" | "success" | "error",
  });

  useEffect(() => {
    if (templateId) {
      dispatch(fetchLeaveTemplate({ id: templateId }));
    }
    return () => {
      dispatch(clearLeaveReportError());
    };
  }, [dispatch, templateId]);

  useEffect(() => {
    if (template) {
      const updatedFields = initialFields.map((field) => ({
        ...field,
        isEnabled: template[field.name] === true,
      }));
      setFields(updatedFields);
    } else {
      setFields(initialFields.map((f) => ({ ...f, isEnabled: false })));
    }
  }, [template]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearLeaveReportError());
    }
    if (error) {
      toast.error(error);
      dispatch(clearLeaveReportError());
    }
    if (templateError) {
      toast.error(templateError);
    }
  }, [successMessage, error, templateError, dispatch]);

  const handleCheckboxChange = (id: number) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, isEnabled: !field.isEnabled } : field
      )
    );
  };

  const handleLabelChange = (id: number, newValue: string) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, value: newValue } : field
      )
    );
  };

  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  const handleUpdateClick = () => {
    if (!templateId) return;
    setModalState({
      isOpen: true,
      title: "Do you want to continue with savings?",
      message: "This will update report template settings and sequence as you select.",
      onConfirm: confirmUpdate,
      type: "warning",
    });
  };

  const handleRefreshClick = () => {
    if (!templateId) return;
    setModalState({
      isOpen: true,
      title: "Do you want to refresh the page?",
      message: "This will refresh the page and any changes you made will not be saved.",
      onConfirm: confirmRefresh,
      type: "warning",
    });
  };

  const confirmUpdate = () => {
    if (!templateId) return;
    const dataToUpdate = fields.reduce((acc, field) => {
      if (initialFields.some((f) => f.name === field.name)) {
        acc[field.name] = field.isEnabled;
      }
      return acc;
    }, {} as { [key: string]: boolean });

    dispatch(updateLeaveTemplate({ id: templateId, data: dataToUpdate }));
    closeModal();
  };

  const confirmRefresh = () => {
    if (!templateId) return;
    dispatch(fetchLeaveTemplate({ id: templateId }));
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
          value={row.value || row.label}
          onChange={(e) => handleLabelChange(row.id, e.target.value)}
          className="w-full p-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-purple-500"
          disabled={templateLoading === 'pending'}
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
            disabled={templateLoading === 'pending'}
          />
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
        <h1 className="text-3xl font-bold text-gray-800">Leave Report Template</h1>
        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link>
          {" / "}
          <Link to="/reports/scheduled">Leave Report</Link>
          {" / "}Leave Report Template
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Table
          data={fields}
          columns={columns}
          showSearch={false}
          showPagination={false}
          isLoading={templateLoading === 'pending' && !template}
        />
      </div>

      <div className="mt-8 flex items-center space-x-4">
        <button
          onClick={handleUpdateClick}
          className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          disabled={templateLoading === 'pending' || !templateId}
        >
          {templateLoading === 'pending' ? "UPDATING..." : "UPDATE"}
        </button>
        <button
          onClick={handleRefreshClick}
          className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          disabled={templateLoading === 'pending' || !templateId}
        >
          REFRESH
        </button>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
          disabled={templateLoading === 'pending'}
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

export default LeaveReportTemplate;