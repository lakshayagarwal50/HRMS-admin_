
import React, { useState } from "react";
import { ChevronUp } from "lucide-react";
import { SectionHeader, DetailItem, AddButton } from "../common/DetailItem"; 
import toast from "react-hot-toast"; 

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
    return Array.from({ length: 6 }, (_, i) => currentYear - i);
  };

  const handleUpdate = () => {
    toast.success("Declarations updated successfully!", {
      className: "bg-green-50 text-green-800",
    });
  };

  const handleDownload = () => {
    const toastId = toast.loading("Preparing your download...");
   
    setTimeout(() => {
      toast.success("POI downloaded successfully!", {
        id: toastId,
        className: "bg-green-50 text-green-800",
      });
    }, 1500);
  };

  const handleAddRentalOwner = () => {
    toast("Opening form to add rental owner...", {
      icon: "🏠",
      className: "bg-blue-50 text-blue-800",
    });
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto space-y-6">
        <SectionHeader title="Declarations" action={null} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
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

          <button
            onClick={handleUpdate}
            className="w-full sm:w-auto bg-primary text-white font-semibold py-2 px-6 rounded-md hover:opacity-90 transition-opacity"
          >
            UPDATE
          </button>
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto bg-primary text-white font-semibold py-2 px-6 rounded-md hover:opacity-90 transition-opacity"
          >
            DOWNLOAD POI
          </button>
        </div>

        {declarationData.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div
              className="flex justify-between items-center px-4 py-3 cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-2">
                <ChevronUp
                  className={`h-5 w-5 text-primary transform transition-transform ${
                    openSection === section.id ? "rotate-0" : "rotate-180"
                  }`}
                />
                <h2 className="font-semibold text-primary">{section.title}</h2>
                <p className="text-xs text-gray-500">
                  (Total=₹{section.total.toFixed(2)}) (Max=₹
                  {section.maxAmount.toFixed(2)})
                </p>
              </div>
            </div>

            {openSection === section.id && (
              <div className="border-t border-gray-200 p-4 space-y-2">
                {section.rows.map((row) => (
                  <DetailItem
                    key={row.name}
                    label={row.name}
                    value={row.amount.toFixed(2)}
                  />
                ))}

                {section.id === "std_deduction" && (
                  <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
                    <span>Total :</span>
                    <span>₹{section.total.toFixed(2)}</span>
                  </div>
                )}

                {section.hasRentalSection && (
                  <div className="mt-6 space-y-4">
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
                        
                        <AddButton
                          onClick={handleAddRentalOwner}
                          label="Rental Owner"
                        />
                      </div>
                    </div>
                    <div className="text-center text-gray-500 bg-gray-100 p-6 rounded-md">
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
  );
};

export default Declarations;