import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// --- MOCK DATA FUNCTION ---
// In a real app, you would fetch this data based on the ID
const getComponentDataById = (id: string) => {
    const allComponents = [
        { id: 'e1', name: 'Basic', code: 'BASIC', type: 'earning', showOnPayslip: true, taxable: true, isCtc: true, leaveDependent: false, deductBeforeTax: false, adjustBalance: false, calcType: 'formula', valueFormula: '[CTC]*50/100', minAmount: 0, maxAmount: 0, prorate: false },
        { id: 'e2', name: 'House Rent Allowance(HRA)', code: 'HRA', type: 'earning', showOnPayslip: true, taxable: true, isCtc: true, leaveDependent: false, deductBeforeTax: false, adjustBalance: false, calcType: 'formula', valueFormula: '[BASIC]*50/100', minAmount: 0, maxAmount: 0, prorate: false },
        // ... other components
    ];
    return allComponents.find(c => c.id === id) || null;
};


// --- MAIN EDIT PAGE COMPONENT ---
const EditSalaryComponentPage: React.FC = () => {
    const { componentId, groupName } = useParams<{ componentId: string, groupName: string }>();
    
    // Form state, initialized with mock data
    const [componentData, setComponentData] = useState<any>(null);

    useEffect(() => {
        // Simulate fetching data
        if (componentId) {
            const data = getComponentDataById(componentId);
            setComponentData(data);
        }
    }, [componentId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setComponentData({ ...componentData, [name]: checked });
        } else {
            setComponentData({ ...componentData, [name]: value });
        }
    };

    if (!componentData) {
        return <div>Loading component data...</div>; // Or a proper loader
    }

    return (
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
            {/* Page Header */}
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Salary Component(Group:{groupName})</h1>
                <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
                    <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <Link to="/payslip-components" className="hover:text-gray-700">Payslip components</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <Link to="/employee-salary-structures" className="hover:text-gray-700">Employee Salary Structures</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="font-medium text-gray-800">Edit component</span>
                </nav>
            </header>

            {/* Main Content Grid */}
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form */}
                <div className="lg:col-span-2 space-y-6 p-6 border rounded-lg bg-gray-50">
                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">EDIT PAYSLIP</h2>
                    
                    {/* Form Fields */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
                        <input type="text" id="name" name="name" value={componentData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code *</label>
                        <input type="text" id="code" name="code" value={componentData.code} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"/>
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type *</label>
                        <select id="type" name="type" value={componentData.type} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                            <option value="">Choose Type</option>
                            <option value="earning">Earning</option>
                            <option value="deduction">Deduction</option>
                            <option value="reimbursement">Reimbursement</option>
                        </select>
                    </div>
                     <div className="flex items-center">
                        <input id="showOnPayslip" name="showOnPayslip" type="checkbox" checked={componentData.showOnPayslip} onChange={handleInputChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                        <label htmlFor="showOnPayslip" className="ml-2 block text-sm text-gray-900">Show on payslip</label>
                    </div>

                    {/* Tax Calculation Section */}
                    <div className="space-y-3 pt-4 border-t">
                        <h3 className="text-md font-semibold text-gray-800">Tax Calculation</h3>
                        <div className="grid grid-cols-2 gap-3">
                           <div className="flex items-center"><input id="taxable" name="taxable" type="checkbox" checked={componentData.taxable} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="taxable" className="ml-2 text-sm">Taxable</label></div>
                           <div className="flex items-center"><input id="nonTaxable" name="taxable" type="checkbox" checked={!componentData.taxable} onChange={(e) => setComponentData({...componentData, taxable: !e.target.checked})} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="nonTaxable" className="ml-2 text-sm">Non-Taxable</label></div>
                           <div className="flex items-center"><input id="isCtc" name="isCtc" type="checkbox" checked={componentData.isCtc} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="isCtc" className="ml-2 text-sm">Part of CTC</label></div>
                           <div className="flex items-center"><input id="leaveDependent" name="leaveDependent" type="checkbox" checked={componentData.leaveDependent} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="leaveDependent" className="ml-2 text-sm">Leave dependent</label></div>
                           <div className="flex items-center"><input id="deductBeforeTax" name="deductBeforeTax" type="checkbox" checked={componentData.deductBeforeTax} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="deductBeforeTax" className="ml-2 text-sm">Deduct Before Tax Calculation</label></div>
                           <div className="flex items-center"><input id="adjustBalance" name="adjustBalance" type="checkbox" checked={componentData.adjustBalance} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" /><label htmlFor="adjustBalance" className="ml-2 text-sm">Adjust Balance Amount</label></div>
                        </div>
                    </div>

                    {/* Calculation Type Section */}
                    <div className="space-y-3 pt-4 border-t">
                        <div>
                            <label htmlFor="calcType" className="block text-sm font-medium text-gray-700">Calculation Type</label>
                            <select id="calcType" name="calcType" value={componentData.calcType} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border bg-white rounded-md">
                                <option value="fixed">Fixed</option>
                                <option value="formula">Formula</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-3 sm:col-span-1">
                                <label htmlFor="valueFormula" className="block text-sm font-medium text-gray-700">Value/Formula</label>
                                <input type="text" id="valueFormula" name="valueFormula" value={componentData.valueFormula} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
                            </div>
                            <div className="col-span-3 sm:col-span-1">
                                <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700">Min Amount</label>
                                <input type="number" id="minAmount" name="minAmount" value={componentData.minAmount} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
                            </div>
                             <div className="col-span-3 sm:col-span-1">
                                <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">Max Amount</label>
                                <input type="number" id="maxAmount" name="maxAmount" value={componentData.maxAmount} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
                            </div>
                        </div>
                    </div>
                     <div className="flex items-center pt-4 border-t">
                        <input id="prorate" name="prorate" type="checkbox" checked={componentData.prorate} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded" />
                        <label htmlFor="prorate" className="ml-2 block text-sm text-gray-900">Prorate amount <span className="text-gray-500">(Only if employee join or leave in middle of month. Amount will be prorated)</span></label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <button type="button" className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">UPDATE</button>
                    </div>
                </div>

                {/* Right Column: Help Text */}
                <div className="lg:col-span-1 space-y-4 text-sm text-gray-600">
                    <div><h4 className="font-semibold text-gray-800">Code:</h4><p>Unique code identify Type of Salary. For example HRA(House Rent Allowance), BASIC(Basic Salary). Note: If its Basic or House Rent allowance then please keep Code as BASIC or HRA.</p></div>
                    <div><h4 className="font-semibold text-gray-800">Type:</h4><p>Type of Salary Head, Choose any one from following:</p></div>
                    <div><h4 className="font-semibold text-gray-800">1. Earnings:</h4><p>If Salary head is Earning for Employee and part of CTC. Like Basic, DA etc.</p></div>
                    <div><h4 className="font-semibold text-gray-800">2. OverTime:</h4><p>If Employee make some money by doing overtime.(Note: This will be taxable). Please Select "Taxable" Column.</p></div>
                    <div><h4 className="font-semibold text-gray-800">3. Reimbursement:</h4><p>Neither a Earning nor a Deduction. This is amount that employee spend for Organization during job. Note: This will not be a "Taxable"</p></div>
                    <div><h4 className="font-semibold text-gray-800">4. Leave Encashment:</h4><p>Leave encashment denotes an amount of money obtained in exchange for a period of leave not availed by an employee. Encashment of acquired leave can be taken by an employee at the time of employment. It is done during the continuance of service or at the time of resigning the job.</p></div>
                    <div><h4 className="font-semibold text-gray-800">Taxable:</h4><p>Tell us that do we need to include this item amount for taxable income or not</p></div>
                    <div><h4 className="font-semibold text-gray-800">Leave Dependent:</h4><p>If this is selected then LOP days will be calculated on the number of unpaid leaves taken by the employee</p></div>
                    <div><h4 className="font-semibold text-gray-800">Part Of CTC.</h4><p>If this is selected then this component amount will be consider as CTC amount, while calculating Monthly Salary</p></div>
                    <div><h4 className="font-semibold text-gray-800">Calculation Type:</h4><p>Can be Fixed or Formula. Select if its Fixed amount item</p></div>
                    <div><h4 className="font-semibold text-gray-800">Value/Formula:</h4><p>Make it 0 if you want to enter amount at the time creating payslip for employee. Otherwise fill be right amount if its fixed or Formula if its Formula field.</p><p className="mt-2">Ex. Formula:- [BASIC] * 50 / 100. Means this item will be 50% of BASIC item.</p></div>
                </div>
            </main>
        </div>
    );
};

export default EditSalaryComponentPage;
