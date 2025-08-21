import React, { useState } from "react";
import Table, { type Column } from "../../../../../components/common/Table";
import { Link } from "react-router-dom";
import DeclarationReportTemplate from "./component/declarationReportTemplate";
import EmployeeDeclarationFilters from "./component/employeeDeclarationFilters";

// Define a type for the Employee Declarations data
interface EmployeeDeclaration {
  id: number;
  name: string;
  employeeId: number;
  stdDeduction: number;
  _10_13A: number;
  _10_5: number;
  _80C: number;
  _80CCD: number;
  _80D: number;
  _80DD: number;
  _80DDB: number;
  _80EEB: number;
  _80U: number;
  _80G_100_NO_LIMIT: number;
  _80G_50_NO_LIMIT: number;
  _80G_100_LIMIT: number;
  _80G_50_10_LIMIT: number;
  _80E: number;
  _24B: number;
}

// Generate some mock data for the table
const mockData: EmployeeDeclaration[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: [
    "Supriya Jha",
    "Sunsj Pandey",
    "Kanishka Kapoor",
    "Kishore Kumar",
    "Richa Verma",
    "Aaradhya Anand",
  ][i % 6],
  employeeId: 4152 + i * 123,
  stdDeduction: 50000.0,
  _10_13A: 900.0,
  _10_5: i % 2 === 0 ? 3387.0 : 0.0,
  _80C: i % 3 === 0 ? 0.0 : 3387.0,
  _80CCD: i % 2 === 0 ? 3387.0 : 0.0,
  _80D: 0.0,
  _80DD: 0.0,
  _80DDB: 0.0,
  _80EEB: i % 4 === 0 ? 0.0 : 900.0,
  _80U: i % 2 === 0 ? 3387.0 : 0.0,
  _80G_100_NO_LIMIT: 3387.0,
  _80G_50_NO_LIMIT: 3387.0,
  _80G_100_LIMIT: 0.0,
  _80G_50_10_LIMIT: 0.0,
  _80E: 0.0,
  _24B: 0.0,
}));

// Helper to format numbers as currency
const formatCurrency = (value: number) =>
  `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const employeeDeclarations: React.FC = () => {
  const [view, setView] = useState<"table" | "editTemplate">("table");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const columns: Column<EmployeeDeclaration>[] = [
    { key: "name", header: "Name" },
    { key: "employeeId", header: "Employee ID" },
    {
      key: "stdDeduction",
      header: "STD_DEDUCTION",
      render: (row) => formatCurrency(row.stdDeduction),
    },
    {
      key: "_10_13A",
      header: "10(13A)",
      render: (row) => formatCurrency(row._10_13A),
    },
    {
      key: "_10_5",
      header: "10(5)",
      render: (row) => formatCurrency(row._10_5),
    },
    { key: "_80C", header: "80C", render: (row) => formatCurrency(row._80C) },
    {
      key: "_80CCD",
      header: "80CCD",
      render: (row) => formatCurrency(row._80CCD),
    },
    { key: "_80D", header: "80D", render: (row) => formatCurrency(row._80D) },
    {
      key: "_80DD",
      header: "80DD",
      render: (row) => formatCurrency(row._80DD),
    },
    {
      key: "_80DDB",
      header: "80DDB",
      render: (row) => formatCurrency(row._80DDB),
    },
    {
      key: "_80EEB",
      header: "80EEB",
      render: (row) => formatCurrency(row._80EEB),
    },
    { key: "_80U", header: "80U", render: (row) => formatCurrency(row._80U) },
    {
      key: "_80G_100_NO_LIMIT",
      header: "80G-100-NO-LIMIT",
      render: (row) => formatCurrency(row._80G_100_NO_LIMIT),
    },
    {
      key: "_80G_50_NO_LIMIT",
      header: "80G-50-NO-LIMIT",
      render: (row) => formatCurrency(row._80G_50_NO_LIMIT),
    },
    {
      key: "_80G_100_LIMIT",
      header: "80G-100-LIMIT",
      render: (row) => formatCurrency(row._80G_100_LIMIT),
    },
    {
      key: "_80G_50_10_LIMIT",
      header: "80G-50-10-LIMIT",
      render: (row) => formatCurrency(row._80G_50_10_LIMIT),
    },
    { key: "_80E", header: "80E", render: (row) => formatCurrency(row._80E) },
    { key: "_24B", header: "24B", render: (row) => formatCurrency(row._24B) },
  ];

  const handleApplyFilters = (filters: any) => {
    console.log("Applying Employee Declaration filters:", filters);
    setIsFilterOpen(false);
  };

  if (view === "editTemplate") {
    return <DeclarationReportTemplate onBack={() => setView("table")} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Employees Declarations Report
        </h1>
        <div className="flex flex-col items-end space-y-3">
          
          <p className="text-sm text-gray-500">
            <Link to="/reports/all">Reports</Link>
            {" / "}
            <Link to="/reports/all">All Reports</Link>
            {" / "}
            Employees Declarations Report
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setView("editTemplate")}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
            >
              EDIT TEMPLATE
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
            >
              FILTER
            </button>
            <button className="bg-purple-100 text-[#741CDD] font-semibold py-2 px-4 rounded-full hover:bg-purple-200 transition-colors cursor-pointer">
              SCHEDULE REPORT
            </button>
            <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-600 transition-colors cursor-pointer">
              DELETE
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <Table
            data={mockData}
            columns={columns}
            showSearch={false}
            showPagination={true}
            defaultItemsPerPage={10}
            className="w-[1350px]"
          />
        </div>
      </div>

      <EmployeeDeclarationFilters
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default employeeDeclarations;
