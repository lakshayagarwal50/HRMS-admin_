import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalaryComponents } from "../../../../store/slice/salarySlice"; // Adjust path as needed
import type { AppDispatch, RootState } from "../../../../store/store"; // Adjust path as needed

// Import your shared SectionHeader
import { SectionHeader } from "../common/DetailItem";

// Define the shape of a single component item
interface ComponentItem {
  name: string;
  code: string;
  value: string;
  amount: string;
}

// Flexible interface to handle any key from the API
interface SalaryComponents {
  [key: string]: ComponentItem[];
}

interface SalaryDistributionProps {
  groupname: string;
}

// Format titles (EARNING → Earnings, STATUTORIES → Statutory Deductions, etc.)
const formatTitle = (key: string): string => {
  if (!key) return "";
  const formatted = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
  if (formatted === "Statutories") return "Statutory Deductions";
  return formatted;
};

const SalaryDistribution: React.FC<SalaryDistributionProps> = ({
  groupname,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { components, loading, error } = useSelector(
    (state: RootState) =>
      state.salary as {
        components: SalaryComponents | null;
        loading: "idle" | "pending";
        error: string | null;
      }
  );

  useEffect(() => {
    if (groupname) {
      dispatch(fetchSalaryComponents(groupname));
    }
  }, [dispatch, groupname]);

  const renderTable = (title: string, items: ComponentItem[]) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Section title bar (kept purple like you had) */}
        <div className="bg-purple-50 text-purple-800 font-semibold px-4 py-3 border-b border-purple-200">
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

    if (!components || Object.keys(components).length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
          No salary distribution data found.
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {Object.entries(components).map(([category, items]) =>
          renderTable(formatTitle(category), items)
        )}
      </div>
    );
  };

  return (
    <div>
      {/* ✅ Page Title, consistent with other detail sections */}
      <SectionHeader title="Salary Distribution" action={null} />

      <div className="mt-4">{renderContent()}</div>
    </div>
  );
};

export default SalaryDistribution;
