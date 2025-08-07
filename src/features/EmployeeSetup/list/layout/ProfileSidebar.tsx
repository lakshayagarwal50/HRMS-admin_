import React from "react";

export const menuItems: readonly string[] = [
  "GENERAL",
  "PROFESSIONAL",
  "BANK DETAIL",
  "PF, ESI & PT",
  "DECLARATION",
  "SALARY DISTRIBUTION",
  "PAYSLIPS",
  "ATTENDANCE",
  "LOAN AND ADVANCES",
  "PREVIOUS JOB DETAILS",
  "EMPLOYEE ACTIVITIES",
  "PROJECTS",
];


export interface ProfileSidebarProps {
  onSectionChange: (sectionKey: string) => void;
  activeItem: string;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  onSectionChange,
  activeItem,
}) => {
  const handleItemClick = (item: string) => {
   
    if (typeof onSectionChange === "function") {
      onSectionChange(item.toLowerCase().replace(/, | & | /g, "_"));
    }
  };

  return (
    <div className="w-full md:w-[260px] font-sans shrink-0">
      <ul className="list-none m-0 p-0 overflow-hidden rounded-lg border-2 border-[#d7d9f3]">
        {menuItems.map((item) => {
          const key = item.toLowerCase().replace(/, | & | /g, "_");
          const isActive = activeItem === key;
          const baseClasses =
            "py-4 pr-6 text-sm uppercase cursor-pointer border-b border-gray-200 last:border-b-0 transition-colors duration-200 ease-in-out";
          const activeClasses =
            "bg-[#741CDD] text-white font-semibold border-l-4 border-[#5a16ad] pl-5";
          const inactiveClasses =
            "text-gray-800 font-medium hover:bg-[#f8f6ff] hover:text-[#741CDD] pl-6";

          return (
            <li
              key={item}
              onClick={() => handleItemClick(item)}
              className={`${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && handleItemClick(item)
              }
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProfileSidebar;
