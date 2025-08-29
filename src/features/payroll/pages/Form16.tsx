// src/features/payments/salary/pages/Form16.tsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
// import { useAppSelector } from '../../../../store/hooks'; // Uncomment when using Redux store

// --- MOCK: Assuming these components exist in your project ---
// You can replace these with your actual component imports.
const Input: React.FC<any> = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select {...props} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-600 focus:border-purple-600 sm:text-sm">
      {options.map((opt: { value: string, label: string }) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);
const Table: React.FC<any> = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col: any) => <th key={col.header} className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">{col.header}</th>)}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {data.map((row: any, i: number) => <tr key={i}>{columns.map((col: any) => <td key={col.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{row[col.accessor]}</td>)}</tr>)}
      </tbody>
    </table>
  </div>
);
const Button: React.FC<any> = ({ children, ...props }) => <button {...props} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 disabled:opacity-50">{children}</button>;
// --- END MOCK ---


// --- Types and Mock Data ---
interface Employee {
  id: string;
  name: string;
}

interface Form16PartA {
  pan: string;
  tan: string;
  employeeName: string;
  financialYear: string;
  tdsDeducted: number;
  deposited: boolean;
}

interface Form16PartB {
  salaryComponents: { name: string; amount: number }[];
  exemptions: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
}

interface Form16Data {
  partA: Form16PartA;
  partB: Form16PartB;
}

const mockEmployees: Employee[] = [
  { id: '5161', name: 'Arlene McCoy' },
  { id: '6513', name: 'Robert Fox' },
  { id: '6161', name: 'Dianne Russell' },
  { id: '5131', name: 'Cameron Williamson' },
];

const financialYears = ['2024-2025', '2023-2024', '2022-2023', '2021-2022'];

// --- Form16 Component ---
const Form16: React.FC = () => {
  // Replace with useAppSelector once Redux is connected
  // const { employees, status } = useAppSelector((state) => state.employees);
  const employees = mockEmployees;
  const status = 'succeeded'; // Mocking successful fetch

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(financialYears[0]);
  const [form16Data, setForm16Data] = useState<Form16Data | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status === 'failed') {
      toast.error('Failed to fetch employee list.');
    }
  }, [status]);

  // Mock API call to generate Form 16 data
  const generateMockForm16Data = (employeeId: string, year: string): Promise<Form16Data> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const employee = employees.find(e => e.id === employeeId);
        if (!employee) {
          return reject(new Error('Employee not found.'));
        }

        const mockData: Form16Data = {
          partA: {
            pan: 'AXXXXXX123B',
            tan: 'TXXXXXX456C',
            employeeName: employee.name,
            financialYear: year,
            tdsDeducted: 76000,
            deposited: true,
          },
          partB: {
            salaryComponents: [
              { name: 'Basic Salary', amount: 600000 },
              { name: 'HRA', amount: 240000 },
              { name: 'Special Allowance', amount: 160000 },
            ],
            exemptions: [{ name: 'HRA Exemption', amount: 120000 }],
            deductions: [
              { name: 'Section 80C (PF, etc.)', amount: 160000 },
              { name: 'Standard Deduction', amount: 60000 },
            ],
          },
        };
        resolve(mockData);
      }, 1600); // Simulate network delay
    });
  };

  const handleGenerateForm16 = async () => {
    if (!selectedEmployeeId) {
      toast.error('Please select an employee.', { className: 'bg-orange-50 text-orange-800' });
      return;
    }

    setIsLoading(true);
    setForm16Data(null);
    const toastId = toast.loading('Generating Form 16...');

    try {
      const data = await generateMockForm16Data(selectedEmployeeId, selectedYear);
      setForm16Data(data);
      toast.success('Form 16 generated successfully!', { id: toastId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(`Failed to generate Form 16: ${errorMessage}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!form16Data) {
      toast.error('No Form 16 data available to download.');
      return;
    }
    toast.info('Preparing download...', { duration: 1600 });
    
    // Mock download logic (creates and downloads a text file)
    const content = JSON.stringify(form16Data, null, 2);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Form16_${form16Data.partA.employeeName.replace(/\s/g, '_')}_${form16Data.partA.financialYear}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Define table columns
  const partAColumns = [{ header: 'Particulars', accessor: 'key' }, { header: 'Details', accessor: 'value' }];
  const partBColumns = [{ header: 'Component Name', accessor: 'name' }, { header: 'Amount (₹)', accessor: 'amount' }];

  const getPartADataForTable = () => {
    if (!form16Data) return [];
    const { partA } = form16Data;
    return [
      { key: 'Employee Name', value: partA.employeeName },
      { key: 'PAN of the Employee', value: partA.pan },
      { key: 'TAN of the Employer', value: partA.tan },
      { key: 'Financial Year', value: partA.financialYear },
      { key: 'Total TDS Deducted', value: `₹ ${partA.tdsDeducted.toLocaleString('en-IN')}` },
      { key: 'Tax Deposited', value: partA.deposited ? 'Yes' : 'No' },
    ];
  };

  return (
    <div className="p-6 md:p-8 bg-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Generate Form 16</h1>
          <p className="text-gray-600 mt-1">Select an employee and financial year to generate their TDS certificate.</p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <Input
              label="Select Employee"
              name="employee"
              value={selectedEmployeeId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedEmployeeId(e.target.value)}
              options={[{ value: '', label: '-- Select Employee --' }, ...employees.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.id})` }))]}
              aria-label="Select an employee to generate Form 16 for"
            />
            <Input
              label="Financial Year"
              name="financialYear"
              value={selectedYear}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedYear(e.target.value)}
              options={financialYears.map(year => ({ value: year, label: year }))}
              aria-label="Select the financial year for Form 16"
            />
            <Button onClick={handleGenerateForm16} disabled={isLoading} aria-label="Generate Form 16">
              {isLoading ? 'Generating...' : 'Generate Form 16'}
            </Button>
          </div>
        </div>
        
        {form16Data && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Form 16 Preview</h2>
                    <Button onClick={handleDownload} aria-label="Download Form 16 as a text file">
                        Download
                    </Button>
                </div>

                <section className="mb-8">
                  <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Part A - Certificate of Deduction</h3>
                  <Table columns={partAColumns} data={getPartADataForTable()} />
                </section>

                <section>
                  <h3 className="text-lg font-medium text-gray-800 border-b pb-2 mb-4">Part B - Salary Details</h3>
                  <h4 className="text-md font-semibold text-gray-600 mt-6 mb-2">1. Gross Salary</h4>
                  <Table columns={partBColumns} data={form16Data.partB.salaryComponents.map(d => ({ ...d, amount: d.amount.toLocaleString('en-IN') }))} />
                  <h4 className="text-md font-semibold text-gray-600 mt-6 mb-2">2. Allowances Exempt</h4>
                  <Table columns={partBColumns} data={form16Data.partB.exemptions.map(d => ({ ...d, amount: d.amount.toLocaleString('en-IN') }))} />
                  <h4 className="text-md font-semibold text-gray-600 mt-6 mb-2">3. Deductions</h4>
                  <Table columns={partBColumns} data={form16Data.partB.deductions.map(d => ({ ...d, amount: d.amount.toLocaleString('en-IN') }))} />
                </section>
            </div>
          </div>
        )}

        {!isLoading && !form16Data && (
             <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600">Please make a selection to generate a Form 16 preview.</p>
             </div>
        )}
      </div>
    </div>
  );
};

export default Form16;