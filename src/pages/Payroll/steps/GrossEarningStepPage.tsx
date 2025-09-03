import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Adjust path

// --- TYPE DEFINITIONS ---
interface EarningComponents {
    reimbursements: number;
    leaveEncashment: number;
    grossEarning: number;
    lopAmount: number;
    netAmount: number;
}

interface GrossEarningData {
    id: number;
    name: string;
    earnings: EarningComponents;
}

// --- MOCK DATA ---
const initialGrossData: GrossEarningData[] = [
    { id: 1, name: 'Devon Lane', earnings: { reimbursements: 1200.00, leaveEncashment: 1200.00, grossEarning: 1200.00, lopAmount: 1200.00, netAmount: 1200.00 } },
    { id: 2, name: 'Kristin Watson', earnings: { reimbursements: 1200.00, leaveEncashment: 1200.00, grossEarning: 1200.00, lopAmount: 1200.00, netAmount: 1200.00 } },
    { id: 3, name: 'Marvin McKinney', earnings: { reimbursements: 1200.00, leaveEncashment: 1200.00, grossEarning: 1200.00, lopAmount: 1200.00, netAmount: 1200.00 } },
    { id: 4, name: 'Kathryn Murphy', earnings: { reimbursements: 1200.00, leaveEncashment: 1200.00, grossEarning: 1200.00, lopAmount: 1200.00, netAmount: 1200.00 } },
];

// --- MAIN COMPONENT ---
const GrossEarningStepPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [earningsData, setEarningsData] = useState(initialGrossData);

    const handleAmountChange = (employeeId: number, component: keyof EarningComponents, value: string) => {
        const newAmount = parseFloat(value);
        if (!isNaN(newAmount)) {
            setEarningsData(prevData =>
                prevData.map(emp =>
                    emp.id === employeeId
                        ? { ...emp, earnings: { ...emp.earnings, [component]: newAmount } }
                        : emp
                )
            );
        }
    };

    const earningHeaders = [
        { key: 'reimbursements', title: 'Reimbursements' },
        { key: 'leaveEncashment', title: 'Leave Encashments' },
        { key: 'grossEarning', title: 'Gross earning' },
        { key: 'lopAmount', title: 'LOP Amount' },
        { key: 'netAmount', title: 'Net Amount' },
    ];
    
    const subHeaders = [
        { key: 'reimbursements', title: 'Total Amount' },
        { key: 'leaveEncashment', title: 'Total Amount' },
        { key: 'grossEarning', title: 'Total Amount' },
        { key: 'lopAmount', title: 'LOP Amount' },
        { key: 'netAmount', title: 'Net Amount' },
    ];


    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md border overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4 text-left text-sm font-semibold text-gray-800">Employee</th>
                            {earningHeaders.map(header => (
                                <th key={header.key} className="p-4 text-left text-sm font-semibold text-gray-800">
                                    {header.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Sub-header row for "Total Amount" */}
                        <tr className="border-b bg-gray-50">
                            <td className="p-4"></td>
                            {subHeaders.map(header => (
                                <td key={header.key} className="p-4 text-left text-xs font-medium text-gray-600">{header.title}</td>
                            ))}
                        </tr>
                        {/* Data rows */}
                        {earningsData.map(employee => (
                            <tr key={employee.id} className="border-b last:border-b-0">
                                <td className="p-4 font-medium text-gray-900">{employee.name}</td>
                                {earningHeaders.map(header => (
                                    <td key={header.key} className="p-4">
                                        <input
                                            type="number"
                                            value={employee.earnings[header.key as keyof EarningComponents].toFixed(2)}
                                            onChange={(e) => handleAmountChange(employee.id, header.key as keyof EarningComponents, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-8 flex justify-between">
                <button onClick={() => navigate('/payroll/generate/attendance', { state: location.state })} className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50">Previous</button>
                <button onClick={() => navigate('/payroll/generate/loan-approved', { state: location.state })} className="px-10 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">Next</button>
            </div>
        </>
    );
};

export default GrossEarningStepPage;
