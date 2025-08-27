import React, { useState } from "react";
import { ChevronUp, Plus } from "lucide-react";

// (Interfaces and mock data remain the same)
interface DeclarationRow {
  name: string;
  amount: number;
}
interface DeclarationSection {
  id: string;
  title: string;
  total: number;
  maxAmount: number;
  rows: DeclarationRow[];
  hasRentalSection?: boolean;
}
const declarationData: DeclarationSection[] = [
  {
    id: "std_deduction",
    title: "Standard Deduction",
    total: 50000,
    maxAmount: 50000,
    rows: [{ name: "Standard Deduction", amount: 50000 }],
  },
  {
    id: "sec_10_13a",
    title: "10 (13A)",
    total: 0,
    maxAmount: 56000,
    rows: [
      {
        name: "Medical Insurance Premium/Preventive Health Check-up for Self And Family",
        amount: 0.0,
      },
    ],
    hasRentalSection: true,
  },
];

const Declarations: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>("std_deduction");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? "" : id);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-6">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full sm:w-auto border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            <option disabled>Select Year</option>
            {generateYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Using your custom 'primary' color */}
          <button className="w-full sm:w-auto bg-primary text-white font-semibold py-2 px-6 rounded-md hover:opacity-90 transition-opacity">
            UPDATE
          </button>
          <button className="w-full sm:w-auto bg-primary text-white font-semibold py-2 px-6 rounded-md hover:opacity-90 transition-opacity">
            DOWNLOAD POI
          </button>
        </div>

        <div className="space-y-4">
          {declarationData.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-2">
                  <ChevronUp
                    className={`h-5 w-5 text-primary transform transition-transform ${
                      openSection === section.id ? "rotate-0" : "rotate-180"
                    }`}
                  />
                  <h2 className="font-semibold text-primary">
                    {section.title}
                  </h2>
                  <p className="text-xs text-gray-500">
                    (Total=₹{section.total.toFixed(2)}) (MaxAmount=₹
                    {section.maxAmount.toFixed(2)})
                  </p>
                </div>
              </div>

              {openSection === section.id && (
                <div className="border-t border-gray-200 px-4 pt-4 pb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium text-gray-500 pb-2">
                          Name
                        </th>
                        <th className="text-left font-medium text-gray-500 pb-2 w-1/4">
                          {section.id === "std_deduction"
                            ? "Requested Amount"
                            : "Amount"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.rows.map((row) => (
                        <tr key={row.name}>
                          <td className="py-3 text-gray-800">{row.name}</td>
                          <td className="py-3">
                            <div className="bg-gray-100 p-2 rounded-md text-right text-gray-800">
                              {row.amount.toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {section.id === "std_deduction" && (
                        <tr>
                          <td className="pt-3 font-semibold text-gray-800 text-right">
                            Total :
                          </td>
                          <td className="pt-3 font-semibold text-gray-800 text-right pr-2">
                            {section.total.toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {section.hasRentalSection && (
                    <div className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-4">
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-600">
                            Owner Name
                          </label>
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-medium text-gray-600">
                            Pancard
                          </label>
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <button className="w-full sm:w-auto bg-primary text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <Plus size={16} />
                            Rental Owner
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 text-center text-gray-500 bg-gray-100 p-6 rounded-md">
                        No rental owner detail added
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Declarations;
