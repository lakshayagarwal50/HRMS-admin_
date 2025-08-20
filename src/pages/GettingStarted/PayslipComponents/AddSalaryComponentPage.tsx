import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// --- TYPE DEFINITION for the form state ---
interface NewComponentData {
    name: string;
    code: string;
    type: 'earning' | 'deduction' | 'reimbursement' | 'overtime' | 'leave_encashment' | '';
    showOnPayslip: boolean;
    taxable: boolean;
    isCtc: boolean;
    leaveDependent: boolean;
    deductBeforeTax: boolean;
    adjustBalance: boolean;
    calcType: 'fixed' | 'formula';
    valueFormula: string;
    minAmount: number;
    maxAmount: number;
    prorate: boolean;
}

// --- MAIN ADD PAGE COMPONENT ---
const AddSalaryComponentPage: React.FC = () => {
    const { groupName } = useParams<{ groupName: string }>();
    const navigate = useNavigate();
    
    // --- Initial state for a new component ---
    const [componentData, setComponentData] = useState<NewComponentData>({
        name: '',
        code: '',
        type: '',
        showOnPayslip: true,
        taxable: true,
        isCtc: false,
        leaveDependent: false,
        deductBeforeTax: false,
        adjustBalance: false,
        calcType: 'fixed',
        valueFormula: '0',
        minAmount: 0,
        maxAmount: 0,
        prorate: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setComponentData({ ...componentData, [name]: checked });
        } else if (type === 'radio') {
             setComponentData({ ...componentData, [name]: value === 'true' });
        } else {
            setComponentData({ ...componentData, [name]: value });
        }
    };

    const handleCancel = () => {
        navigate(`/salary-group/${groupName}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // --- Replace this with your actual submission logic ---
        console.log("Submitting new component:", componentData);
        // For example: callAPIAdd('/api/components', componentData);
        navigate(`/salary-group/${groupName}`);
    };

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6">
            {/* Page Header */}
            <header className="mb-6 flex justify-between items-center">
                 <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Salary Component(Group:{groupName})</h1>
                <nav aria-label="Breadcrumb" className="hidden sm:flex items-center text-sm text-gray-500">
                    <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <Link to="/payslip-components" className="hover:text-gray-700">Payslip components</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <Link to={`/salary-group/${groupName}`} className="hover:text-gray-700">Employee Salary Structures</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="font-medium text-gray-800">Add new component</span>
                </nav>
            </header>

            {/* Main Content Grid */}
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Form */}
                <form className="bg-white p-6 rounded-lg shadow-md border space-y-6" onSubmit={handleSubmit}>
                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input type="text" id="name" name="name" value={componentData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                            <input type="text" id="code" name="code" value={componentData.code} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                        </div>
                         <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                            <select id="type" name="type" value={componentData.type} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                                <option value="">Choose Type</option>
                                <option value="earning">Earning</option>
                                <option value="deduction">Deduction</option>
                                <option value="reimbursement">Reimbursement</option>
                                <option value="overtime">OverTime</option>
                                <option value="leave_encashment">Leave Encashment</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        <input id="showOnPayslip" name="showOnPayslip" type="checkbox" checked={componentData.showOnPayslip} onChange={handleInputChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                        <label htmlFor="showOnPayslip" className="ml-3 block text-sm font-medium text-gray-900">Show on payslip</label>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <h3 className="text-md font-semibold text-gray-800">Tax Calculation</h3>
                        <div className="space-y-3">
                           <div className="flex items-center"><input id="taxable" name="taxable" type="radio" value="true" checked={componentData.taxable === true} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="taxable" className="ml-3 text-sm font-medium text-gray-900">Taxable</label></div>
                           <div className="flex items-center"><input id="nonTaxable" name="taxable" type="radio" value="false" checked={componentData.taxable === false} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="nonTaxable" className="ml-3 text-sm font-medium text-gray-900">Non-Taxable</label></div>
                        </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center"><input id="isCtc" name="isCtc" type="checkbox" checked={componentData.isCtc} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="isCtc" className="ml-3 text-sm font-medium text-gray-900">Part of CTC</label></div>
                       <div className="flex items-center"><input id="leaveDependent" name="leaveDependent" type="checkbox" checked={componentData.leaveDependent} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="leaveDependent" className="ml-3 text-sm font-medium text-gray-900">Leave dependent</label></div>
                       <div className="flex items-center"><input id="deductBeforeTax" name="deductBeforeTax" type="checkbox" checked={componentData.deductBeforeTax} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="deductBeforeTax" className="ml-3 text-sm font-medium text-gray-900">Deduct Before Tax Calculation</label></div>
                       <div className="flex items-center"><input id="adjustBalance" name="adjustBalance" type="checkbox" checked={componentData.adjustBalance} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="adjustBalance" className="ml-3 text-sm font-medium text-gray-900">Adjust Balance Amount</label></div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div>
                            <label htmlFor="calcType" className="block text-sm font-medium text-gray-700 mb-1">Calculation Type</label>
                            <select id="calcType" name="calcType" value={componentData.calcType} onChange={handleInputChange} className="w-full px-3 py-2 border bg-white rounded-md">
                                <option value="fixed">Fixed</option>
                                <option value="formula">Formula</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-1">
                                <label htmlFor="valueFormula" className="block text-sm font-medium text-gray-700 mb-1">Value/Formula</label>
                                <input type="text" id="valueFormula" name="valueFormula" value={componentData.valueFormula} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md"/>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                                <input type="number" id="minAmount" name="minAmount" value={componentData.minAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md"/>
                            </div>
                             <div className="sm:col-span-1">
                                <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                                <input type="number" id="maxAmount" name="maxAmount" value={componentData.maxAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md"/>
                            </div>
                        </div>
                    </div>
                     <div className="flex items-start pt-4 border-t">
                        <input id="prorate" name="prorate" type="checkbox" checked={componentData.prorate} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded mt-1" />
                        <label htmlFor="prorate" className="ml-3 block text-sm font-medium text-gray-900">Prorate amount <span className="text-gray-500 font-normal">(Only if employee join or leave in middle of month. Amount will be prorated)</span></label>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <button type="button" onClick={handleCancel} className="px-8 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-8 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">SUBMIT</button>
                    </div>
                </form>

                {/* Right Column: Help Text */}
                <div className="space-y-5 text-sm text-gray-600 p-4">
                    <div><h4 className="font-semibold text-gray-800">Code:</h4><p>Unique code identify Type of Salary. For example HRA(House Rent Allowance), BASIC(Basic Salary). Note: If its Basic or House Rent allowance then please keep Code as BASIC or HRA.</p></div>
                    <div><h4 className="font-semibold text-gray-800">Type:</h4><p>Type of Salary Head, Choose any one from following</p></div>
                    <div><h4 className="font-semibold text-gray-800">1. Earnings:</h4><p>If Salary head is Earning for Employee and part of CTC. Like Basic, DA etc.</p></div>
                    <div><h4 className="font-semibold text-gray-800">2. OverTime:</h4><p>If Employee make some money by doing overtime.(Note: This will be taxable). Please Select "Taxable" Column.</p></div>
                    <div><h4 className="font-semibold text-gray-800">3. Reimbursement:</h4><p>Neither a Earning nor a Deduction. This is amount that employee spend for Organization during job. Note: This will not be a "Taxable"</p></div>
                    <div><h4 className="font-semibold text-gray-800">4. Leave Encashment:</h4><p>Leave encashment denotes an amount of money obtained in exchange for a period of leave not availed by an employee...</p></div>
                    <div><h4 className="font-semibold text-gray-800">Taxable:</h4><p>Tell us that do we need to include this item amount for taxable income or not</p></div>
                    <div><h4 className="font-semibold text-gray-800">Attendance Dependent:</h4><p>If this is selected then this component amount will be calculated according to Number of days worked by employee.</p><div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700">Ex. Amount = 1200<br/>Days in Month = 30<br/>Loss Pay Days = 2<br/><br/>Net Amount would be: 1200 / 30 * (30 - 2) = 1120</div></div>
                    <div><h4 className="font-semibold text-gray-800">Part Of CTC:</h4><p>If this is selected then this component amount will be consider as CTC amount, while calculating Monthly Salary</p></div>
                    <div><h4 className="font-semibold text-gray-800">Calculation Type:</h4><p>Can be Fixed or Formula. Select if its Fixed amount item</p></div>
                    <div><h4 className="font-semibold text-gray-800">Value/Formula:</h4><p>Make it 0 if you want to enter amount at the time creating payslip for employee. Otherwise fill be right amount if its fixed or Formula if its Formula field.</p><p className="mt-2">Ex. Formula:- [BASIC] * 50 / 100. Means this item will be 50% of BASIC item.</p></div>
                </div>
            </main>
        </div>
    );
};

export default AddSalaryComponentPage;
