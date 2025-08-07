// features/projects/list/pages/ActionDropdown.tsx
import React, { useState } from "react";
import type { Project } from "../../../../types/project";

interface ActionDropdownProps {
  project: Project;
  onAction: (action: string, project: Project) => void;
  options: string[];
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  project,
  onAction,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-1 text-sm text-gray-600 hover:text-[#741CDD] focus:outline-none"
      >
        Actions
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onAction(option, project);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;