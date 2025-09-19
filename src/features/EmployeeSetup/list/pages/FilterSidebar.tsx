import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../../../store/store";
import { fetchDepartments } from "../../../../store/slice/departmentSlice";
import {
  fetchEmployeeDesignations,
  resetEmployeeDesignations,
} from "../../../../store/slice/employeeDesignationSlice";
import { fetchLocations } from "../../../../store/slice/locationSlice";

interface Filters {
  startDate: string;
  endDate: string;
  department: string[];
  designation: string[];
  location: string[];
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
  const maxDate = new Date().toISOString().split("T")[0];

  const dispatch = useDispatch<AppDispatch>();
  const { items: departmentOptions, status: departmentStatus } = useSelector(
    (state: RootState) => state.departments
  );
  const { items: designationOptions, status: designationStatus } = useSelector(
    (state: RootState) => state.employeeDesignations
  );
  const { items: locationOptions, status: locationStatus } = useSelector(
    (state: RootState) => state.locations
  );

  useEffect(() => {
    if (isOpen) {
      if (departmentStatus === "idle") {
        dispatch(fetchDepartments());
      }
      if (locationStatus === "idle") {
        dispatch(fetchLocations());
      }
    }
  }, [isOpen, departmentStatus, locationStatus, dispatch]);

  useEffect(() => {
    dispatch(resetEmployeeDesignations());
    if (localFilters.department.length > 0) {
      localFilters.department.forEach((deptName) => {
        dispatch(fetchEmployeeDesignations(deptName));
      });
    }
  }, [localFilters.department, dispatch]);

  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  if (!isOpen) {
    return null;
  }

  const handleClear = () => {
    onClear();
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

  const handleDepartmentToggle = (deptName: string) => {
    const newDepartments = localFilters.department.includes(deptName)
      ? localFilters.department.filter((d) => d !== deptName)
      : [...localFilters.department, deptName];
    setLocalFilters({
      ...localFilters,
      department: newDepartments,
      designation: [],
    });
  };

  const handleDesignationToggle = (desigName: string) => {
    const newDesignations = localFilters.designation.includes(desigName)
      ? localFilters.designation.filter((d) => d !== desigName)
      : [...localFilters.designation, desigName];
    setLocalFilters({ ...localFilters, designation: newDesignations });
  };

  const handleLocationToggle = (locName: string) => {
    const newLocations = localFilters.location.includes(locName)
      ? localFilters.location.filter((l) => l !== locName)
      : [...localFilters.location, locName];
    setLocalFilters({ ...localFilters, location: newLocations });
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
          <div className="mb-4 transition-opacity">
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Joining Date
            </label>
            <div className="relative mb-2">
              <input
                type="date"
                value={localFilters.startDate}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    startDate: e.target.value,
                  })
                }
                max={maxDate}
                className="w-full border border-gray-300 rounded-md pl-3 pr-2 py-2"
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
                max={maxDate}
                className="w-full border border-gray-300 rounded-md pl-3 pr-2 py-2"
              />
            </div>
          </div>

          {/* Department Section*/}
          <div className="mb-4 transition-opacity">
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Department
            </label>
            <div className="flex flex-col gap-2">
              {departmentStatus === "loading" && <p>Loading...</p>}
              {departmentStatus === "succeeded" &&
                departmentOptions.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => handleDepartmentToggle(dept.name)}
                    className={`px-4 py-2 rounded-md text-sm w-full text-left ${
                      localFilters.department.includes(dept.name)
                        ? "bg-[#741CDD] text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {dept.name}
                  </button>
                ))}
            </div>
          </div>

          {/*  Designation Section*/}
          <div className="mb-4 transition-opacity">
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Designation
            </label>
            <div className="flex flex-col gap-2">
              {localFilters.department.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Select a department to see designations.
                </p>
              ) : designationStatus === "loading" ? (
                <p>Loading...</p>
              ) : designationStatus === "succeeded" &&
                designationOptions.length > 0 ? (
                designationOptions.map((desig) => (
                  <button
                    key={desig.id}
                    onClick={() => handleDesignationToggle(desig.name)}
                    className={`px-4 py-2 rounded-md text-sm w-full text-left ${
                      localFilters.designation.includes(desig.name)
                        ? "bg-[#741CDD] text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {desig.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-500">No designations found.</p>
              )}
            </div>
          </div>

          {/* Location Section  */}
          <div className="mb-4 transition-opacity">
            <label className="block font-medium text-sm uppercase text-[#741CDD] mb-2">
              Location
            </label>
            <div className="flex flex-col gap-2">
              {locationStatus === "loading" && <p>Loading locations...</p>}
              {locationStatus === "succeeded" &&
                locationOptions.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleLocationToggle(loc.city)}
                    className={`px-4 py-2 rounded-md text-sm w-full text-left ${
                      localFilters.location.includes(loc.city)
                        ? "bg-[#741CDD] text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {loc.city}
                  </button>
                ))}
            </div>
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
