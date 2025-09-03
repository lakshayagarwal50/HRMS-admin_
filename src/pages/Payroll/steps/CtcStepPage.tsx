import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table, { type Column } from '../../../components/common/Table'; // Adjust path

// --- Data & Types ---
interface EmployeePayslip {
    id: number;
    name: string;
    actualCTC: number;
    ctc: number;
    selected: boolean;
}

const initialEmployeeData: EmployeePayslip[] = [
    { id: 1, name: 'Courtney Henry', actualCTC: 1200.00, ctc: 1200.00, selected: true },
    { id: 2, name: 'Kristin Watson', actualCTC: 1200.00, ctc: 1200.00, selected: true },
    { id: 3, name: 'Marvin McKinney', actualCTC: 1200.00, ctc: 1200.00, selected: true },
    { id: 4, name: 'Kathryn Murphy', actualCTC: 1200.00, ctc: 1200.00, selected: true },
    { id: 5, name: 'John Doe', actualCTC: 1500.00, ctc: 1500.00, selected: true },
    { id: 6, name: 'Jane Smith', actualCTC: 1800.00, ctc: 1800.00, selected: true },
];

const CtcStepPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState(initialEmployeeData);
    
    const areAllSelected = employees.every(emp => emp.selected);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = e.target;
        setEmployees(employees.map(emp => ({ ...emp, selected: checked })));
    };

    const handleSelectEmployee = (id: number) => {
        setEmployees(employees.map(emp => emp.id === id ? { ...emp, selected: !emp.selected } : emp));
    };

    const handleCtcChange = (id: number, value: string) => {
        const newCtc = parseFloat(value);
        if (!isNaN(newCtc)) {
            setEmployees(employees.map(emp => emp.id === id ? { ...emp, ctc: newCtc } : emp));
        }
    };

    const columns: Column<EmployeePayslip>[] = [
        {
            key: 'checkbox',
            header: <input type="checkbox" checked={areAllSelected} onChange={handleSelectAll} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />,
            render: (row) => <input type="checkbox" checked={row.selected} onChange={() => handleSelectEmployee(row.id)} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />,
        },
        { header: 'Employee', key: 'name' },
        { header: 'Actual CTC', key: 'actualCTC', render: (row) => `₹ ${row.actualCTC.toFixed(2)}` },
        { 
            header: 'CTC', 
            key: 'ctc',
            render: (row) => (
                <input 
                    type="number" 
                    value={row.ctc} 
                    onChange={(e) => handleCtcChange(row.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" 
                />
            )
        },
    ];

    return (
        // The header and stepper are now handled by the parent GeneratePayslipLayout.
        // This component only needs to render its specific content.
        <>
            <Table 
                columns={columns} 
                data={employees} 
                showSearch={true} 
                searchPlaceholder="Search Employee..."
                defaultItemsPerPage={10}
            />
            <div className="mt-8 flex justify-between items-center">
                <button className="px-6 py-2 border rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50" disabled>Previous</button>
                <button 
                    onClick={() => navigate('/payroll/generate/attendance', { state: location.state })} 
                    className="px-10 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700"
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default CtcStepPage;
