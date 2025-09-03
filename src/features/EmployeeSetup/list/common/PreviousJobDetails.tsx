
import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, PenSquare, X } from "lucide-react";

import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
import type { PreviousJob } from "../../../../store/slice/previousJobSlice";
import Table, { type Column } from "../../../../components/common/Table";
import { SectionHeader, AddButton } from "../common/DetailItem";
import GenericForm, {
  type FormField,
} from "../../../../components/common/GenericForm"; 


const previousJobFormFields: FormField[] = [
  { name: "name", label: "Employer Name", type: "text", required: true },
  {
    name: "employerAddress",
    label: "Employer Address",
    type: "text",
    required: true,
    spanFull: true,
  },
  { name: "lastDate", label: "Last Date", type: "date", required: true },
  { name: "ctc", label: "CTC", type: "number", required: true },
  {
    name: "grossAmt",
    label: "Gross Amount",
    type: "number",
    placeholder: "Please Select",
  },
  { name: "taxableAmt", label: "Taxable Amount", type: "number" },
  { name: "taxPaid", label: "Tax Paid", type: "number" },
  { name: "employeePF", label: "Employee Provident Fund", type: "number" },
  { name: "employerPF", label: "Employer Provident Fund", type: "number" },
  { name: "professionalTax", label: "Professional Tax", type: "number" },
];


const initialJobState: Partial<PreviousJob> = {
  name: "",
  employerAddress: "",
  lastDate: "",
  ctc: 0,
  grossAmt: 0,
  taxableAmt: 0,
  taxPaid: 0,
  employeePF: 0,
  employerPF: 0,
  professionalTax: 0,
};

// --- Child Components ---


const ActionCell: React.FC<{
  row: PreviousJob;
  onEdit: (job: PreviousJob) => void;
}> = ({ row, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(row);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <MoreVertical size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none flex flex-col">
          <button
            onClick={handleEditClick}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-[#f5f5f5]"
          >
            <PenSquare className="mr-2 h-4 w-4 inline" />
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

interface PreviousJobDetailsProps {
  data: EmployeeDetail;
  onSave: (jobData: Partial<PreviousJob>, id?: string) => void;
}

const PreviousJobDetails: React.FC<PreviousJobDetailsProps> = ({
  data,
  onSave,
}) => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<PreviousJob | null>(null);

  
  const handleAddNew = () => {
    setCurrentJob(null); 
    setIsModalOpen(true);
  };

  const handleEdit = (job: PreviousJob) => {
    setCurrentJob(job); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentJob(null); 
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    console.log("Saving job data:", formData);
    onSave(formData, currentJob?.id);
    handleCloseModal();
  };

  
  const columns = (
    onEdit: (job: PreviousJob) => void
  ): Column<PreviousJob>[] => [
    { key: "name", header: "Employer" },
    { key: "lastDate", header: "Last Date" },
    { key: "ctc", header: "CTC" },
    { key: "grossAmt", header: "Gross Amount" },
    { key: "taxableAmt", header: "Taxable Amount" },
    { key: "taxPaid", header: "Tax Paid" },
    { key: "employeePF", header: "Employee PF" },
    { key: "employerPF", header: "Employer PF" },
    { key: "professionalTax", header: "Professional Tax" },
    {
      key: "action",
      header: "Actions",
      render: (row) => <ActionCell row={row} onEdit={onEdit} />,
    },
  ];

  const previousJobs = data.previous || [];
  const hasJobs = previousJobs && previousJobs.length > 0;
  const totalColumns = columns(handleEdit); 
  const isEditing = currentJob !== null;

  return (
    <>
      
      <div>
        <SectionHeader
          title="Previous Job Details"
          action={hasJobs ? <AddButton onClick={handleAddNew} /> : null}
        />
        {hasJobs ? (
          <Table data={previousJobs} columns={totalColumns} />
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg border border-dashed text-center text-gray-500">
            <p>No previous job details available.</p>
            <div className="mt-4">
              <AddButton onClick={handleAddNew} />
            </div>
          </div>
        )}
      </div>

      
      <div
        className={`fixed inset-0 bg-black bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${
          isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseModal}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 h-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "min(45%, 700px)" }} 
      >
        {isModalOpen && (
          <GenericForm
            title={isEditing ? "Update Previous Job" : "Previous Job"}
            fields={previousJobFormFields}
            initialState={isEditing ? currentJob : initialJobState}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            submitButtonText={isEditing ? "Update" : "Submit"}
            cancelButtonText="Cancel"
          />
        )}
      </div>
    </>
  );
};

export default PreviousJobDetails;
