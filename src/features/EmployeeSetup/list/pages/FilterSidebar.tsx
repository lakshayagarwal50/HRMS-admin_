import React, { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import toast from "react-hot-toast"; 

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

//main body
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  initialFilters,
  isOpen,
  onClose,
  onApply,
  onClear,
}) => {
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    setLocalFilters(initialFilters);
    if (initialFilters.startDate || initialFilters.endDate) {
      setActiveFilter("date");
    } else if (initialFilters.department !== "All") {
      setActiveFilter("department");
    } else if (initialFilters.designation !== "All") {
      setActiveFilter("designation");
    } else if (initialFilters.location) {
      setActiveFilter("location");
    } else {
      setActiveFilter(null);
    }
  }, [initialFilters, isOpen]);

  const departmentOptions = [
    "All",
    "Automation",
    "IT",
    "Testing",
    "Development",
    "Finance",
    "HR",
    "Design",
  ];
  const designationOptions = [
    "All",
    "Manager",
    "Team member",
    "Snr. HR",
    "Junior HR",
  ];

  if (!isOpen) {
    return null;
  }

  const handleClear = () => {
    onClear();
    setActiveFilter(null);
    toast("All filters have been cleared.", {
      icon: "ℹ️", 
      className: "bg-blue-50 text-blue-800",
    });
    onClose();
  };

  const handleApply = () => {
    
    if (
      localFilters.startDate &&
      localFilters.endDate &&
      new Date(localFilters.endDate) < new Date(localFilters.startDate)
    ) {
      toast.error("End date cannot be before the start date.", {
        className: "bg-red-50 text-red-800",
      });
      return; 
    }

    onApply(localFilters);
    toast.success("Filters applied successfully!", {
      className: "bg-green-50 text-green-800",
    });
    onClose();
  };

  const getSectionClasses = (filterName: string) => {
    return activeFilter && activeFilter !== filterName
      ? "opacity-50 pointer-events-none"
      : "";
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[99] flex justify-end animate-fade-in-right">
      <div className="bg-white w-full sm:w-96 h-full shadow-lg p-6 relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          ✖
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Filter</h2>

        <div className="flex-grow overflow-y-auto">
          <div
            className={`mb-4 transition-opacity ${getSectionClasses("date")}`}
          >
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Joining Date
            </label>
            <div className="relative mb-2">
              <input
                type="date"
                value={localFilters.startDate}
                onChange={(e) => {
                  setLocalFilters({
                    ...localFilters,
                    startDate: e.target.value,
                  });
                  setActiveFilter("date");
                }}
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
                onChange={(e) => {
                  setLocalFilters({ ...localFilters, endDate: e.target.value });
                  setActiveFilter("date");
                }}
                className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2"
              />
              <CalendarDays
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div
            className={`mb-4 transition-opacity ${getSectionClasses(
              "department"
            )}`}
          >
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Department
            </label>
            <div className="flex flex-col gap-2">
              {departmentOptions.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    setLocalFilters({ ...localFilters, department: dept });
                    setActiveFilter("department");
                  }}
                  className={`px-4 py-2 rounded-md text-sm w-full text-left ${
                    localFilters.department === dept
                      ? "bg-[#741CDD] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
          <div
            className={`mb-4 transition-opacity ${getSectionClasses(
              "designation"
            )}`}
          >
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Designation
            </label>
            <div className="flex flex-col gap-2">
              {designationOptions.map((desig) => (
                <button
                  key={desig}
                  onClick={() => {
                    setLocalFilters({ ...localFilters, designation: desig });
                    setActiveFilter("designation");
                  }}
                  className={`px-4 py-2 rounded-md text-sm w-full text-left ${
                    localFilters.designation === desig
                      ? "bg-[#741CDD] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {desig}
                </button>
              ))}
            </div>
          </div>
          <div
            className={`mb-4 transition-opacity ${getSectionClasses(
              "location"
            )}`}
          >
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Location
            </label>
            <input
              type="text"
              value={localFilters.location}
              onChange={(e) => {
                setLocalFilters({ ...localFilters, location: e.target.value });
                setActiveFilter("location");
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., Delhi"
            />
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-6 pt-4 border-t">
          <button
            onClick={handleClear}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm w-full"
          >
            CLEAR
          </button>
          <button
            onClick={handleApply}
            className="bg-[#741CDD] text-white px-6 py-2 rounded-md text-sm w-full"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
