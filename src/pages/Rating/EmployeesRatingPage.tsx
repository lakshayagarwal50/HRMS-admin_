// import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
// import { MoreHorizontal, ChevronRight, SlidersHorizontal, X, ServerCrash, RefreshCw, ChevronDown } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import Table, { type Column } from '../../components/common/Table'; 
// import RequestRatingModal from '../../components/Modal/RequestRatingModal';
// import FilterEmployeesRating, { type RatingFilters } from '../../components/Rating/FilterEmployeesRating';
// import Toast from '../../components/common/Toast';
// import type { AppDispatch, RootState } from '../../store/store';
// import { fetchEmployeeRatings, type EmployeeRating } from '../../store/slice/employeesRatingSlice';

// const TableSkeleton: React.FC = () => (
//     <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
//         <div className="space-y-3">
//             {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>)}
//         </div>
//     </div>
// );

// const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
//     <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
//         <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
//         <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Data</h3>
//         <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
//         <div className="mt-6">
//             <button type="button" onClick={onRetry} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
//                 <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
//                 Try Again
//             </button>
//         </div>
//     </div>
// );

// const EmptyState: React.FC = () => (
//     <div className="text-center py-10 px-4 bg-gray-50 border border-gray-200 rounded-lg">
//         <h3 className="text-lg font-semibold text-gray-800">No Results Found</h3>
//     </div>
// );



// const EmployeesRatingPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { items: ratings, status, error } = useSelector((state: RootState) => state.employeesRating);

//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
//   const [appliedFilters, setAppliedFilters] = useState<RatingFilters | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
//   const [selectedYear, setSelectedYear] = useState('2025'); 

  
//   useEffect(() => {
//     const filters = {
//         year: selectedYear,
//         department: appliedFilters?.department || undefined,
//     };
//     dispatch(fetchEmployeeRatings(filters));
//   }, [dispatch, selectedYear, appliedFilters]);

//   const handleApplyFilters = useCallback((filters: RatingFilters) => {
//     setAppliedFilters(filters);

//   }, []);

//   const handleClearFilters = useCallback(() => {
//     setAppliedFilters(null);

//   }, []);

//   const handleRetry = useCallback(() => {
//       const filters = {
//         year: selectedYear,
//         department: appliedFilters?.department || undefined,
//     };
//     dispatch(fetchEmployeeRatings(filters));
//   }, [dispatch, appliedFilters, selectedYear]);

//   const columns = useMemo<Column<EmployeeRating>[]>(() => [
//     { key: 'employee', header: 'Employee' },
//     { key: 'code', header: 'Code' },
//     { key: 'department', header: 'Department' },
//     { key: 'designation', header: 'Designation' },
//     { key: 'yearOfExperience', header: 'Year Of Experience' },
//     { key: 'overallAverageRating', header: 'Overall average Rating', render: (row) => row.overallAverageRating.toFixed(2) },
//     {
//       key: 'action',
//       header: 'Action',
//       render: (row) => (
//         <div className="relative">
//           <button 
//             onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} 
//             className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none"
//           >
//             <MoreHorizontal size={20} />
//           </button>
//           {activeDropdown === row.id && (
//             <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
            
//               <Link
//                 to={`/rating/detail/${row.id}/${selectedYear}`}
//                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 View Detail
//               </Link>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ], [activeDropdown, selectedYear]); 

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setActiveDropdown(null);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);
  
//   const activeFilterCount = appliedFilters ? Object.values(appliedFilters).filter(Boolean).length : 0;
  
//   const renderContent = () => {
//       if (status === 'loading' || status === 'idle') {
//           return <TableSkeleton />;
//       }
//       if (status === 'failed') {
//           return <ErrorState onRetry={handleRetry} error={error} />;
//       }
//       if (status === 'succeeded' && ratings.length === 0) {
//           return <EmptyState />;
//       }
//       return (
//           <Table
//               columns={columns}
//               data={ratings}
//               showSearch={true}
//               showPagination={true}
//               searchPlaceholder="Search by employee name or code"
//               defaultItemsPerPage={10}
//           />
//       );
//   };

//   return (
//     <div className="w-full bg-white p-6 rounded-lg shadow-md">
//        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
//       <header className="mb-6">
//         <div className="flex justify-between items-center flex-wrap gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Employees rating</h1>
//             <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
//                <span className="font-medium text-gray-800">Rating</span>
//               <ChevronRight size={16} className="mx-1" />
//               <span className="font-medium text-gray-800">Employees rating</span>
//             </nav>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="relative">
//                 <select
//                   value={selectedYear}
//                   onChange={(e) => setSelectedYear(e.target.value)}
//                   className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white"
//                 >
//                   <option>2024</option>
//                   <option>2025</option>
//                 </select>
//                 <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
//             </div>
//             <button 
//               onClick={() => setIsRequestModalOpen(true)}
//               className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">
//               REQUEST RATING
//             </button>
//             <button
//               onClick={() => setIsFilterOpen(true)}
//               className="p-2 border rounded-md text-gray-600 hover:bg-gray-100 relative"
//             >
//               <SlidersHorizontal size={20} />
//               {activeFilterCount > 0 && (
//                   <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
//                       {activeFilterCount}
//                   </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       <main>
//         {appliedFilters && (
//             <div className="bg-gray-50 p-3 rounded-md mb-4 flex justify-between items-center">
//                 <p className="text-sm text-gray-700">
//                     Filters are active. {ratings.length} results found.
//                 </p>
//                 <button onClick={handleClearFilters} className="flex items-center text-sm text-purple-600 hover:underline">
//                     <X size={16} className="mr-1" />
//                     Clear Filters
//                 </button>
//             </div>
//         )}
//         {renderContent()}
//       </main>

//       <RequestRatingModal
//         isOpen={isRequestModalOpen}
//         onClose={() => setIsRequestModalOpen(false)}
//         setToast={setToast}
//       />

//       <FilterEmployeesRating
//         isOpen={isFilterOpen}
//         onClose={() => setIsFilterOpen(false)}
//         onApply={handleApplyFilters}
//         initialFilters={appliedFilters}
//       />
//     </div>
//   );
// };

// export default EmployeesRatingPage;


import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MoreHorizontal, ChevronRight, SlidersHorizontal, X, ServerCrash, RefreshCw, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// --- Component & Redux Imports ---
import Table, { type Column } from '../../components/common/Table'; 
import RequestRatingModal from '../../components/Modal/RequestRatingModal';
import FilterEmployeesRating, { type RatingFilters } from '../../components/Rating/FilterEmployeesRating';
import Toast from '../../components/common/Toast';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchEmployeeRatings, type EmployeeRating } from '../../store/slice/employeesRatingSlice';


// --- UI State Components ---
const TableSkeleton: React.FC = () => (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>)}
        </div>
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
        <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Data</h3>
        <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
        <div className="mt-6">
            <button type="button" onClick={onRetry} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                Try Again
            </button>
        </div>
    </div>
);

const EmptyState: React.FC = () => (
    <div className="text-center py-10 px-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800">No Results Found</h3>
    </div>
);


// --- MAIN PAGE COMPONENT ---
const EmployeesRatingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: ratings, status, error } = useSelector((state: RootState) => state.employeesRating);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<RatingFilters | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // This single, optimized effect handles all data fetching.
  // It automatically re-runs whenever the selected year or applied filters change.
  useEffect(() => {
    const filtersToApply = {
        year: selectedYear,
        ...appliedFilters,
    };
    dispatch(fetchEmployeeRatings(filtersToApply));
  }, [dispatch, selectedYear, appliedFilters]);

  const handleApplyFilters = useCallback((filters: RatingFilters) => {
    setAppliedFilters(filters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(null);
  }, []);

  const handleRetry = useCallback(() => {
    const filtersToApply = {
        year: selectedYear,
        ...appliedFilters,
    };
    dispatch(fetchEmployeeRatings(filtersToApply));
  }, [dispatch, appliedFilters, selectedYear]);

  // This `useMemo` is now correctly optimized. It only depends on `selectedYear` for the links.
  // The state of the dropdown is handled separately and won't cause the entire table to re-render.
  const columns = useMemo<Column<EmployeeRating>[]>(() => [
    { key: 'employee', header: 'Employee' },
    { key: 'code', header: 'Code' },
    { key: 'department', header: 'Department' },
    { key: 'designation', header: 'Designation' },
    { key: 'yearOfExperience', header: 'Year Of Experience' },
    { key: 'overallAverageRating', header: 'Overall average Rating', render: (row) => row.overallAverageRating.toFixed(2) },
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
                to={`/rating/detail/${row.id}/${selectedYear}`}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View Detail
              </Link>
            </div>
          )}
        </div>
      ),
    },
  ], [activeDropdown, selectedYear]); 

  // This effect handles closing the action dropdown when clicking outside of it.
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
  
  const renderContent = () => {
      if ((status === 'loading' || status === 'idle') && ratings.length === 0) {
          return <TableSkeleton />;
      }
      if (status === 'failed') {
          return <ErrorState onRetry={handleRetry} error={error} />;
      }
      if (status === 'succeeded' && ratings.length === 0) {
          return <EmptyState />;
      }
      return (
          <Table
              columns={columns}
              data={ratings}
              showSearch={true}
              showPagination={true}
              searchPlaceholder="Search by employee name or code"
              defaultItemsPerPage={10}
          />
      );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees rating</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
               <span className="font-medium text-gray-800">Rating</span>
              <ChevronRight size={16} className="mx-1" />
              <span className="font-medium text-gray-800">Employees rating</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="appearance-none w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white"
                >
                  <option>2025</option>
                  <option>2024</option>
                </select>
                <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <button 
              onClick={() => setIsRequestModalOpen(true)}
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
                    Filters are active. {ratings.length} results found.
                </p>
                <button onClick={handleClearFilters} className="flex items-center text-sm text-purple-600 hover:underline">
                    <X size={16} className="mr-1" />
                    Clear Filters
                </button>
            </div>
        )}
        {renderContent()}
      </main>

      <RequestRatingModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        setToast={setToast}
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

