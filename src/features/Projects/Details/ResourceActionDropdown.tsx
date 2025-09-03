
import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";

interface ResourceActionDropdownProps {
  onAction: (actionName: "Edit" | "Release") => void;
}

const ResourceActionDropdown: React.FC<ResourceActionDropdownProps> = ({ onAction }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions: ("Edit" | "Release")[] = ["Edit", "Release"];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button onClick={() => setOpen((prev) => !prev)} className="p-2 rounded-full hover:bg-gray-100">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
          {actions.map((action) => (
            <button
              key={action}
              onClick={() => {
                setOpen(false);
                onAction(action);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {action}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceActionDropdown;