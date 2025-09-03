import React, { useState, type ChangeEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { addSalaryComponent, type NewSalaryComponentPayload } from '../../../store/slice/salaryComponentSlice';

// --- MAIN ADD PAGE COMPONENT ---
const AddSalaryComponentPage: React.FC = () => {
    const { structureId } = useParams<{ structureId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    // Local state to manage the form inputs
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'EARNING',
        showOnPayslip: true,
        taxable: true,
        isCtc: true,
        leaveBased: false,
        adjustmentBalanced: false,
        calculationType: 'fixed',
        value: '0',
        testAmount: '0', // Ensure testAmount is part of the form state
    });

    // **CORRECTED:** Removed useCallback to ensure this function always has the latest state.
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const { checked } = e.target as HTMLInputElement;

        if (name === "taxableOption") {
            setFormData(prev => ({ ...prev, taxable: value === 'taxable' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: isCheckbox ? checked : value }));
        }
    };

    // **CORRECTED:** Removed useCallback to ensure this function always has the latest state.
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!structureId || !formData.name || !formData.code) {
            alert('Please fill in all required fields.');
            return;
        }

        const componentData: NewSalaryComponentPayload = {
            name: formData.name,
            code: formData.code,
            type: formData.type.toUpperCase(),
            showOnPayslip: formData.showOnPayslip,
            calculationType: formData.calculationType,
            value: formData.value,
            testAmount: formData.testAmount, // Send the test amount to the API
            otherSetting: {
                taxable: formData.taxable,
                leaveBased: formData.leaveBased,
                CTC: formData.isCtc,
                adjustmentBalanced: formData.adjustmentBalanced,
            },
        };

        dispatch(addSalaryComponent({ structureId, componentData }));
        navigate(`/employee-salary-structures/${structureId}/components`);
    };

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6">
            <header className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add Salary Component</h1>
                <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
                  
                    <Link to={`/employee-salary-structures/${structureId}/components`} className="hover:text-gray-700">Salary Structures</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="font-medium text-gray-800">Add New</span>
                </nav>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-6">
                    {/* Form fields remain the same */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                        <input type="text" id="code" name="code" value={formData.code} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                        <select id="type" name="type" value={formData.type} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="EARNING">Earning</option>
                            <option value="DEDUCTION">Deduction</option>
                            <option value="REIMBURSEMENT">Reimbursement</option>
                        </select>
                    </div>
                     <div className="flex items-center pt-2">
                        <input id="showOnPayslip" name="showOnPayslip" type="checkbox" checked={formData.showOnPayslip} onChange={handleInputChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"/>
                        <label htmlFor="showOnPayslip" className="ml-2 font-medium">Show on payslip</label>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <h3 className="text-md font-semibold">Other Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center"><input id="taxable" name="taxable" type="checkbox" checked={formData.taxable} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded"/><label htmlFor="taxable" className="ml-2">Taxable</label></div>
                            <div className="flex items-center"><input id="isCtc" name="isCtc" type="checkbox" checked={formData.isCtc} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded"/><label htmlFor="isCtc" className="ml-2">Part of CTC</label></div>
                            <div className="flex items-center"><input id="leaveBased" name="leaveBased" type="checkbox" checked={formData.leaveBased} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded"/><label htmlFor="leaveBased" className="ml-2">Leave Based</label></div>
                            <div className="flex items-center"><input id="adjustmentBalanced" name="adjustmentBalanced" type="checkbox" checked={formData.adjustmentBalanced} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded"/><label htmlFor="adjustmentBalanced" className="ml-2">Adjust Balance</label></div>
                        </div>
                    </div>

                     <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-md font-semibold">Calculation</h3>
                        <div>
                            <label htmlFor="calculationType" className="block text-sm font-medium text-gray-700 mb-1">Calculation Type</label>
                            <select id="calculationType" name="calculationType" value={formData.calculationType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                                <option value="fixed">Fixed</option>
                                <option value="formula">Formula</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">Value / Formula</label>
                                <input type="text" id="value" name="value" value={formData.value} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                             <div>
                                <label htmlFor="testAmount" className="block text-sm font-medium text-gray-700 mb-1">Test Amount</label>
                                <input type="text" id="testAmount" name="testAmount" value={formData.testAmount} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <button type="button" onClick={() => navigate(-1)} className="px-8 py-2 border rounded-md">Cancel</button>
                        <button type="submit" className="px-8 py-2 bg-purple-600 text-white rounded-md">SUBMIT</button>
                    </div>
                </form>

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
