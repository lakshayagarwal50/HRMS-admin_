// src/features/payroll/pages/PayrollList.tsx

import React, { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Download,
  Mail,
  Edit,
  PlusCircle,
  FileText,
  BadgeCheck,
  BadgeHelp,
  CheckCircle2,
} from "lucide-react";

import Table, { type Column } from "../../../components/common/Table";
import SidePanelForm from "../../../components/common/SidePanelForm";
import Input from "../../../components/common/Input";

// --- TYPE DEFINITIONS ---
// Recommended: Move to `src/types/payroll.ts`

type PayrollStatus = "Draft" | "Released" | "Processed" | "Cancelled" | "Error";
type PaymentStatus = "unpaid" | "paid";

interface PayrollPeriodSummary {
  id: number;
  period: string;
  status: PayrollStatus;
  grossAmount: number;
  netAmount: number;
  count: number;
  processed: number;
  released: number;
  cancelled: number;
  error: number;
  salaryDisbursed: number;
  paidAmount: number;
  balance: number;
}

interface EmployeePayslipSummary {
  id: string;
  employeeName: string;
  ctc: number;
  period: string;
  status: PayrollStatus;
  grossAmount: number;
  lopDays: number;
  taxAmount: number;
  netPayable: number;
  paymentStatus: PaymentStatus;
  hasBankDetails: boolean;
}

interface BankDetails {
    bankName: string;
    branchName: string;
    accountName: string;
    accountType: string;
    accountNo: string;
    ifscCode: string;
}

// --- DUMMY DATA ---
// This would be fetched from an API via a Redux slice (`payrollSlice.ts`)

const dummyPayrollList: PayrollPeriodSummary[] = [
  { id: 641, period: "Jan-2023", status: "Draft", grossAmount: 228612.50, netAmount: 166824.00, count: 24, processed: 1, released: 6, cancelled: 11, error: 11, salaryDisbursed: 11, paidAmount: 0, balance: 166824.00 },
  { id: 565, period: "Dec-2022", status: "Released", grossAmount: 228612.50, netAmount: 178612.50, count: 20, processed: 5, released: 2, cancelled: 5, error: 5, salaryDisbursed: 5, paidAmount: 0, balance: 0.00 },
  { id: 451, period: "Nov-2022", status: "Processed", grossAmount: 228612.50, netAmount: 228612.50, count: 11, processed: 3, released: 2, cancelled: 3, error: 2, salaryDisbursed: 2, paidAmount: 0, balance: 216825.00 },
  { id: 641, period: "Oct-2022", status: "Draft", grossAmount: 228612.50, netAmount: 166824.00, count: 24, processed: 1, released: 6, cancelled: 11, error: 11, salaryDisbursed: 11, paidAmount: 0, balance: 166824.00 },
];

const dummyEmployeePayslips: EmployeePayslipSummary[] = [
    { id: 'emp1', employeeName: 'Devon Lane', ctc: 18100, period: 'Sep 2022', status: 'Processed', grossAmount: 52000, lopDays: 0, taxAmount: 0, netPayable: 52000, paymentStatus: 'unpaid', hasBankDetails: true },
    { id: 'emp2', employeeName: 'Clever Lane', ctc: 18100, period: 'Aug 2022', status: 'Released', grossAmount: 52000, lopDays: 0, taxAmount: 0, netPayable: 52000, paymentStatus: 'unpaid', hasBankDetails: false },
    { id: 'emp3', employeeName: 'Jason Bourne', ctc: 18100, period: 'Mar 2022', status: 'Processed', grossAmount: 52000, lopDays: 0, taxAmount: 0, netPayable: 52000, paymentStatus: 'paid', hasBankDetails: true },
    { id: 'emp4', employeeName: 'Peter Parker', ctc: 18100, period: 'Jan 2022', status: 'Cancelled', grossAmount: 52000, lopDays: 0, taxAmount: 0, netPayable: 52000, paymentStatus: 'unpaid', hasBankDetails: true },
    { id: 'emp5', employeeName: 'Diana Prince', ctc: 18100, period: 'Dec 2021', status: 'Error', grossAmount: 52000, lopDays: 0, taxAmount: 0, netPayable: 52000, paymentStatus: 'unpaid', hasBankDetails: true },
];

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: { [key: string]: string } = {
    Draft: "bg-blue-100 text-blue-800",
    Released: "bg-purple-100 text-purple-800",
    Processed: "bg-green-100 text-green-800",
    Cancelled: "bg-yellow-100 text-yellow-800",
    Error: "bg-red-100 text-red-800",
    unpaid: "bg-red-100 text-red-800",
    paid: "bg-green-100 text-green-800",
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const SummaryCard = ({ title, value, icon, currency = '₹' }: { title: string, value: string, icon: React.ReactNode, currency?: string }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-xl font-bold text-gray-800">{`${currency} ${value}`}</p>
        </div>
    </div>
);

// --- MAIN FEATURE COMPONENT ---

const PayrollList = () => {
    // State to manage views
    const [view, setView] = useState<'list' | 'detail' | 'payslip'>('list');
    const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriodSummary | null>(null);
    const [selectedPayslip, setSelectedPayslip] = useState<EmployeePayslipSummary | null>(null);
    
    // State for side panel and notifications
    const [isBankPanelOpen, setBankPanelOpen] = useState(false);
    const [employeeForBank, setEmployeeForBank] = useState<EmployeePayslipSummary | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleViewDetails = (period: PayrollPeriodSummary) => {
        setSelectedPeriod(period);
        setView('detail');
    };

    const handleViewPayslip = (payslip: EmployeePayslipSummary) => {
        setSelectedPayslip(payslip);
        setView('payslip');
    };

    const handleBankPanelOpen = (employee: EmployeePayslipSummary) => {
        setEmployeeForBank(employee);
        setBankPanelOpen(true);
    };

    const handleBankSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here...
        console.log("Bank details submitted for", employeeForBank?.employeeName);
        setBankPanelOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    };

    // Columns for the main payroll list
    const payrollListColumns: Column<PayrollPeriodSummary>[] = [
        { key: "id", header: "ID" },
        { key: "period", header: "Period" },
        { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "grossAmount", header: "Gross Amount", render: (row) => `₹ ${row.grossAmount.toFixed(2)}` },
        { key: "netAmount", header: "Net Amount", render: (row) => `₹ ${row.netAmount.toFixed(2)}` },
        { key: "count", header: "Count" },
        { key: "processed", header: "Processed" },
        { key: "released", header: "Released" },
        { key: "action", header: "Action", render: (row) => (
                <button onClick={() => handleViewDetails(row)} className="text-purple-600 hover:underline font-semibold">View Details</button>
        )},
    ];

    // Columns for the payroll detail list
    const payrollDetailColumns: Column<EmployeePayslipSummary>[] = [
        {
            key: 'employeeName', header: 'Employee/CTC', render: (row) => (
                <div>
                    <p className="font-semibold">{row.employeeName}</p>
                    <p className="text-xs text-gray-500">CTC ₹ {row.ctc.toLocaleString()}</p>
                </div>
            )
        },
        { key: 'period', header: 'Period', render: (row) => (
            <div>
                <p>{row.period}</p>
                <StatusBadge status={row.status} />
            </div>
        )},
        { key: 'grossAmount', header: 'Gross Amount', render: (row) => `₹ ${row.grossAmount.toFixed(2)}` },
        { key: 'lopDays', header: 'LOP Days', render: (row) => `${row.lopDays.toFixed(2)} Days` },
        { key: 'netPayable', header: 'Net Payable', render: (row) => `₹ ${row.netPayable.toFixed(2)}` },
        { key: 'paymentStatus', header: 'Payment Status', render: (row) => <StatusBadge status={row.paymentStatus} /> },
        { key: 'action', header: 'Action', render: (row) => (
            <div className="relative group">
                <button className="p-2 rounded-full hover:bg-gray-200">
                    <MoreHorizontal size={20} />
                </button>
                <div className="absolute right-0 z-10 hidden group-hover:block w-40 bg-white shadow-lg rounded-md border">
                    <a href="#" onClick={() => handleViewPayslip(row)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Eye size={14} className="mr-2"/>View Details</a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Download size={14} className="mr-2"/>Download</a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Mail size={14} className="mr-2"/>Email</a>
                    <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><Edit size={14} className="mr-2"/>Edit</a>
                    {!row.hasBankDetails && (
                        <a href="#" onClick={() => handleBankPanelOpen(row)} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"><PlusCircle size={14} className="mr-2"/>Add Bank Detail</a>
                    )}
                </div>
            </div>
        )}
    ];

    // RENDER LOGIC
    if (view === 'payslip') return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <button onClick={() => setView('detail')} className="mb-4 text-purple-700 hover:text-purple-900 font-medium text-sm">&larr; Back to Payroll Details</button>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Payslip for the period of July-2021 (PS1000)</h1>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">DOWNLOAD PDF</button>
                        <button className="px-4 py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600">EMAIL PAYSLIP</button>
                    </div>
                </div>
                {/* Simplified payslip structure */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-purple-600 text-white p-3 text-center font-semibold">Payslip for the period of July-2021</div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b">
                        <div><span className="font-semibold">Employee:</span> 1001</div>
                        <div><span className="font-semibold">Name:</span> Manish</div>
                        <div><span className="font-semibold">Department:</span> HR</div>
                        <div><span className="font-semibold">Designation:</span> HR</div>
                    </div>
                    <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/2 p-4">
                            <div className="bg-purple-100 text-purple-800 p-2 font-bold text-center">Earnings</div>
                            <table className="w-full mt-2 text-sm"><tbody><tr><td className="py-1">Basic</td><td className="text-right">₹ 47,500.00</td></tr><tr><td className="py-1">House Rent Allowance</td><td className="text-right">₹ 38,000.00</td></tr><tr className="font-bold border-t"><td className="py-2">Total Earnings</td><td className="text-right">₹ 95,000.00</td></tr></tbody></table>
                        </div>
                        <div className="w-full md:w-1/2 p-4 border-t md:border-t-0 md:border-l">
                            <div className="bg-purple-100 text-purple-800 p-2 font-bold text-center">Deductions</div>
                            <table className="w-full mt-2 text-sm"><tbody><tr><td className="py-1">PF</td><td className="text-right">₹ 1,300.00</td></tr><tr><td className="py-1">TDS</td><td className="text-right">₹ 8,228.00</td></tr><tr className="font-bold border-t"><td className="py-2">Total Deductions</td><td className="text-right">₹ 8,228.00</td></tr></tbody></table>
                        </div>
                    </div>
                     <div className="p-4 bg-gray-50 border-t"><span className="font-bold">Net Payable:</span> ₹ 86,772.00</div>
                </div>
                <div className="text-center text-xs text-gray-500 mt-6 p-4 bg-gray-100 rounded">THIS IS SYSTEM GENERATED REPORT AND HENCE DOES NOT REQUIRE ANY SIGNATURE...</div>
            </div>
        </div>
    );

    if (view === 'detail') return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen relative">
            {showSuccess && (
                <div className="absolute top-5 right-5 flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md shadow-lg z-50">
                    <CheckCircle2 size={20} className="mr-2"/>
                    <span className="block sm:inline">Bank Detail Submitted Successfully.</span>
                    <button onClick={() => setShowSuccess(false)} className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-2 mr-4 outline-none focus:outline-none text-red-500"><span>×</span></button>
                </div>
            )}
            <button onClick={() => setView('list')} className="mb-4 text-purple-700 hover:text-purple-900 font-medium text-sm">&larr; Back to Payroll List</button>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">October-2022 Payroll</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <SummaryCard title="Payslips" value="117" icon={<FileText className="text-purple-500"/>} currency=""/>
                <SummaryCard title="CTC" value="42,261.00" icon={<BadgeCheck className="text-blue-500"/>}/>
                <SummaryCard title="Gross Amount" value="35,525.00" icon={<BadgeHelp className="text-green-500"/>}/>
                <SummaryCard title="Net Amount" value="59,346.00" icon={<BadgeCheck className="text-teal-500"/>}/>
            </div>
            {/* Main content area */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md mb-4 text-sm">
                    Error Cases Are Because Employees Bank Details Are Not Added
                </div>
                 <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <select className="border rounded px-3 py-1.5 text-sm">
                            <option>Select Payslip Status</option>
                        </select>
                        <button className="px-4 py-1.5 bg-purple-600 text-white rounded text-sm">Apply</button>
                    </div>
                    <div className="flex items-center gap-2">
                         <button className="px-4 py-1.5 bg-red-500 text-white rounded text-sm">CANCEL</button>
                         <button className="px-4 py-1.5 bg-purple-600 text-white rounded text-sm">RELEASE PAYSLIPS</button>
                         <button className="px-4 py-1.5 bg-purple-800 text-white rounded text-sm">DISBURSE SALARY</button>
                    </div>
                </div>
                <Table<EmployeePayslipSummary> columns={payrollDetailColumns} data={dummyEmployeePayslips} />
            </div>
             <SidePanelForm
                isOpen={isBankPanelOpen}
                onClose={() => setBankPanelOpen(false)}
                title={`${employeeForBank?.employeeName} (${employeeForBank?.id})`}
                onSubmit={handleBankSubmit}
            >
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700">Bank Name</label><Input name="bankName" placeholder="HDFC Bank" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Branch Name</label><Input name="branchName" placeholder="NIT-1" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Account Name</label><Input name="accountName" placeholder="Thigaspandi" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Account Type</label><select className="w-full p-2 border rounded mt-1"><option>Salary Account</option></select></div>
                    <div><label className="block text-sm font-medium text-gray-700">Account No</label><Input name="accountNo" placeholder="123456790" /></div>
                    <div><label className="block text-sm font-medium text-gray-700">IFSC Code</label><Input name="ifscCode" placeholder="HDFC101101" /></div>
                </div>
            </SidePanelForm>
        </div>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900">Payroll List</h1>
                <div className="relative">
                    <select className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:border-purple-500">
                        <option>2022-2023</option>
                        <option>2021-2022</option>
                    </select>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <Table<PayrollPeriodSummary> columns={payrollListColumns} data={dummyPayrollList} />
            </div>
        </div>
    );
};

export default PayrollList;