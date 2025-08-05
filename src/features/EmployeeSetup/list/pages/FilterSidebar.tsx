import React, { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";

interface Filters {
  startDate: string;
  endDate: string;
  department: string;
  designation: string;
  location: string;
}

interface FilterSidebarProps {
  initialFilters: Filters;
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
  onClear: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  initialFilters,
  isOpen,
  onClose,
  onApply,
  onClear,
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  const departmentOptions = [
    "All",
    "Designing",
    "Development",
    "QA",
    "Project Manager",
  ];
  const designationOptions = [
    "All",
    "Designing",
    "Development",
    "QA",
    "Management",
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[99] flex justify-end animate-fade-in-right">
      <div className="bg-white w-full sm:w-96 h-full shadow-lg p-6 relative overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter</h2>

        <div className="mb-4">
          <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
            Joining Date
          </label>
          <div className="relative mb-2">
            <input
              type="date"
              value={localFilters.startDate}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, startDate: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2"
            />
            <CalendarDays
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={localFilters.endDate}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, endDate: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2"
            />
            <CalendarDays
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
            Department
          </label>
          <div className="flex flex-col gap-2">
            {departmentOptions.map((dept) => (
              <button
                key={dept}
                onClick={() =>
                  setLocalFilters({ ...localFilters, department: dept })
                }
                className={`px-4 py-2 rounded-md text-sm w-full text-left ${
                  localFilters.department === dept
                    ? "bg-gray-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
            Designation
          </label>
          <div className="flex flex-col gap-2">
            {designationOptions.map((desig) => (
              <button
                key={desig}
                onClick={() =>
                  setLocalFilters({ ...localFilters, designation: desig })
                }
                className={`px-4 py-2 rounded-md text-sm w-full text-left ${
                  localFilters.designation === desig
                    ? "bg-gray-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {desig}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
            Location
          </label>
          <input
            type="text"
            value={localFilters.location}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, location: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., Delhi"
          />
        </div>

        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={onClear}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm"
          >
            CLEAR
          </button>
          <button
            onClick={() => onApply(localFilters)}
            className="bg-[#741CDD] text-white px-6 py-2 rounded-md text-sm"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
