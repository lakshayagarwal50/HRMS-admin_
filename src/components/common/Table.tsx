// import React, { useEffect,useState, type ReactNode } from "react";

// export interface Column<T> {
//   key: keyof T | "action";
//   header: string;
//   render?: (row: T) => ReactNode;
//   className?: string;
// }

// interface TableProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   itemsPerPageOptions?: number[];
//   defaultItemsPerPage?: number;
//   showPagination?: boolean;
//   showSearch?: boolean;
//   searchPlaceholder?: string;
//   onRowClick?: (row: T) => void;
//   className?: string;
// }

// const Table = <T extends object>({
//   data,
//   columns,
//   itemsPerPageOptions = [10, 25, 50],
//   defaultItemsPerPage = 10,
//   showPagination = true,
//   showSearch = true,
//   searchPlaceholder = "Search",
//   onRowClick,
//   className = "",
// }: TableProps<T>) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
//   const [searchTerm, setSearchTerm] = useState("");

//   // 2. Add a useEffect hook to reset the page when the search term changes.
//   useEffect(() => {
//     setCurrentPage(1); // Go back to the first page of results
//   }, [searchTerm]);

//   const filteredData = data.filter((row) =>
//     Object.values(row).some((value) =>
//       value != null
//         ? String(value).toLowerCase().includes(searchTerm.toLowerCase())
//         : false
//     )
//   );

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

//   const paginate = (pageNumber: number) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <div className={`table-container ${className}`}>
//       <div className="table-controls flex justify-between items-center mb-4">
//         <div className="flex items-center space-x-2">
//           <label htmlFor="items-per-page" className="text-sm text-gray-700">
//             Show
//           </label>
//           <select
//             id="items-per-page"
//             value={itemsPerPage}
//             onChange={(e) => setItemsPerPage(Number(e.target.value))}
//             className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             {itemsPerPageOptions.map((option) => (
//               <option key={option} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//           <span className="text-sm text-gray-700">entries</span>
//         </div>

//         {showSearch && (
//           <div className="search-bar relative">
//             <input
//               type="text"
//               placeholder={searchPlaceholder}
//               value={searchTerm}
//              onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 // --- THIS IS THE KEY FIX ---
//                 // Reset to the first page whenever the user types a new search query.
//                 setCurrentPage(1);
//               }}
//               className="border rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         )}
//       </div>

//       <div className="overflow-x-auto border rounded-md shadow-sm">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {columns.map((column) => (
//                 <th
//                   key={String(column.key)}
//                   className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
//                     column.className || ""
//                   }`}
//                 >
//                   {column.header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentItems.length > 0 ? (
//               currentItems.map((row, rowIndex) => (
//                 <tr
//                   key={`row-${rowIndex}`}
//                   className={`hover:bg-gray-100 ${
//                     onRowClick ? "cursor-pointer" : ""
//                   }`}
//                   onClick={() => onRowClick?.(row)}
//                 >
//                   {columns.map((column) => (
//                     <td
//                       key={String(column.key)}
//                       className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
//                         column.className || ""
//                       }`}
//                     >
//                       {column.render
//                         ? column.render(row)
//                         : column.key === "action"
//                         ? null
//                         : (row as any)[column.key]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="px-6 py-4 text-center text-gray-500"
//                 >
//                   No data available.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {showPagination && totalPages > 1 && (
//         <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
//           <span>
//             Showing {indexOfFirstItem + 1} to{" "}
//             {Math.min(indexOfLastItem, filteredData.length)} of{" "}
//             {filteredData.length} items
//           </span>
//           <div className="flex space-x-1">
//             <button
//               onClick={() => paginate(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => paginate(page)}
//                 className={`px-3 py-1 border rounded ${
//                   currentPage === page
//                     ? "bg-purple-600 text-white"
//                     : "bg-white hover:bg-gray-100"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//             <button
//               onClick={() => paginate(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Table;


import React, { useEffect,useState, type ReactNode } from "react";

export interface Column<T> {
  key: keyof T | "action";
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  showItemsPerPage?: boolean; // New optional prop
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

const Table = <T extends object>({
  data,
  columns,
  itemsPerPageOptions = [10, 25, 50],
  defaultItemsPerPage = 10,
  showPagination = true,
  showSearch = true,
  showItemsPerPage = true, // Default value to maintain backward compatibility
  searchPlaceholder = "Search",
  onRowClick,
  className = "",
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value != null
        ? String(value).toLowerCase().includes(searchTerm.toLowerCase())
        : false
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className={`table-container ${className}`}>
      <div className="table-controls flex justify-between items-center mb-4">
        {/* Conditionally render the "Show entries" dropdown */}
        {showItemsPerPage && (
          <div className="flex items-center space-x-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-700">
              Show
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>
        )}

        {showSearch && (
          <div className="search-bar relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-md pl-8 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto border rounded-md shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.className || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((row, rowIndex) => (
                <tr
                  key={`row-${rowIndex}`}
                  className={`hover:bg-gray-100 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        column.className || ""
                      }`}
                    >
                      {column.render
                        ? column.render(row)
                        : column.key === "action"
                        ? null
                        : (row as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div className="pagination flex justify-between items-center mt-4 text-sm text-gray-700">
          <span>
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredData.length)} of{" "}
            {filteredData.length} items
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? "bg-purple-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;