import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
interface LoanData {
    id: number;
    name: string;
    loanAmount: number;
}

// --- MOCK DATA ---
const initialLoanData: LoanData[] = [
    { id: 1, name: 'Devon Lane', loanAmount: 1200.00 },
    { id: 2, name: 'Kristin Watson', loanAmount: 1200.00 },
    { id: 3, name: 'Marvin McKinney', loanAmount: 1200.00 },
    { id: 4, name: 'Kathryn Murphy', loanAmount: 1200.00 },
];

// --- MAIN COMPONENT ---
const LoanApprovedStepPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loanData, setLoanData] = useState(initialLoanData);

    const handleAmountChange = (employeeId: number, value: string) => {
        const newAmount = parseFloat(value);
        if (!isNaN(newAmount)) {
            setLoanData(prevData =>
                prevData.map(emp =>
                    emp.id === employeeId ? { ...emp, loanAmount: newAmount } : emp
                )
            );
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md border overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="w-8/12 py-3 text-left text-sm font-semibold text-gray-800">Employee</th>
                            <th className="w-4/12 py-3 text-left text-sm font-semibold text-gray-800">Loan amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loanData.map(employee => (
                            <tr key={employee.id} className="border-t">
                                <td className="py-4 font-medium text-gray-900">{employee.name}</td>
                                <td className="py-4">
                                    <input
                                        type="number"
                                        value={employee.loanAmount.toFixed(2)}
                                        onChange={(e) => handleAmountChange(employee.id, e.target.value)}
                                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-8 flex justify-between">
                <button onClick={() => navigate('/payroll/generate/gross-earning', { state: location.state })} className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50">Previous</button>
                <button onClick={() => navigate('/payroll/generate/employee-statutory', { state: location.state })} className="px-10 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">Next</button>
            </div>
        </>
    );
};

export default LoanApprovedStepPage;
