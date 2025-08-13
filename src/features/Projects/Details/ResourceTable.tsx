// // src/features/Projects/Details/components/ResourceTable.tsx

// import React from "react";
// import Table, { type Column } from "../../../components/common/Table";
// import type { ProjectResource } from "../../../types/project";
// import ResourceActionDropdown from "./ResourceActionDropdown";

// interface ResourceTableProps {
//   resources: ProjectResource[];
//   onEdit: (resource: ProjectResource) => void;
//   onRelease: (resource: ProjectResource) => void;
// }

// const ResourceTable: React.FC<ResourceTableProps> = ({ resources, onEdit, onRelease }) => {
//   const handleAction = (actionName: string, resource: ProjectResource) => {
//     if (actionName === "Edit") {
//       onEdit(resource);
//     } else if (actionName === "Release") {
//       onRelease(resource);
//     }
//   };

//   const columns: Column<ProjectResource>[] = [
//     { key: "empCode", header: "Employee ID" },
//     { key: "name", header: "Name" },
//     { key: "department", header: "Department" },
//     { key: "designation", header: "Designation" },
//     { key: "allocatedHours", header: "Allocated Hours" },
//     { key: "allocatedFrom", header: "Allocated From" },
//     { key: "allocatedtill", header: "Allocation Till" },
//     { key: "hoursLogged", header: "Hours Logged" },
//     { key: "experience", header: "Experience" },
//     {
//       key: "action",
//       header: "Action",
//       render: (row) => <ResourceActionDropdown onAction={(action) => handleAction(action, row)} />,
//     },
//   ];

//   return <Table columns={columns} data={resources} showSearch={false} />;
// };

// export default ResourceTable;

import React from "react";
import Table, { type Column } from "../../../components/common/Table";
import type { ProjectResource } from "../../../types/project";
import ResourceActionDropdown from "./ResourceActionDropdown";

interface ResourceTableProps {
  resources: ProjectResource[];
  onEdit: (resource: ProjectResource) => void;
  onRelease: (resource: ProjectResource) => void;
}

const ResourceTable: React.FC<ResourceTableProps> = ({ resources, onEdit, onRelease }) => {
  const handleAction = (actionName: string, resource: ProjectResource) => {
    if (actionName === "Edit") {
      onEdit(resource);
    } else if (actionName === "Release") {
      onRelease(resource);
    }
  };

  const columns: Column<ProjectResource>[] = [
    { key: "empCode", header: "Employee ID" },
    { key: "name", header: "Name" },
    { key: "department", header: "Department" },
    { key: "designation", header: "Designation" },
    { key: "allocatedHours", header: "Allocated Hours" },
    { key: "allocatedFrom", header: "Allocated From" },
    { key: "allocatedTill", header: "Allocation Till" }, // Fixed key to match API response
    { key: "hoursLogged", header: "Hours Logged" },
    { key: "experience", header: "Experience" },
    {
      key: "action",
      header: "Action",
      render: (row) => <ResourceActionDropdown onAction={(action) => handleAction(action, row)} />,
    },
  ];

  return <Table columns={columns} data={resources} showSearch={false} />;
};

export default ResourceTable;