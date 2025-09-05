//imports
import React, { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import type { DsrFilterState } from "../../../store/slice/dsrSlice";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: DsrFilterState;
  onApply: (filters: DsrFilterState) => void;
  onClear: () => void;
}

const submissionStatusOptions = ["Due", "Submitted"];
const approvalStatusOptions = ["Approved", "Pending", "Declined"];

const DsrFilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  initialFilters,
  onApply,
  onClear,
}) => {
  const [filters, setFilters] = useState<DsrFilterState>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters, isOpen]);

  const activeFilterKey = useMemo(() => {
    if (filters.date) return "date";
    if (filters.projects) return "projects";
    if (filters.submissionStatuses.length > 0) return "submission";
    if (filters.approvalStatuses.length > 0) return "approval";
    return null;
  }, [filters]);

  const handleCheckboxChange = (
    type: "submission" | "approval",
    value: string
  ) => {
    const key =
      type === "submission" ? "submissionStatuses" : "approvalStatuses";
    const currentValues = filters[key];

    let newValues: string[];

    if (currentValues.includes(value)) {
      // If already checked, uncheck it by clearing the array
      newValues = [];
    } else {
      // If not checked, check it by setting the array to ONLY this value
      newValues = [value];
    }

    setFilters({ ...initialFilters, [key]: newValues });
  };

  const handleApply = () => onApply(filters);
  const handleClear = () => onClear();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 bg-black/50"
      onClick={onClose}
    >
      <div
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-[#741CDD]">Filter</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow p-4 space-y-6 overflow-y-auto">
          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#741CDD] disabled:bg-gray-100"
              value={filters.date}
              onChange={(e) =>
                setFilters({ ...initialFilters, date: e.target.value })
              }
              disabled={!!activeFilterKey && activeFilterKey !== "date"}
            />
          </div>

          {/* Projects Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Projects
            </label>
            <input
              type="text"
              placeholder="Search project name"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#741CDD] disabled:bg-gray-100"
              value={filters.projects}
              onChange={(e) =>
                setFilters({ ...initialFilters, projects: e.target.value })
              }
              disabled={!!activeFilterKey && activeFilterKey !== "projects"}
            />
          </div>

          {/* Submission Status Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submission Status
            </label>
            <div className="space-y-2">
              {submissionStatusOptions.map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`sub-${status}`}
                    checked={filters.submissionStatuses.includes(status)}
                    onChange={() => handleCheckboxChange("submission", status)}
                    className="h-4 w-4 text-[#741CDD] border-gray-300 rounded focus:ring-[#741CDD] disabled:opacity-50"
                    //Disable if another checkbox in this group is checked
                    disabled={
                      (!!activeFilterKey && activeFilterKey !== "submission") ||
                      (filters.submissionStatuses.length > 0 &&
                        !filters.submissionStatuses.includes(status))
                    }
                  />
                  <label
                    htmlFor={`sub-${status}`}
                    className={`ml-2 text-sm ${
                      (!!activeFilterKey && activeFilterKey !== "submission") ||
                      (filters.submissionStatuses.length > 0 &&
                        !filters.submissionStatuses.includes(status))
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* My Approval Status Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              My Approval Status
            </label>
            <div className="space-y-2">
              {approvalStatusOptions.map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`app-${status}`}
                    checked={filters.approvalStatuses.includes(status)}
                    onChange={() => handleCheckboxChange("approval", status)}
                    className="h-4 w-4 text-[#741CDD] border-gray-300 rounded focus:ring-[#741CDD] disabled:opacity-50"
                    //  Disable if another checkbox in this group is checked
                    disabled={
                      (!!activeFilterKey && activeFilterKey !== "approval") ||
                      (filters.approvalStatuses.length > 0 &&
                        !filters.approvalStatuses.includes(status))
                    }
                  />
                  <label
                    htmlFor={`app-${status}`}
                    className={`ml-2 text-sm ${
                      (!!activeFilterKey && activeFilterKey !== "approval") ||
                      (filters.approvalStatuses.length > 0 &&
                        !filters.approvalStatuses.includes(status))
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-4">
          <button
            onClick={handleClear}
            className="flex-1 w-full px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            CLEAR
          </button>
          <button
            onClick={handleApply}
            className="flex-1 w-full px-4 py-2 text-sm font-semibold text-white bg-[#741CDD] rounded-md shadow-sm hover:bg-purple-700"
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
};

export default DsrFilterSidebar;
