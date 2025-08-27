import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalaryComponents } from "../../../../store/slice/salarySlice"; // Adjust path as needed
import type { AppDispatch, RootState } from "../../../../store/store"; // Adjust path as needed

// Define the shape of the data for clarity and type-safety
interface ComponentItem {
  name: string;
  code: string;
  value: string;
  amount: string;
}

interface SalaryComponents {
  EARNING: ComponentItem[];
  STATUTORIES: ComponentItem[];
}

// Define props for the component
interface SalaryDistributionProps {
  groupname: string;
}

const SalaryDistribution: React.FC<SalaryDistributionProps> = ({
  groupname,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { components, loading, error } = useSelector(
    (state: RootState) => state.salary
  );

  // Fetch the data on component mount, now using the groupname from props
  useEffect(() => {
    if (groupname) {
      dispatch(fetchSalaryComponents(groupname));
    }
  }, [dispatch, groupname]);

  // Handle different states (loading, error, data)
  const renderContent = () => {
    if (loading === "pending") {
      return (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
          <span className="ml-4">Loading Salary Details...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-bold text-red-800">Failed to Load Data</h3>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      );
    }

    if (!components) {
      return (
        <div className="text-center py-10 text-gray-500">
          No salary distribution data found.
        </div>
      );
    }

    const { EARNING, STATUTORIES } = components;

    // Helper function to render a table section
    const renderTable = (title: string, items: ComponentItem[] | undefined) => {
      if (!items || items.length === 0) {
        return null;
      }

      return (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {item.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {parseFloat(item.amount).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    return (
      <div className="p-4 md:p-6 space-y-6">
        {renderTable("Earnings", EARNING)}
        {renderTable("Statutory Deductions", STATUTORIES)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto">{renderContent()}</div>
    </div>
  );
};

export default SalaryDistribution;
