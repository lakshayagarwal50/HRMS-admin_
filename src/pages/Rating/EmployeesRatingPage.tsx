import React, { useState, useEffect, useRef, useMemo} from 'react';
import { MoreHorizontal, ChevronRight, SlidersHorizontal, X, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Component Imports ---
import Table, { type Column } from '../../components/common/Table'; 
import RequestRatingModal from '../../components/Modal/RequestRatingModal'; // Updated import
import SidePanelForm from '../../components/common/SidePanelForm';

// --- TYPE DEFINITIONS ---
interface EmployeeRating {
  id: string;
  employee: string;
  code: string;
  department: string;
  designation: string;
  yearOfExperience: number;
  overallAverageRating: number;
  project?: string;
}

export interface RatingFilters {
  department: string;
  project: string;
}

// --- MOCK DATA ---
const employeeRatingData: EmployeeRating[] = [
  { id: '1', employee: 'Surendranath Malviya', code: '845161', department: 'Business Analyst', designation: 'Business Analyst', yearOfExperience: 1, overallAverageRating: 4.5, project: 'PyThru' },
  { id: '2', employee: 'Nakula Bagchi', code: '64161', department: 'Project Management', designation: 'Project Management', yearOfExperience: 3, overallAverageRating: 4.1, project: 'Project A' },
  { id: '3', employee: 'Kusika Dalavi', code: '75453', department: 'Quality Analyst', designation: 'Quality Analyst', yearOfExperience: 4, overallAverageRating: 3.8, project: 'PyThru' },
  { id: '4', employee: 'Kanada Kashyap', code: '94131', department: 'Designing', designation: 'Design', yearOfExperience: 5, overallAverageRating: 4.9, project: 'Project B' },
  { id: '5', employee: 'John Doe', code: '12345', department: 'Development', designation: 'Software Engineer', yearOfExperience: 2, overallAverageRating: 4.2, project: 'PyThru' },
  { id: '6', employee: 'Jane Smith', code: '67890', department: 'QA', designation: 'QA Engineer', yearOfExperience: 3, overallAverageRating: 4.8, project: 'Project A' },
];

// --- Filter Component ---
const FilterEmployeesRating: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: RatingFilters) => void;
  initialFilters: RatingFilters | null;
}> = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [department, setDepartment] = useState('');
  const [project, setProject] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDepartment(initialFilters?.department || '');
      setProject(initialFilters?.project || '');
    }
  }, [isOpen, initialFilters]);

  const handleClear = () => {
    setDepartment('');
    setProject('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply({ department, project });
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Filter"
      onSubmit={handleSubmit}
      submitText="APPLY"
      onClear={handleClear} // Assuming SidePanelForm can handle an onClear prop
    >
      <div className="space-y-6">
        <div>
          <h3 className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 mb-2">Department <ChevronUp size={20} /></h3>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
            <option value="">Select...</option>
            <option value="Designing">Designing</option>
            <option value="Project Management">Project Management</option>
            <option value="Business Analyst">Business Analyst</option>
            <option value="Quality Analyst">Quality Analyst</option>
            <option value="Development">Development</option>
          </select>
        </div>
        <div>
          <h3 className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 mb-2">Project <ChevronUp size={20} /></h3>
          <select value={project} onChange={(e) => setProject(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
            <option value="">Select...</option>
            <option value="PyThru">PyThru</option>
            <option value="Project A">Project A</option>
            <option value="Project B">Project B</option>
          </select>
        </div>
      </div>
    </SidePanelForm>
  );
};


// --- MAIN PAGE COMPONENT ---
const EmployeesRatingPage: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); // State for the new modal
  const [appliedFilters, setAppliedFilters] = useState<RatingFilters | null>(null);

  const handleApplyFilters = (filters: RatingFilters) => {
    setAppliedFilters(filters);
  };

  const handleClearFilters = () => {
    setAppliedFilters(null);
  };

  const filteredData = useMemo(() => {
    if (!appliedFilters) {
      return employeeRatingData;
    }
    return employeeRatingData.filter(item => {
      const departmentMatch = !appliedFilters.department || item.department === appliedFilters.department;
      const projectMatch = !appliedFilters.project || item.project === appliedFilters.project;
      return departmentMatch && projectMatch;
    });
  }, [appliedFilters]);

  const columns = useMemo<Column<EmployeeRating>[]>(() => [
    { key: 'employee', header: 'Employee' },
    { key: 'code', header: 'Code' },
    { key: 'department', header: 'Department' },
    { key: 'designation', header: 'Designation' },
    { key: 'yearOfExperience', header: 'Year Of Experience' },
    { key: 'overallAverageRating', header: 'Overall average Rating' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="relative">
          <button 
            onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} 
            className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none"
          >
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
              <Link
                to={`/rating/detail/${row.id}`} // Restored original "View Detail" link
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View Detail
              </Link>
            </div>
          )}
        </div>
      ),
    },
  ], [activeDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const activeFilterCount = appliedFilters ? Object.values(appliedFilters).filter(Boolean).length : 0;

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees rating</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
              <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight size={16} className="mx-1" />
              <span className="font-medium text-gray-800">Rating</span>
               <ChevronRight size={16} className="mx-1" />
              <span className="font-medium text-gray-800">Employees rating</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsRequestModalOpen(true)} // Open the new modal
              className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">
              REQUEST RATING
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="p-2 border rounded-md text-gray-600 hover:bg-gray-100 relative"
            >
              <SlidersHorizontal size={20} />
              {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                      {activeFilterCount}
                  </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        {appliedFilters && (
            <div className="bg-gray-50 p-3 rounded-md mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-700">
                    Filters are active. {filteredData.length} results found.
                </p>
                <button onClick={handleClearFilters} className="flex items-center text-sm text-purple-600 hover:underline">
                    <X size={16} className="mr-1" />
                    Clear Filters
                </button>
            </div>
        )}

        {filteredData.length > 0 ? (
            <Table
                columns={columns}
                data={filteredData}
                showSearch={true}
                showPagination={true}
                searchPlaceholder="Search by employee name or code"
                defaultItemsPerPage={4}
            />
        ) : (
            <div className="text-center py-10 px-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">No Results Found</h3>
                <p className="mt-1 text-sm text-gray-600">
                    Your filter criteria did not match any records.
                </p>
            </div>
        )}
      </main>

      <RequestRatingModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      <FilterEmployeesRating
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={appliedFilters}
      />
    </div>
  );
};

export default EmployeesRatingPage;
