import React from "react";
import { Pencil } from "lucide-react"; // Importing the edit icon

// Define a TypeScript type for the data structure for type safety
interface Detail {
  label: string;
  value: string | number;
}

// Mock data based on the provided image
const pfEsiDetails: Detail[] = [
  { label: "Employee PF Enabled", value: "Yes" },
  { label: "Employee PF Number", value: "9874563210" },
  { label: "Employee UAN Number", value: "4567893215" },
  { label: "Employer PF Enabled", value: "Yes" },
  { label: "ESI Enabled", value: "Yes" },
  { label: "ESI Number", value: "9874563210" },
  { label: "Professional Tax Enabled", value: "Yes" },
  { label: "Labour Welfare Fund Enabled", value: "Yes" },
];

const PfEsiComponent: React.FC = () => {
  return (
    // Main container with padding for the page background
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Card container with styling to match the image */}
      {/* <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200"> */}
      {/* Card Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">
          PF, ESI & PT Detail
        </h1>
        <button
          type="button"
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Pencil className="h-4 w-4 text-gray-500" />
          Edit
        </button>
      </div>

      {/* Card Body - Details List */}
      <div className="p-4 sm:p-6">
        <dl>
          {/* Map through the mock data to render each row */}
          {pfEsiDetails.map((detail, index) => (
            <div
              key={detail.label}
              // Use flexbox for layout and add a border to all but the last item
              className={`flex justify-between items-center py-4 ${
                index < pfEsiDetails.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
            >
              <dt className="text-sm text-gray-500">{detail.label}</dt>
              <dd className="text-sm font-medium text-gray-900">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {/* </div> */}
    </div>
  );
};

export default PfEsiComponent;
