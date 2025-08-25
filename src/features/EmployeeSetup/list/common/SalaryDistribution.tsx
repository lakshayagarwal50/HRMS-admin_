import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalaryComponents } from "../../../../store/slice/salarySlice";
import type { AppDispatch, RootState } from "../../../../store/store";

// Define the shape of the data for clarity and type-safety
interface ComponentItem {
  name: string;
  code: string;
  value: string;
  amount: string;
}

interface SalaryComponents {
  EARNINGS: ComponentItem[];
  STATUTORIES: ComponentItem[];
}

const SalaryContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select the necessary state from the Redux store
  const { data, loading, error } = useSelector(
    (state: RootState) => state.salary
  );

  // Hardcode the payslip component group name for this example
  const groupname = "Default";

  // Fetch the data on component mount
  useEffect(() => {
    dispatch(fetchSalaryComponents(groupname));
  }, [dispatch, groupname]);

  // Handle different states (loading, error, data)
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-4">Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 text-red-600">Error: {error}</div>
      );
    }

    if (!data) {
      return (
        <div className="text-center py-10 text-gray-500">
          No salary distribution data found.
        </div>
      );
    }

    const { EARNINGS, STATUTORIES } = data;

    // Helper function to render a table section
    const renderTable = (title: string, items: ComponentItem[]) => (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-purple-100 text-purple-800 font-semibold px-4 py-3 border-b border-purple-200">
          {title}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formula/Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.code}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    return (
      <div className="p-4 md:p-6 space-y-6">
        {/* Render the tables */}
        {renderTable("EARNINGS", EARNINGS)}
        {renderTable("STATUTORIES", STATUTORIES)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {renderContent()}
    </div>
  );
};

export default SalaryContent;
