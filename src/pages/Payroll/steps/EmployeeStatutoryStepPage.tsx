import React, { useState, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table, { type Column } from '../../../components/common/Table'; // Adjust path

// --- TYPE DEFINITIONS ---
interface StatutoryData {
    id: number;
    name: string;
    providentFund: number;
    professionalTax: number;
    eesi: number;
}

// --- MOCK DATA ---
const initialStatutoryData: StatutoryData[] = [
    { id: 1, name: 'Devon Lane', providentFund: 0.00, professionalTax: 0.00, eesi: 0.00 },
    { id: 2, name: 'Kristin Watson', providentFund: 0.00, professionalTax: 0.00, eesi: 0.00 },
    { id: 3, name: 'Marvin McKinney', providentFund: 0.00, professionalTax: 0.00, eesi: 0.00 },
    { id: 4, name: 'Kathryn Murphy', providentFund: 0.00, professionalTax: 0.00, eesi: 0.00 },
];

// --- MAIN COMPONENT ---
const EmployeeStatutoryStepPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [statutoryData, setStatutoryData] = useState(initialStatutoryData);

    const handleAmountChange = useCallback((employeeId: number, field: keyof Omit<StatutoryData, 'id' | 'name'>, value: string) => {
        const newAmount = parseFloat(value);
        if (!isNaN(newAmount)) {
            setStatutoryData(prevData =>
                prevData.map(emp =>
                    emp.id === employeeId ? { ...emp, [field]: newAmount } : emp
                )
            );
        }
    }, []);

    // Define columns for the generic Table component
    const columns = useMemo<Column<StatutoryData>[]>(() => [
        {
            header: 'Employee',
            key: 'name',
            className: 'w-1/4 font-medium',
        },
        {
            // Corrected: Header now uses a JSX element for consistent styling.
            // Note: Your generic Table's Column interface must accept `React.ReactNode` for the header.
            header: (
                <div>
                    Provident Fund <p className="text-xs font-normal text-gray-500">([BASIC]*'12/100')</p>
                </div>
            ),
            key: 'providentFund',
            className: 'w-1/4',
            render: (row) => (
                <input
                    type="number"
                    value={row.providentFund.toFixed(2)}
                    onChange={(e) => handleAmountChange(row.id, 'providentFund', e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            )
        },
        {
            // Corrected: Header now uses a JSX element for consistent styling.
            header: (
                <div>
                    Professional Tax <p className="text-xs font-normal text-gray-500">(System Generated)</p>
                </div>
            ),
            key: 'professionalTax',
            className: 'w-1/4',
            render: (row) => (
                <input
                    type="number"
                    value={row.professionalTax.toFixed(2)}
                    onChange={(e) => handleAmountChange(row.id, 'professionalTax', e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            )
        },
        {
            // Corrected: Header now uses a JSX element for consistent styling.
            header: (
                <div>
                    EESI <p className="text-xs font-normal text-gray-500">(System Generated)</p>
                </div>
            ),
            key: 'eesi',
            className: 'w-1/4',
            render: (row) => (
                <input
                    type="number"
                    value={row.eesi.toFixed(2)}
                    onChange={(e) => handleAmountChange(row.id, 'eesi', e.target.value)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            )
        }
    ], [handleAmountChange]);

    return (
        <>
            <Table 
                columns={columns}
                data={statutoryData}
                showSearch={false}
                showPagination={false}
            />
             <div className="mt-8 flex justify-between">
                <button onClick={() => navigate('/payroll/generate/loan-approved', { state: location.state })} className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50">Previous</button>
                <button onClick={() => navigate('/payroll/generate/employer-statutory', { state: location.state })} className="px-10 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">Next</button>
            </div>
        </>
    );
};

export default EmployeeStatutoryStepPage;
