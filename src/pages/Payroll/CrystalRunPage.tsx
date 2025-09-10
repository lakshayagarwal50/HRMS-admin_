import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';

const CrystalRunPage: React.FC = () => {
    const [year, setYear] = useState('2022');
    const [month, setMonth] = useState('October');
    const [group, setGroup] = useState('Default');
    const navigate = useNavigate();

    // Mock data for dropdowns
    const years = ['2024', '2023', '2022'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const groups = ['Default', 'Employee', 'HR', 'Trainee', 'Intern'];

    const handleReset = () => {
        setYear('');
        setMonth('');
        setGroup('');
    };

    const handleRun = () => {
        if (year && month && group) {
            // Navigate to the first step of the generation process (the CTC page)
            // and pass the selected data in the route's state
            navigate('/payroll/generate/ctc', { state: { year, month, group } });
        } else {
            alert('Please select Year, Month, and Group to proceed.');
        }
    };

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6 min-h-screen">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Crystal run</h1>
                    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
                        <span className="font-medium text-gray-800">Payroll</span>
                        
                        <ChevronRight size={16} className="mx-2" />
                        <span className="font-medium text-gray-800">Crystal Run</span>
                    </nav>
                </div>
            </header>

            <main>
                <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-800 p-4 rounded-r-lg mb-8">
                    <p>Please Select Salary Component Group To Proceed</p>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    {/* Year Dropdown */}
                    <div className="relative">
                        <select 
                            value={year} 
                            onChange={(e) => setYear(e.target.value)} 
                            className="appearance-none w-48 bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="" disabled>SELECT YEAR</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    {/* Month Dropdown */}
                    <div className="relative">
                        <select 
                            value={month} 
                            onChange={(e) => setMonth(e.target.value)} 
                            className="appearance-none w-48 bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="" disabled>SELECT MONTH</option>
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    {/* Group Dropdown */}
                    <div className="relative">
                        <select 
                            value={group} 
                            onChange={(e) => setGroup(e.target.value)} 
                            className="appearance-none w-48 bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="" disabled>SELECT GROUP</option>
                            {groups.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 ml-auto">
                        <button 
                            onClick={handleReset} 
                            className="px-10 py-3 bg-white border border-purple-600 text-purple-600 font-semibold rounded-lg shadow-sm hover:bg-purple-50 transition-colors"
                        >
                            RESET
                        </button>
                        <button 
                            onClick={handleRun} 
                            className="px-12 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
                        >
                            RUN
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CrystalRunPage;
