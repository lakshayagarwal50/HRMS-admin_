import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
interface EmployerStatutoryData {
    id: number;
    name: string;
    epf: number;
    eesi: number;
}

// --- MOCK DATA ---
const initialData: EmployerStatutoryData[] = [
    { id: 1, name: 'Devon Lane', epf: 0.00, eesi: 0.00 },
    { id: 2, name: 'Kristin Watson', epf: 0.00, eesi: 0.00 },
    { id: 3, name: 'Marvin McKinney', epf: 0.00, eesi: 0.00 },
    { id: 4, name: 'Kathryn Murphy', epf: 0.00, eesi: 0.00 },
];

// --- MAIN COMPONENT ---
const EmployerStatutoryStepPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [statutoryData, setStatutoryData] = useState(initialData);

    const handleAmountChange = useCallback((employeeId: number, field: keyof Omit<EmployerStatutoryData, 'id' | 'name'>, value: string) => {
        const newAmount = parseFloat(value);
        if (!isNaN(newAmount)) {
            setStatutoryData(prevData =>
                prevData.map(emp =>
                    emp.id === employeeId ? { ...emp, [field]: newAmount } : emp
                )
            );
        }
    }, []);

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-md border overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="w-1/3 py-3 text-left text-sm font-semibold text-gray-800">Employee</th>
                            <th className="w-1/3 py-3 text-left text-sm font-semibold text-gray-800">
                                EPF <span className="text-xs font-normal text-gray-500">([BASIC]*'12/100')</span>
                            </th>
                            <th className="w-1/3 py-3 text-left text-sm font-semibold text-gray-800">
                                EESI <span className="text-xs font-normal text-gray-500">(System Generated)</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {statutoryData.map(employee => (
                            <tr key={employee.id} className="border-t">
                                <td className="py-4 font-medium text-gray-900">{employee.name}</td>
                                <td className="py-4">
                                    <input
                                        type="number"
                                        value={employee.epf.toFixed(2)}
                                        onChange={(e) => handleAmountChange(employee.id, 'epf', e.target.value)}
                                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </td>
                                <td className="py-4">
                                    <input
                                        type="number"
                                        value={employee.eesi.toFixed(2)}
                                        onChange={(e) => handleAmountChange(employee.id, 'eesi', e.target.value)}
                                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-8 flex justify-between">
                <button onClick={() => navigate('/payroll/generate/employee-statutory', { state: location.state })} className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">Previous</button>
                <button onClick={() => navigate('/payroll/generate/loan-repayment', { state: location.state })} className="px-10 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">Next</button>
            </div>
        </>
    );
};

export default EmployerStatutoryStepPage;
