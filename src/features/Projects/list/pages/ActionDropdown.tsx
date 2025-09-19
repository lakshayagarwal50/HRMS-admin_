// import React, { useState, useEffect, useRef } from "react";
// import { MoreVertical } from "lucide-react";
// import type { Project } from "../../../../types/project";

// interface ActionDropdownProps {
//   project: Project;
//   onAction: (actionName: string, project: Project) => void;
// }

// const ActionDropdown: React.FC<ActionDropdownProps> = ({
//   project,
//   onAction,
// }) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const actions = [
//     "View Details",
//     "Edit",
//     project.status === "Active" ? "Make Inactive" : "Make Active",
//     "Delete",
//   ];

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="p-2 rounded-full hover:bg-gray-100"
//       >
//         <MoreVertical size={16} />
//       </button>
//       {open && (
//         <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none flex flex-col">
//           {actions.map((action, index) => (
//             <button
//               key={index}
//               onClick={() => {
//                 setOpen(false);
//                 onAction(action, project);
//               }}
//               className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//             >
//               {action}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActionDropdown;

import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import type { Project } from "../../../../types/project";

interface ActionDropdownProps {
  project: Project;
  onAction: (actionName: string, project: Project) => void;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  project,
  onAction,
}) => {
  const [open, setOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState<"up" | "down">("down");
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
    "Edit",
    project.status === "Active" ? "Make Inactive" : "Make Active",
    "Delete",
  ];

  // Check available space when opening
  useEffect(() => {
    if (open && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom + 200 > viewportHeight) {
        setOpenDirection("up");
      } else {
        setOpenDirection("down");
      }
    }
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-10 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none flex flex-col
            ${openDirection === "down" ? "top-full mt-2" : "bottom-full mb-2"}
          `}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                setOpen(false);
                onAction(action, project);
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

export default ActionDropdown;
