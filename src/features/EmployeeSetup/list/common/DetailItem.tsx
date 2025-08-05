
import React from "react";
import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";

export const SectionHeader: React.FC<{
  title: string;
  action?: React.ReactNode;
}> = ({ title, action }) => (
  <div className="flex justify-between items-center pb-4">
    <h3 className="text-lg font-semibold text-[#741CDD]">{title}</h3>
    {action}
  </div>
);

export const DetailItem: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value || "--"}</p>
  </div>
);

export const EditButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
    Edit
  </button>
);

export const AddButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 text-sm text-white bg-[#741CDD] hover:bg-[#5f3dbb] transition-colors px-3 py-1.5 rounded-md font-semibold"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    Add
  </button>
);

export const PlaceholderComponent: React.FC<{
  title: string;
  onEdit: () => void;
}> = ({ title, onEdit }) => (
  <div>
    <SectionHeader title={title} action={<EditButton onClick={onEdit} />} />
    <div className="bg-gray-50 p-6 rounded-lg border border-dashed text-center text-gray-500">
      <p>Content for {title} will be displayed here.</p>
    </div>
  </div>
);
