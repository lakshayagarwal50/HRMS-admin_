
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Check } from "lucide-react";
// import { toast } from "react-toastify";
// import Table, {
//   type Column,
// } from "../../../../../../components/common/Table";
// import Modal from "../../../../../../components/common/NotificationModal";
// import { useAppDispatch, useAppSelector } from "../../../../../../store/hooks";
// import {
//   fetchPayslipTemplateById,
//   updatePayslipTemplate,
// } from "../../../../../../store/slice/payslipReportSlice";

// interface TemplateField {
//   key: string;
//   label: string;
//   isEnabled: boolean;
// }

// const fieldLabelMapping: Record<string, string> = {
//   name: "Employee Name",
//   emp_id: "Employee ID",
//   phoneNum: "Phone Number",
//   comName: "Component Name",
//   comtype: "Component Type",
//   status: "Status",
//   designation: "Designation",
//   department: "Department",
//   location: "Location",
//   code: "Code",
//   amount: "Amount",
// };

// interface PayslipComponentReportTemplateProps {
//   templateId: string | null;
//   onBack?: () => void;
// }

// const PayslipComponentReportTemplate: React.FC<
//   PayslipComponentReportTemplateProps
// > = ({ templateId, onBack }) => {
//   const dispatch = useAppDispatch();
//   const { template, loading, error } = useAppSelector(
//     (state) => state.payslipReport
//   );
//   const [fields, setFields] = useState<TemplateField[]>([]);
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     onConfirm: () => {},
//   });

//   useEffect(() => {
//     if (templateId) {
//       dispatch(fetchPayslipTemplateById(templateId));
//     }
//   }, [dispatch, templateId]);

//   useEffect(() => {
//     if (template) {
//       const formattedFields = Object.entries(template)
//         .filter(([, value]) => typeof value === "boolean")
//         .map(([key, value]) => ({
//           key,
//           label: fieldLabelMapping[key] || key.replace(/_/g, " "),
//           isEnabled: value,
//         }));
//       setFields(formattedFields);
//     }
//   }, [template]);

//   useEffect(() => {
//     if (error) toast.error(error);
//   }, [error]);

//   const handleCheckboxChange = (key: string) => {
//     setFields(
//       fields.map((field) =>
//         field.key === key ? { ...field, isEnabled: !field.isEnabled } : field
//       )
//     );
//   };

//   const handleUpdateClick = () => {
//     setModalState({ isOpen: true, onConfirm: confirmUpdate });
//   };

//   const confirmUpdate = () => {
//     if (!templateId) {
//       toast.error("Template ID is missing.");
//       closeModal();
//       return;
//     }
//     const templateData = fields.reduce((acc, field) => {
//       acc[field.key] = field.isEnabled;
//       return acc;
//     }, {} as Record<string, boolean>);

//     dispatch(updatePayslipTemplate({ templateId, templateData }));
//     closeModal();
//   };

//   const closeModal = () =>
//     setModalState({ isOpen: false, onConfirm: () => {} });

//   const columns: Column<TemplateField>[] = [
//     {
//       key: "s_no",
//       header: "S no.",
//       className: "w-1/12",
//       // --- FIX HERE ---
//       // Find the index of the row within the `fields` array to calculate the serial number
//       render: (row) => <span>{fields.findIndex((f) => f.key === row.key) + 1}</span>,
//     },
//     { key: "label", header: "Label", className: "w-8/12" },
//     {
//       key: "action",
//       header: "Enabled",
//       className: "w-3/12 text-center",
//       render: (row) => (
//         <label className="flex justify-center items-center cursor-pointer">
//           <input
//             type="checkbox"
//             checked={row.isEnabled}
//             onChange={() => handleCheckboxChange(row.key)}
//             className="sr-only peer"
//             disabled={loading}
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
//           Edit Payslip Component Report Template
//         </h1>
//         <p className="text-sm text-gray-500">
//           <Link to="/reports/all">Reports</Link> / Payslip Component Report
//           Template
//         </p>
//       </div>

//       {loading && fields.length === 0 && (
//         <p className="text-center p-4">Loading template...</p>
//       )}
//       {!loading && error && (
//         <p className="text-center text-red-500 p-4">{error}</p>
//       )}

//       {!loading && !error && fields.length > 0 && (
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <Table
//             data={fields}
//             columns={columns}
//             showSearch={false}
//             showPagination={false}
//           />
//         </div>
//       )}

//       <div className="mt-8 flex items-center space-x-4">
//         <button
//           onClick={handleUpdateClick}
//           className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
//           disabled={loading || fields.length === 0}
//         >
//           {loading ? "SAVING..." : "SAVE CHANGES"}
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
//         title="Confirm Update"
//         message="Are you sure you want to save these changes to the template?"
//         type="warning"
//         confirmButtonText="CONFIRM"
//         cancelButtonText="CANCEL"
//       />
//     </div>
//   );
// };

// export default PayslipComponentReportTemplate;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Check } from "lucide-react";
// import { toast } from "react-toastify";
// import Table, {
//   type Column,
// } from "../../../../../../components/common/Table";
// import Modal from "../../../../../../components/common/NotificationModal";
// import { useAppDispatch, useAppSelector } from "../../../../../../store/hooks";
// import {
//   fetchPayslipTemplateById,
//   updatePayslipTemplate,
// } from "../../../../../../store/slice/payslipReportSlice";

// interface TemplateField {
//   key: string;
//   label: string;
//   isEnabled: boolean;
// }

// const fieldLabelMapping: Record<string, string> = {
//   name: "Employee Name",
//   emp_id: "Employee ID",
//   phoneNum: "Phone Number",
//   comName: "Component Name",
//   comtype: "Component Type",
//   status: "Status",
//   designation: "Designation",
//   department: "Department",
//   location: "Location",
//   code: "Code",
//   amount: "Amount",
// };

// interface PayslipComponentReportTemplateProps {
//   templateId: string | null;
//   onBack?: () => void;
// }

// const PayslipComponentReportTemplate: React.FC<
//   PayslipComponentReportTemplateProps
// > = ({ templateId, onBack }) => {
//   const dispatch = useAppDispatch();
//   const { template, loading, templateLoading, templateError } = useAppSelector(
//     (state) => state.payslipReport
//   );
//   const [fields, setFields] = useState<TemplateField[]>([]);
//   const [modalState, setModalState] = useState({
//     isOpen: false,
//     onConfirm: () => {},
//   });

//   useEffect(() => {
//     if (templateId) {
//       dispatch(fetchPayslipTemplateById(templateId));
//     }
//   }, [dispatch, templateId]);

//   useEffect(() => {
//     if (template) {
//       const formattedFields = Object.entries(template)
//         .filter(([, value]) => typeof value === "boolean")
//         .map(([key, value]) => ({
//           key,
//           label: fieldLabelMapping[key] || key.replace(/_/g, " "),
//           isEnabled: value,
//         }));
//       setFields(formattedFields);
//     }
//   }, [template]);

//   useEffect(() => {
//     if (templateError) toast.error(templateError);
//   }, [templateError]);

//   const handleCheckboxChange = (key: string) => {
//     setFields(
//       fields.map((field) =>
//         field.key === key ? { ...field, isEnabled: !field.isEnabled } : field
//       )
//     );
//   };

//   const handleUpdateClick = () => {
//     setModalState({ isOpen: true, onConfirm: confirmUpdate });
//   };

//   const confirmUpdate = () => {
//     if (!templateId) {
//       toast.error("Template ID is missing.");
//       closeModal();
//       return;
//     }
//     const templateData = fields.reduce((acc, field) => {
//       acc[field.key] = field.isEnabled;
//       return acc;
//     }, {} as Record<string, boolean>);

//     dispatch(updatePayslipTemplate({ templateId, templateData }));
//     closeModal();
//   };

//   const closeModal = () =>
//     setModalState({ isOpen: false, onConfirm: () => {} });

//   const columns: Column<TemplateField>[] = [
//     {
//       key: "s_no",
//       header: "S no.",
//       className: "w-1/12",
//       render: (row) => <span>{fields.findIndex((f) => f.key === row.key) + 1}</span>,
//     },
//     { key: "label", header: "Label", className: "w-8/12" },
//     {
//       key: "action",
//       header: "Enabled",
//       className: "w-3/12 text-center",
//       render: (row) => (
//         <label className="flex justify-center items-center cursor-pointer">
//           <input
//             type="checkbox"
//             checked={row.isEnabled}
//             onChange={() => handleCheckboxChange(row.key)}
//             className="sr-only peer"
//             disabled={loading}
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
//           Edit Payslip Component Report Template
//         </h1>
//         <p className="text-sm text-gray-500">
//           <Link to="/reports/all">Reports</Link> / Payslip Component Report
//           Template
//         </p>
//       </div>

//       {templateLoading && fields.length === 0 && ( // 💡 Use templateLoading here
//         <p className="text-center p-4">Loading template...</p>
//       )}
//       {!templateLoading && templateError && ( // 💡 Use templateError here
//         <p className="text-center text-red-500 p-4">{templateError}</p>
//       )}

//       {!templateLoading && !templateError && fields.length > 0 && (
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//           <Table
//             data={fields}
//             columns={columns}
//             showSearch={false}
//             showPagination={false}
//           />
//         </div>
//       )}

//       <div className="mt-8 flex items-center space-x-4">
//         <button
//           onClick={handleUpdateClick}
//           className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
//           disabled={loading || fields.length === 0}
//         >
//           {loading ? "SAVING..." : "SAVE CHANGES"}
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
//         title="Confirm Update"
//         message="Are you sure you want to save these changes to the template?"
//         type="warning"
//         confirmButtonText="CONFIRM"
//         cancelButtonText="CANCEL"
//       />
//     </div>
//   );
// };

// export default PayslipComponentReportTemplate;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { toast } from "react-toastify";
import Table, { type Column } from "../../../../../../components/common/Table";
import Modal from "../../../../../../components/common/NotificationModal";
import { useAppDispatch, useAppSelector } from "../../../../../../store/hooks";
import {
  fetchPayslipTemplateById,
  updatePayslipTemplate,
  clearPayslipReportError,
} from "../../../../../../store/slice/payslipReportSlice";

interface TemplateField {
  key: string;
  label: string;
  isEnabled: boolean;
}

const fieldLabelMapping: Record<string, string> = {
  name: "Employee Name",
  emp_id: "Employee ID",
  phoneNum: "Phone Number",
  comName: "Component Name",
  comtype: "Component Type",
  status: "Status",
  designation: "Designation",
  department: "Department",
  location: "Location",
  code: "Code",
  amount: "Amount",
};

interface PayslipComponentReportTemplateProps {
  templateId: string | null;
  onBack?: () => void;
}

const PayslipComponentReportTemplate: React.FC<PayslipComponentReportTemplateProps> = ({ templateId, onBack }) => {
  const dispatch = useAppDispatch();
  const { template, templateLoading, templateError } = useAppSelector((state) => state.payslipReport);
  
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (templateId) {
      dispatch(fetchPayslipTemplateById(templateId));
    }
  }, [dispatch, templateId]);

  useEffect(() => {
    if (template) {
      const formattedFields = Object.entries(template)
        .filter(([key]) => fieldLabelMapping[key]) // Only include fields we have a label for
        .map(([key, value]) => ({
          key,
          label: fieldLabelMapping[key],
          isEnabled: !!value,
        }));
      setFields(formattedFields);
    }
  }, [template]);

  useEffect(() => {
    if (templateError) {
      toast.error(templateError);
      dispatch(clearPayslipReportError());
    }
  }, [templateError, dispatch]);

  const handleCheckboxChange = (key: string) => {
    setFields(
      fields.map((field) =>
        field.key === key ? { ...field, isEnabled: !field.isEnabled } : field
      )
    );
  };

  const confirmUpdate = () => {
    if (!templateId) {
      toast.error("Template ID is missing.");
      setIsModalOpen(false);
      return;
    }
    const templateData = fields.reduce((acc, field) => {
      acc[field.key] = field.isEnabled;
      return acc;
    }, {} as Record<string, boolean>);

    setIsUpdating(true);
    dispatch(updatePayslipTemplate({ templateId, templateData }))
      .unwrap()
      .then(() => {
        toast.success("Template updated successfully!");
        if (onBack) onBack();
      })
      .catch((err) => toast.error(err as string))
      .finally(() => setIsUpdating(false));

    setIsModalOpen(false);
  };

  const isLoading = templateLoading === 'pending' || isUpdating;

  const columns: Column<TemplateField>[] = [
    {
      key: "s_no",
      header: "S no.",
      className: "w-1/12",
      render: (row) => <span>{fields.findIndex((f) => f.key === row.key) + 1}</span>,
    },
    { key: "label", header: "Label", className: "w-8/12" },
    {
      key: "action",
      header: "Enabled",
      className: "w-3/12 text-center",
      render: (row) => (
        <label className="flex justify-center items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.isEnabled}
            onChange={() => handleCheckboxChange(row.key)}
            className="sr-only peer"
            disabled={isLoading}
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
        <h1 className="text-3xl font-bold text-gray-800">Edit Payslip Component Report Template</h1>
        <p className="text-sm text-gray-500">
          <Link to="/reports/all">Reports</Link> / Payslip Component Report Template
        </p>
      </div>

      {templateLoading === 'pending' && fields.length === 0 && (<p className="text-center p-4">Loading template...</p>)}
      {templateLoading === 'failed' && (<p className="text-center text-red-500 p-4">Could not load template.</p>)}

      {fields.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Table data={fields} columns={columns} showSearch={false} showPagination={false} />
        </div>
      )}

      <div className="mt-8 flex items-center space-x-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          disabled={isLoading || fields.length === 0}
        >
          {isUpdating ? "SAVING..." : "SAVE CHANGES"}
        </button>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
          disabled={isLoading}
        >
          BACK
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmUpdate}
        title="Confirm Update"
        message="Are you sure you want to save these changes to the template?"
        type="warning"
        confirmButtonText="CONFIRM"
        cancelButtonText="CANCEL"
      />
    </div>
  );
};

export default PayslipComponentReportTemplate;