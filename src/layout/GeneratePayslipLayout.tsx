import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Stepper from '../components/Payroll/Stepper'; // Adjust path as needed

const GeneratePayslipLayout: React.FC = () => {
    const location = useLocation();
    // Get the year and month passed from the CrystalRunPage
    const { year, month } = location.state || { year: 'N/A', month: 'N/A' };

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6 min-h-screen">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Generate Payslips for {month}-{year}</h1>
                    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
                        <Link to="/payroll/crystal" className="hover:text-gray-700">Crystal Run</Link>
                        <ChevronRight size={16} className="mx-2" />
                        <Link to="" className="hover:text-gray-700">Generate Payslips </Link>
                    </nav>
                </div>
            </header>
            <main>
                <Stepper />
                {/* The Outlet component renders the currently active step's page */}
                <Outlet />
            </main>
        </div>
    );
};

export default GeneratePayslipLayout;
