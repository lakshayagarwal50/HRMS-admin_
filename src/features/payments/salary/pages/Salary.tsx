import  { useState } from 'react';
import Table, { type Column } from '../../../../components/common/Table';
import { MoreHorizontal } from 'lucide-react';

interface SalaryPeriod {
  id: number;
  paymentType: string;
  referenceId: string;
  status: 'Pending' | 'Paid' | 'Failed';
  amount: number;
  date: string;
}

interface EmployeeSalaryDetail {
  id: number;
  employeeName: string;
  employeeId: string;
  payslip: string;
  netAmount: number;
  processAmount: number;
  status: 'Pending' | 'Paid' | 'Failed';
}


const salaryPeriodsData: SalaryPeriod[] = [
  { id: 1, paymentType: 'October 2022', referenceId: '5151', status: 'Pending', amount: 166824.00, date: '25 Sep 2022 05:00' },
  { id: 2, paymentType: 'September 2022', referenceId: '58415', status: 'Pending', amount: 166824.00, date: '25 Aug 2022 05:00' },
  { id: 3, paymentType: 'August 2022', referenceId: '841', status: 'Pending', amount: 216825.00, date: '25 Jul 2022 05:00' },
  { id: 4, paymentType: 'July 2022', referenceId: '8451', status: 'Pending', amount: 166824.00, date: '25 Jun 2022 05:00' },
  { id: 5, paymentType: 'June 2022', referenceId: '5815', status: 'Pending', amount: 216825.00, date: '25 May 2022 05:00' },
  { id: 6, paymentType: 'May 2022', referenceId: '8941', status: 'Pending', amount: 166824.00, date: '25 Apr 2022 05:00' },
];

const employeeSalaryDetailsData: EmployeeSalaryDetail[] = [
    { id: 101, employeeName: 'Manish Sharma', employeeId: '1541', payslip: 'October 2022', netAmount: 92140.00, processAmount: 92140.00, status: 'Pending' },
    { id: 102, employeeName: 'Darlene Robertson', employeeId: '1541', payslip: 'October 2022', netAmount: 92140.00, processAmount: 92140.00, status: 'Pending' },
    { id: 103, employeeName: 'Guy Hawkins', employeeId: '1541', payslip: 'October 2022', netAmount: 92140.00, processAmount: 92140.00, status: 'Pending' },
];


const StatusBadge = ({ status }: { status: 'Pending' | 'Paid' | 'Failed' }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-md inline-block';
  switch (status) {
    case 'Pending':
      return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>{status}</span>;
    case 'Paid':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
    case 'Failed':
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};


const SalarySummaryCard = ({ period }: { period: SalaryPeriod }) => (
  <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Salary Summary</h3>
    <div className="space-y-4 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">Type</span>
        <span className="font-medium text-gray-900">Salary</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Name</span>
        <span className="font-medium text-gray-900">{`${period.paymentType} Salary`}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Reference Id</span>
        <span className="font-medium text-gray-900">578</span> 
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Payment process date</span>
        <span className="font-medium text-gray-900">11/10/2022 14:00</span> 
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Status</span>
        <StatusBadge status={period.status} />
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Amount</span>
        <span className="font-medium text-gray-900">
           {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(92140.00)} 
        </span>
      </div>
    </div>
  </div>
);



const Salary = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<SalaryPeriod | null>(null);

    
    const handleViewDetails = (period: SalaryPeriod) => {
      
        setSelectedPeriod(period);
    };
    
   
    const handleGoBack = () => {
        setSelectedPeriod(null);
    };

    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

 
    const salaryPeriodColumns: Column<SalaryPeriod>[] = [
        { key: 'paymentType', header: 'Payment Type' },
        { key: 'referenceId', header: 'Reference Id' },
        { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
        { key: 'amount', header: 'Amount', render: (row) => <span className="font-medium">{formatCurrency(row.amount)}</span> },
        { key: 'date', header: 'Date' },
        {
            key: 'action',
            header: 'Action',
            render: (row) => (
                <div className="relative group">
                    <button className="p-2 rounded-md hover:bg-gray-200">
                        <MoreHorizontal size={20} />
                    </button>
                    <div className="absolute right-0 top-0 mt-8 z-10 bg-white border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto w-24">
                       <button
                          onClick={(e) => {
                              e.stopPropagation(); // Prevent onRowClick from firing
                              handleViewDetails(row);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                       >
                           View
                       </button>
                    </div>
                </div>
            ),
        },
    ];
    
    // Column definitions for the employee salary details table
    const employeeSalaryColumns: Column<EmployeeSalaryDetail>[] = [
        { 
            key: 'employeeName', 
            header: 'Employee',
            render: (row) => (
                <div>
                    <div className="font-medium text-blue-600">{row.employeeName}</div>
                    <div className="text-sm text-gray-500">{row.employeeId}</div>
                </div>
            )
        },
        { key: 'payslip', header: 'Payslip' },
        {
            key: 'netAmount',
            header: 'Amount/Status',
            render: (row) => (
                <div>
                    <div className="text-sm">Net Amount: <span className="font-medium text-blue-600">{formatCurrency(row.netAmount)}</span></div>
                    <div className="text-sm">Process Amount: <span className="font-medium">{formatCurrency(row.processAmount)}</span></div>
                    <div className="mt-1"><StatusBadge status={row.status} /></div>
                </div>
            )
        },
    ];

    const Breadcrumb = () => (
        <div className="text-sm text-gray-500 mb-4">
            <span>Dashboard / Payments / </span>
            {selectedPeriod ? (
                <>
                    <button onClick={handleGoBack} className="text-blue-600 hover:underline">Salary</button>
                    <span> / {selectedPeriod.paymentType}</span>
                </>
            ) : (
                <span className="font-medium text-gray-700">Salary</span>
            )}
        </div>
    );

    return (
        <div className="p-6 bg-blue-50/30 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Salary</h1>
            <Breadcrumb />

            {selectedPeriod ? (
               
                <div className="flex flex-col lg:flex-row gap-6 mt-4">
                    <div className="flex-1 bg-white rounded-lg shadow-md p-4">
                       <Table 
                         data={employeeSalaryDetailsData} 
                         columns={employeeSalaryColumns} 
                         className="border-none"
                         showSearch={false}
                       />
                    </div>
                    <SalarySummaryCard period={selectedPeriod} />
                </div>
            ) : (
                <div className="bg-white p-4 rounded-lg shadow-md">
                   <Table
                     data={salaryPeriodsData}
                     columns={salaryPeriodColumns}
                     onRowClick={handleViewDetails}
                     className="border-none"
                   />
                </div>
            )}
        </div>
    );
};

export default Salary;