// ActionDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

interface ActionDropdownProps {
  // Add a prop to pass the employee code to the dropdown
  employeeCode: string;
  // A callback function that takes the action name and employee code
  onAction: (actionName: string, employeeCode: string) => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  employeeCode,
  onAction,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    "View Details",
    "Create Payslip",
    "Make Inactive",
    "Delete",
    "Invite",
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none flex flex-col">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                setOpen(false);
                // Call the onAction prop with the action and employeeCode
                onAction(action, employeeCode);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-[#f5f5f5]" // Added hover style
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
