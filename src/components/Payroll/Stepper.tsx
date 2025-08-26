import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const steps = [
    { name: 'CTC', path: '/payroll/generate/ctc' },
    { name: 'Attendance', path: '/payroll/generate/attendance' },
    { name: 'Gross Earning', path: '/payroll/generate/gross-earning' },
    { name: 'Loan Approved', path: '/payroll/generate/loan-approved' },
    { name: 'Employee Statutory', path: '/payroll/generate/employee-statutory' },
    { name: 'Employer Statutory', path: '/payroll/generate/employer-statutory' },
    { name: 'Loan Repayment', path: '/payroll/generate/loan-repayment' },
    { name: 'Process Payslip', path: '/payroll/generate/process' },
];

const Stepper: React.FC = () => {
    const location = useLocation();
    const activeIndex = steps.findIndex(step => location.pathname.startsWith(step.path));

    return (
        <div className="mb-8 flex items-center justify-between text-sm font-medium text-gray-500 overflow-x-auto pb-4">
            {steps.map((step, index) => (
                <React.Fragment key={step.name}>
                    <Link to={{ pathname: step.path }} state={location.state} className="flex items-center gap-2 flex-shrink-0">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full ${index <= activeIndex ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
                            {index + 1}
                        </span>
                        <span className={index === activeIndex ? 'text-purple-600 font-semibold' : ''}>{step.name}</span>
                    </Link>
                    {index < steps.length - 1 && <div className="flex-1 h-px bg-gray-300 mx-4 hidden sm:block"></div>}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Stepper;
