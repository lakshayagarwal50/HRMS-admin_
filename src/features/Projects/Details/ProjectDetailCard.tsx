

import React from "react";
import type { Project } from "../../../types/project";

interface ProjectDetailCardProps {
  project: Project;
}

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid grid-cols-2 py-3 px-4 border-b last:border-b-0">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="text-sm text-gray-900">{value}</dd>
  </div>
);

const ProjectDetailCard: React.FC<ProjectDetailCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-800 p-4 border-b">
        Project Detail
      </h2>
      <dl>
        <DetailItem label="Project Name" value={project.projectName} />
        <DetailItem label="Billing Type" value={project.billingType} />
        <DetailItem label="Project Status" value={project.status} />
        <DetailItem 
          label="Creation Date" 
          value={new Date(project.creationDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
      </dl>
    </div>
  );
};

export default ProjectDetailCard;