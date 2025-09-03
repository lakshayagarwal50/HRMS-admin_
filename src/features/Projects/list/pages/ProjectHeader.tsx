
import React from 'react';
import { Link } from 'react-router-dom';

interface ProjectHeaderProps {
  onAddProjectClick: () => void;
  onFilterClick: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  onAddProjectClick,
  onFilterClick,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-gray-800 mr-4">All Projects</h1>
        <div className="text-sm font-medium">
          <Link to="/dashboard" className="text-gray-500 hover:text-[#741CDD]">Dashboard</Link>
          <span className="text-gray-500 mx-2">/</span>
          <span className="text-gray-700">Projects</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onAddProjectClick}
          className="bg-[#741CDD] hover:bg-[#5b14a9] text-white px-4 py-2 text-sm rounded transition duration-200"
        >
          + ADD PROJECT
        </button>
        <button
          onClick={onFilterClick}
          className="border border-[#741CDD] text-[#741CDD] hover:bg-[#f0e6fa] px-4 py-2 text-sm rounded transition duration-200"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default ProjectHeader;