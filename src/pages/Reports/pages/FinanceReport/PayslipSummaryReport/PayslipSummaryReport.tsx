import React, { useState } from "react";
import { Link } from "react-router-dom";
import Table, { type Column } from "../../../../../components/common/Table";
import PayslipSummaryReportFilter from "./component/PayslipSummaryReportFilter";
// --- CHANGE HERE: Import the template component ---
import PayslipSummaryTemplate from "./component/PayslipSummaryTemplate";

// (Interface, mockData, and helper functions are unchanged)
interface PayslipSummary {
  id: number;
  name: string;
  employeeId: number;
  designation: string;
  employeeStatus: "Active" | "Inactive";
  department: string;
  location: string;
  basic: number;
  hra: number;
  conveyance: number;
  ovtmPerUnit: number;
  ctc: number;
  basicCic: number;
  grossPaid: number;
  variablePay: number;
  lossOfPay: number;
  taxPaid: number;
  nonTaxableAmount: number;
  netPaid: number;
  taxAmount: number;
  providentFund: number;
  cessAmount: number;
  employerProvidentFund: number;
  ovtmUnits: number;
  ovtm: number;
  totalEarnings: number;
  dmg: number;
  totalDeductions: number;
  rem: number;
  pf: number;
  pt: number;
  esi: number;
  eesi: number;
  period: string;
  status: "Approved" | "Pending";
  professionalTax: number;
  leavesOpeningBalance: number;
  leavesTaken: number;
  uploadLeaves: number;
  leaveClosingBalance: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
  accountType: "Saving Account" | "Current Account";
}

const mockData: PayslipSummary[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: [
    "Chandan",
    "Asad",
    "Pankaj",
    "Nanda",
    "Karthik",
    "Seema",
    "Mukul",
    "Latif",
    "Ahmad",
    "Ravinder",
  ][i % 10],
  employeeId: 4152 + i * 101,
  designation: [
    "Medical Assistant",
    "Web Designer",
    "President of Sales",
    "Marketing Coordinator",
    "Designer",
  ][i % 5],
  employeeStatus: i % 8 === 0 ? "Inactive" : "Active",
  department: [
    "Medical Assistant",
    "Web Designer",
    "President of Sales",
    "Marketing Coordinator",
    "Designer",
  ][i % 5],
  location: ["Tripura", "Manipur", "Kerala", "Haryana", "Jharkhand", "Sikkim"][
    i % 6
  ],
  basic: 47500.0,
  hra: 28000.0,
  conveyance: 9500.0,
  ovtmPerUnit: 0.0,
  ctc: 95000.0,
  basicCic: 13629.0,
  grossPaid: 70000.0,
  variablePay: 0.0,
  lossOfPay: i % 5 === 0 ? 1000.0 : 0.0,
  taxPaid: 2000.0,
  nonTaxableAmount: 8100.0,
  netPaid: 65000.0,
  taxAmount: 1008.5,
  providentFund: 471.0,
  cessAmount: 8100.0,
  employerProvidentFund: 4371.0,
  ovtmUnits: 0.0,
  ovtm: 0.0,
  totalEarnings: 95000.0,
  dmg: 0.0,
  totalDeductions: 2000.0,
  rem: 0.0,
  pf: 8100.0,
  pt: 1008.5,
  esi: 128.5,
  eesi: 471.0,
  period: "01/04/2021-30/04/2021",
  status: "Approved",
  professionalTax: 0.0,
  leavesOpeningBalance: 1.0 + (i % 5),
  leavesTaken: i % 4 === 0 ? 1.0 : 0.0,
  uploadLeaves: 0.0,
  leaveClosingBalance: 1.0 + (i % 5) - (i % 4 === 0 ? 1.0 : 0.0),
  bankName: ["SBI", "ICICI", "KOTAK", "PNB", "DIGI"][i % 5],
  accountNumber: `358661${78912287 + i}`,
  ifscCode: "APGB0002183",
  accountName: ["Supriya Jha", "Sunaj Pandey", "Kishore Kumar"][i % 3],
  accountType: i % 2 === 0 ? "Saving Account" : "Current Account",
}));

const formatCurrency = (value: number) =>
  `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const renderStatus = (
  status: "Active" | "Inactive" | "Approved" | "Pending"
) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  const activeClasses = "bg-green-100 text-green-800";
  const inactiveClasses = "bg-red-100 text-red-800";
  switch (status) {
    case "Active":
    case "Approved":
      return (
        <span className={`${baseClasses} ${activeClasses}`}>{status}</span>
      );
    case "Inactive":
    case "Pending":
      return (
        <span className={`${baseClasses} ${inactiveClasses}`}>{status}</span>
      );
    default:
      return status;
  }
};

const PayslipSummaryReport: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // --- CHANGE HERE: Add state to manage which view to show ---
  const [view, setView] = useState<"report" | "template">("report");

  // (Columns definition is unchanged)
  const columns: Column<PayslipSummary>[] = [
    { key: "name", header: "Name" },
    { key: "employeeId", header: "Employee ID" },
    { key: "designation", header: "Designation" },
    {
      key: "employeeStatus",
      header: "Employee Status",
      render: (row) => renderStatus(row.employeeStatus),
    },
    { key: "department", header: "Department" },
    { key: "location", header: "Location" },
    {
      key: "basic",
      header: "Basic",
      render: (row) => formatCurrency(row.basic),
    },
    { key: "hra", header: "HRA", render: (row) => formatCurrency(row.hra) },
    {
      key: "conveyance",
      header: "Conveyance",
      render: (row) => formatCurrency(row.conveyance),
    },
    {
      key: "ovtmPerUnit",
      header: "OVTM/PER UNIT",
      render: (row) => formatCurrency(row.ovtmPerUnit),
    },
    { key: "ctc", header: "CTC", render: (row) => formatCurrency(row.ctc) },
    {
      key: "basicCic",
      header: "Basic Cic",
      render: (row) => formatCurrency(row.basicCic),
    },
    {
      key: "grossPaid",
      header: "Gross Paid",
      render: (row) => formatCurrency(row.grossPaid),
    },
    {
      key: "variablePay",
      header: "Variable Pay",
      render: (row) => formatCurrency(row.variablePay),
    },
    {
      key: "lossOfPay",
      header: "Loss of pay",
      render: (row) => formatCurrency(row.lossOfPay),
    },
    {
      key: "taxPaid",
      header: "Tax Paid",
      render: (row) => formatCurrency(row.taxPaid),
    },
    {
      key: "nonTaxableAmount",
      header: "Non Taxable Amount",
      render: (row) => formatCurrency(row.nonTaxableAmount),
    },
    {
      key: "netPaid",
      header: "Net Paid",
      render: (row) => formatCurrency(row.netPaid),
    },
    {
      key: "taxAmount",
      header: "Tax Amount",
      render: (row) => formatCurrency(row.taxAmount),
    },
    {
      key: "providentFund",
      header: "Provident Fund",
      render: (row) => formatCurrency(row.providentFund),
    },
    {
      key: "cessAmount",
      header: "Cess Amount",
      render: (row) => formatCurrency(row.cessAmount),
    },
    {
      key: "employerProvidentFund",
      header: "Employer Provident Fund",
      render: (row) => formatCurrency(row.employerProvidentFund),
    },
    { key: "ovtmUnits", header: "OVTM/UNITS" },
    { key: "ovtm", header: "OVTM", render: (row) => formatCurrency(row.ovtm) },
    {
      key: "totalEarnings",
      header: "Total Earnings",
      render: (row) => formatCurrency(row.totalEarnings),
    },
    { key: "dmg", header: "DMG", render: (row) => formatCurrency(row.dmg) },
    {
      key: "totalDeductions",
      header: "Total Deductions",
      render: (row) => formatCurrency(row.totalDeductions),
    },
    { key: "rem", header: "REM", render: (row) => formatCurrency(row.rem) },
    { key: "pf", header: "PF", render: (row) => formatCurrency(row.pf) },
    { key: "pt", header: "PT", render: (row) => formatCurrency(row.pt) },
    { key: "esi", header: "ESI", render: (row) => formatCurrency(row.esi) },
    { key: "eesi", header: "EESI", render: (row) => formatCurrency(row.eesi) },
    { key: "period", header: "Period" },
    {
      key: "status",
      header: "Status",
      render: (row) => renderStatus(row.status),
    },
    {
      key: "professionalTax",
      header: "Professional Tax",
      render: (row) => formatCurrency(row.professionalTax),
    },
    { key: "leavesOpeningBalance", header: "Leaves Opening Balance" },
    { key: "leavesTaken", header: "Leaves Taken" },
    { key: "uploadLeaves", header: "Upload Leaves" },
    { key: "leaveClosingBalance", header: "Leave Closing Balance" },
    { key: "bankName", header: "Bank Name" },
    { key: "accountNumber", header: "Account Number" },
    { key: "ifscCode", header: "IFSC Code" },
    { key: "accountName", header: "Account Name" },
    { key: "accountType", header: "Account Type" },
  ];

  const handleApplyFilters = (filters: any) => {
    console.log("Applying filters from modal:", filters);
  };

  // --- CHANGE HERE: Conditionally render the template view ---
  if (view === "template") {
    return <PayslipSummaryTemplate onBack={() => setView("report")} />;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Payslip Summary Report
        </h1>
        <div className="flex flex-col items-end space-y-3">
          <p className="text-sm text-gray-500">
            <Link to="/reports">Reports</Link> /{" "}
            <Link to="/reports/scheduled">Scheduled Reports</Link> /{" "}
            <Link to="/reports/finance">Finance Report</Link> / Payslip Summary
            Report
          </p>
          <div className="flex items-center space-x-3">
            {/* --- CHANGE HERE: Add onClick to the button --- */}
            <button
              onClick={() => setView("template")}
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
            showSearch={true}
            searchPlaceholder="Search Employees..."
            showPagination={true}
            defaultItemsPerPage={10}
            className="w-[1350px]"
          />
        </div>
      </div>

      <PayslipSummaryReportFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default PayslipSummaryReport;
