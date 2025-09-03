import React, { useState, useEffect, useMemo, useCallback, type ChangeEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, RefreshCw, ServerCrash, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchSalaryComponents, updateSalaryComponent, type UpdateComponentPayload } from '../../../store/slice/salaryComponentSlice';

// --- UI State Components ---
const FormSkeleton: React.FC = () => (
    <div className="w-full bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i}>
                        <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded-md w-full"></div>
                    </div>
                ))}
            </div>
            <div className="space-y-4">
                 <div className="h-40 bg-gray-200 rounded-lg"></div>
                 <div className="h-24 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void; message: string | null }> = ({ onRetry, message }) => (
    <div className="text-center py-10 px-4 bg-red-50 border rounded-lg">
        <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold text-red-800">Could Not Load Component</h3>
        <p className="mt-1 text-sm text-red-600">{message || 'An unexpected error occurred.'}</p>
        <button type="button" onClick={onRetry} className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
            <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
            Try Again
        </button>
    </div>
);

// --- MAIN EDIT PAGE COMPONENT ---
const EditSalaryComponentPage: React.FC = () => {
    const { structureId, componentId } = useParams<{ structureId: string; componentId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { data: componentData, status, error } = useSelector((state: RootState) => state.salaryComponents);

    const componentToEdit = useMemo(() => {
        if (!componentData || !componentId) return null;
        return Object.values(componentData).flatMap(group => group.components).find(c => c.id === componentId);
    }, [componentData, componentId]);

    const [formData, setFormData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (structureId && (!componentData || !componentToEdit)) {
            dispatch(fetchSalaryComponents(structureId));
        }
    }, [structureId, componentData, componentToEdit, dispatch]);
    
    useEffect(() => {
        if (componentToEdit) {
            setFormData({
                name: componentToEdit.name,
                code: componentToEdit.code,
                type: componentToEdit.type,
                showOnPayslip: componentToEdit.showOnPayslip,
                taxable: componentToEdit.otherSetting.taxable,
                isCtc: componentToEdit.otherSetting.CTC,
                leaveBased: componentToEdit.otherSetting.leaveBased,
                adjustmentBalanced: componentToEdit.otherSetting.adjustmentBalanced,
                calculationType: componentToEdit.calculationType,
                value: componentToEdit.value,
                testAmount: componentToEdit.testAmount,
            });
        }
    }, [componentToEdit]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const { checked } = e.target as HTMLInputElement;
        setFormData((prev: any) => ({ ...prev, [name]: isCheckbox ? checked : value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (componentId && formData) {
            setIsSubmitting(true);
            const payload: UpdateComponentPayload = {
                id: componentId,
                name: formData.name,
                code: formData.code,
                type: formData.type,
                showOnPayslip: formData.showOnPayslip,
                calculationType: formData.calculationType,
                value: formData.value,
                testAmount: formData.testAmount,
                otherSetting: {
                    taxable: formData.taxable,
                    leaveBased: formData.leaveBased,
                    CTC: formData.isCtc,
                    adjustmentBalanced: formData.adjustmentBalanced,
                }
            };
            try {
                await dispatch(updateSalaryComponent(payload)).unwrap();
                navigate(`/employee-salary-structures/${structureId}/components`);
            } catch (err) {
                console.error("Failed to update component:", err);
            } finally {
                setIsSubmitting(false);
            }
        }
    };
    
    const renderContent = () => {
        if (status === 'loading' || !formData) return <FormSkeleton />;
        if (status === 'failed') return <ErrorState onRetry={() => { if (structureId) dispatch(fetchSalaryComponents(structureId)) }} message={error} />;

        return (
             <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                        <input type="text" id="code" name="code" value={formData.code} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                        <select id="type" name="type" value={formData.type} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                            <option value="EARNING">Earning</option>
                            <option value="DEDUCTION">Deduction</option>
                            <option value="REIMBURSEMENT">Reimbursement</option>
                        </select>
                    </div>
                    <div className="flex items-center pt-2">
                        <input id="showOnPayslip" name="showOnPayslip" type="checkbox" checked={formData.showOnPayslip} onChange={handleInputChange} className="h-4 w-4 text-purple-600 rounded"/>
                        <label htmlFor="showOnPayslip" className="ml-2 font-medium">Show on payslip</label>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                        <h3 className="text-md font-semibold">Other Settings</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="flex items-center"><input id="taxable" name="taxable" type="checkbox" checked={formData.taxable} className="h-4 w-4 text-purple-600 rounded" disabled /><label htmlFor="taxable" className="ml-2 text-gray-500">Taxable</label></div>
                           <div className="flex items-center"><input id="isCtc" name="isCtc" type="checkbox" checked={formData.isCtc} className="h-4 w-4 text-purple-600 rounded" disabled /><label htmlFor="isCtc" className="ml-2 text-gray-500">Part of CTC</label></div>
                           <div className="flex items-center"><input id="leaveBased" name="leaveBased" type="checkbox" checked={formData.leaveBased} className="h-4 w-4 text-purple-600 rounded" disabled /><label htmlFor="leaveBased" className="ml-2 text-gray-500">Leave Based</label></div>
                           <div className="flex items-center"><input id="adjustmentBalanced" name="adjustmentBalanced" type="checkbox" checked={formData.adjustmentBalanced} className="h-4 w-4 text-purple-600 rounded" disabled /><label htmlFor="adjustmentBalanced" className="ml-2 text-gray-500">Adjust Balance</label></div>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-md font-semibold">Calculation</h3>
                        <select id="calculationType" name="calculationType" value={formData.calculationType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                            <option value="fixed">Fixed</option>
                            <option value="formula">Formula</option>
                        </select>
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
                        <button type="submit" disabled={isSubmitting} className="px-8 py-2 bg-purple-600 text-white rounded-md flex items-center disabled:bg-purple-400">
                             {isSubmitting && <RefreshCw className="animate-spin mr-2" size={16} />}
                            UPDATE
                        </button>
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
        );
    };

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6">
            <header className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Salary Component</h1>
                <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
                    <Link to="/employee-salary-structures" className="hover:text-gray-700">Salary Structures</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <Link to={`/employee-salary-structures/${structureId}/components`} className="hover:text-gray-700">Components</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="font-medium text-gray-800">Edit</span>
                </nav>
            </header>
            {renderContent()}
        </div>
    );
};

export default EditSalaryComponentPage;

