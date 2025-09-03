import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Table, { type Column } from '../../../components/common/Table'; // Adjust path

interface AttendanceData {
    id: number;
    name: string;
    ctc: number;
    lopDays: number;
}

// Updated mock data to match the new screenshot
const initialAttendanceData: AttendanceData[] = [
    { id: 1, name: 'Devon Lane', ctc: 18100.00, lopDays: 2.00 },
    { id: 2, name: 'Kristin Watson', ctc: 4100.00, lopDays: 0.00 },
    { id: 3, name: 'Marvin McKinney', ctc: 24415.00, lopDays: 0.00 },
    { id: 4, name: 'Kathryn Murphy', ctc: 10000.00, lopDays: 3.00 },
];

const AttendanceStepPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState(initialAttendanceData);

    // Handler to update LOP days for a specific employee
    const handleLopChange = (id: number, value: string) => {
        const newLop = parseFloat(value);
        if (!isNaN(newLop)) {
            setAttendance(prev => 
                prev.map(emp => emp.id === id ? { ...emp, lopDays: newLop } : emp)
            );
        }
    };

    const columns: Column<AttendanceData>[] = [
        { 
            header: 'Employee', 
            key: 'name', 
            render: (row) => (
                <div>
                    <p className="font-medium">{row.name}</p>
                    <p className="text-xs text-gray-500">CTC ₹ {row.ctc.toFixed(2)}</p>
                </div>
            ) 
        },
        { 
            header: 'Current Month CTC', 
            key: 'ctc', 
            render: (row) => `CTC ₹ ${row.ctc.toFixed(2)}` 
        },
        { 
            header: 'LOP days', 
            key: 'lopDays', 
            render: (row) => (
                <input 
                    type="number" 
                    value={row.lopDays.toFixed(2)} 
                    onChange={(e) => handleLopChange(row.id, e.target.value)}
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
                data={attendance} 
                showSearch={false} // As per the image, search is not shown on this step
            />
            <div className="mt-8 flex justify-between">
                <button onClick={() => navigate('/payroll/generate/ctc', { state: location.state })} className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50">Previous</button>
                <button onClick={() => navigate('/payroll/generate/gross-earning', { state: location.state })} className="px-10 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700">Next</button>
            </div>
        </>
    );
};

export default AttendanceStepPage;
