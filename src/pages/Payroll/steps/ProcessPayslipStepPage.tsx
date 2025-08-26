import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface ProcessPayslipData {
    id: number;
    name: string;
    payslipId: string;
    grossEarning: number;
    empStatutory: number;
    lopAmount: number;
    lopDays: number;
    incomeTax: number;
    netPayable: number;
    employerStatutory: number;
    ctc: number;
}

// --- MOCK DATA ---
const initialPayslipData: ProcessPayslipData[] = [
    { id: 1, name: 'Devon Lane', payslipId: '#4151', grossEarning: 0.00, empStatutory: 0.00, lopAmount: 100.00, lopDays: 2, incomeTax: 0.00, netPayable: 0.00, employerStatutory: 0.00, ctc: 0.00 },
    { id: 2, name: 'Kristin Watson', payslipId: '#4151', grossEarning: 0.00, empStatutory: 0.00, lopAmount: 200.00, lopDays: 3, incomeTax: 0.00, netPayable: 0.00, employerStatutory: 0.00, ctc: 0.00 },
    { id: 3, name: 'Marvin McKinney', payslipId: '#4151', grossEarning: 15111.00, empStatutory: 0.00, lopAmount: 100.00, lopDays: 2, incomeTax: 0.00, netPayable: 54614.00, employerStatutory: 0.00, ctc: 54614.00 },
    { id: 4, name: 'Kathryn Murphy', payslipId: '#4516', grossEarning: 1531.00, empStatutory: 0.00, lopAmount: 200.00, lopDays: 3, incomeTax: 0.00, netPayable: 46161.00, employerStatutory: 0.00, ctc: 46161.00 },
];

// --- Success Toast Component ---
const SuccessToast: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed top-5 right-5 bg-white border-l-4 border-green-500 rounded-md shadow-lg p-4 flex items-start z-50">
        <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
        <div className="flex-1">
            <p className="font-bold text-gray-800">Success!</p>
            <p className="text-sm text-gray-600">Successfully Processed Payslip</p>
        </div>
        <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
        </button>
    </div>
);


// --- MAIN COMPONENT ---
const ProcessPayslipStepPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [payslipData, setPayslipData] = useState(initialPayslipData);
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    const handleTaxChange = useCallback((employeeId: number, value: string) => {
        const newAmount = parseFloat(value);
        if (!isNaN(newAmount)) {
            setPayslipData(prevData =>
                prevData.map(emp =>
                    emp.id === employeeId ? { ...emp, incomeTax: newAmount } : emp
                )
            );
        }
    }, []);

    const handleProceed = () => {
        // In a real app, you would dispatch an action here to finalize the payroll
        console.log("Final Payslip Data:", payslipData);
        setShowSuccessToast(true);

        // Optional: Navigate away after a few seconds
        setTimeout(() => {
            navigate('/dashboard');
        }, 3000); 
    };

    return (
        <>
            {showSuccessToast && <SuccessToast onClose={() => setShowSuccessToast(false)} />}
            <div className="bg-white p-6 rounded-lg shadow-md border overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Employee</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Payslip</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Gross Earning</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Emp. Statutory</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">LOP amount</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Income Tax</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">NetPayable</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">Emp. Statutory</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-800">CTC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payslipData.map(employee => (
                            <tr key={employee.id} className="border-t">
                                <td className="py-4 px-4 font-medium text-gray-900">{employee.name}</td>
                                <td className="py-4 px-4 text-sm text-gray-600">{employee.payslipId}</td>
                                <td className="py-4 px-4 text-sm text-gray-600">{employee.grossEarning.toFixed(2)}</td>
                                <td className="py-4 px-4 text-sm text-gray-600">{employee.empStatutory.toFixed(2)}</td>
                                <td className="py-4 px-4 text-sm text-gray-600">{employee.lopAmount.toFixed(2)} ({employee.lopDays} Days)</td>
                                <td className="py-4 px-4">
                                    <input
                                        type="number"
                                        value={employee.incomeTax.toFixed(2)}
                                        onChange={(e) => handleTaxChange(employee.id, e.target.value)}
                                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-600">{employee.netPayable.toFixed(2)}</td>
                                <td className="py-4 px-4 text-sm text-gray-600">{employee.employerStatutory.toFixed(2)}</td>
                                <td className="py-4 px-4 text-sm text-gray-600">{employee.ctc.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="mt-8 flex justify-between">
                <button onClick={() => navigate('/payroll/generate/loan-repayment', { state: location.state })} className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">Previous</button>
                <button onClick={handleProceed} className="px-10 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">Proceed</button>
            </div>
        </>
    );
};

export default ProcessPayslipStepPage;
