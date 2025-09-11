// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';
// import { useSelector, useDispatch } from 'react-redux';
// import type { AppDispatch, RootState } from '../../../store/store';
// import { fetchPayrollConfig, updatePayrollConfig, type PayrollConfig } from '../../../store/slice/payrollConfigSlice';
// import toast from 'react-hot-toast';

// const PayrollConfigurationPage: React.FC = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();
//     const { data: configData, status, error } = useSelector((state: RootState) => state.payrollConfig);
    
    
//     const [formData, setFormData] = useState<PayrollConfig | null>(null);

//     useEffect(() => {
      
//         if (status === 'idle') {
//             dispatch(fetchPayrollConfig());
//         }
       
//         if (status === 'succeeded' && configData) {
//             setFormData(configData);
//         }
//     }, [status, dispatch, configData]);

//     const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => (prev ? { ...prev, [name]: value } : null));
//     }, []);
    
//     const handleCancel = () => {
//         navigate('/getting-started');
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault();

//   if (formData) {
//     dispatch(updatePayrollConfig(formData));
//     toast.success('Payroll configuration updated successfully!');
//     navigate('/getting-started');
//   } else {
//     toast.error('Form data is missing.');
//   }
// };

//     if (status === 'loading' || !formData) {
//         return <div className="p-6 text-center">Loading Configuration...</div>;
//     }
    
//     if (status === 'failed') {
//         return <div className="p-6 text-center text-red-500">Error: {error}</div>;
//     }

//     return (
//         <div className="w-full bg-gray-50 p-4 sm:p-6">
//             <header className="mb-6 flex justify-between items-center">
//                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payroll Configuration</h1>
//                 <nav aria-label="Breadcrumb" className="hidden sm:flex items-center text-sm text-gray-500">
//                     <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
//                     <ChevronRight size={16} className="mx-1" />
//                     <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
//                     <ChevronRight size={16} className="mx-1" />
//                     <span className="font-medium text-gray-800">Payroll Configuration</span>
//                 </nav>
//             </header>

//             <main className="max-w-4xl mx-auto">
//                 <form className="bg-white p-8 rounded-lg shadow-md border space-y-8" onSubmit={handleSubmit}>
                    
                 
//                     <div className="space-y-4">
//                         <h3 className="text-md font-semibold text-gray-800">Amount Rounding Off</h3>
//                         <div className="space-y-3 text-sm">
//                            <div className="flex items-center"><input id="NEAREST_HALF_OR_ONE" name="amountRounding" type="radio" value="NEAREST_HALF_OR_ONE" checked={formData.amountRounding === 'NEAREST_HALF_OR_ONE'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="NEAREST_HALF_OR_ONE" className="ml-3 text-gray-700">Nearest Half or One</label></div>
//                            <div className="flex items-center"><input id="ROUND_UP" name="amountRounding" type="radio" value="ROUND_UP" checked={formData.amountRounding === 'ROUND_UP'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="ROUND_UP" className="ml-3 text-gray-700">Round Up</label></div>
//                            <div className="flex items-center"><input id="NEAREST_ONE" name="amountRounding" type="radio" value="NEAREST_ONE" checked={formData.amountRounding === 'NEAREST_ONE'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="NEAREST_ONE" className="ml-3 text-gray-700">Nearest One</label></div>
//                            <div className="flex items-center"><input id="ROUND_DOWN" name="amountRounding" type="radio" value="ROUND_DOWN" checked={formData.amountRounding === 'ROUND_DOWN'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="ROUND_DOWN" className="ml-3 text-gray-700">Round Down</label></div>
//                         </div>
//                     </div>
                    
                
//                     <div className="space-y-4">
//                         <h3 className="text-md font-semibold text-gray-800">Tax Calculation Mode</h3>
//                         <div className="space-y-3 text-sm">
//                            <div className="flex items-start"><input id="MONTHLY_FROM_JOIN_MONTH" name="taxCalculationMode" type="radio" value="MONTHLY_FROM_JOIN_MONTH" checked={formData.taxCalculationMode === 'MONTHLY_FROM_JOIN_MONTH'} onChange={handleInputChange} className="h-4 w-4 text-purple-600 mt-1" /><label htmlFor="MONTHLY_FROM_JOIN_MONTH" className="ml-3 text-gray-700">Monthly TDS According to Joining Date</label></div>
//                            <div className="flex items-start"><input id="MONTHLY_FROM_FIRST_PAYSLIP" name="taxCalculationMode" type="radio" value="MONTHLY_FROM_FIRST_PAYSLIP" checked={formData.taxCalculationMode === 'MONTHLY_FROM_FIRST_PAYSLIP'} onChange={handleInputChange} className="h-4 w-4 text-purple-600 mt-1" /><label htmlFor="MONTHLY_FROM_FIRST_PAYSLIP" className="ml-3 text-gray-700">Monthly TDS According to 1st Payslip for a Year</label></div>
//                            <div className="flex items-center"><input id="ALWAYS_AVG_FOR_12_MONTH" name="taxCalculationMode" type="radio" value="ALWAYS_AVG_FOR_12_MONTH" checked={formData.taxCalculationMode === 'ALWAYS_AVG_FOR_12_MONTH'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="ALWAYS_AVG_FOR_12_MONTH" className="ml-3 text-gray-700">Always Avg for 12 Month</label></div>
//                         </div>
//                     </div>

                  
//                     <div className="space-y-4">
//                         <h3 className="text-md font-semibold text-gray-800">Investment declaration</h3>
//                         <p className="text-sm text-gray-600">Employees will be able to update the declared investments (every month)</p>
//                         <div className="flex items-center gap-4">
//                             <div className="w-1/2">
//                                 <label htmlFor="investmentDeclarationFrom" className="block text-xs font-medium text-gray-700 mb-1">From Day</label>
//                                 <input type="number" min="1" max="31" id="investmentDeclarationFrom" name="investmentDeclarationFrom" value={formData.investmentDeclarationFrom} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
//                             </div>
//                             <div className="w-1/2">
//                                 <label htmlFor="investmentDeclarationTo" className="block text-xs font-medium text-gray-700 mb-1">To Day</label>
//                                 <input type="number" min="1" max="31" id="investmentDeclarationTo" name="investmentDeclarationTo" value={formData.investmentDeclarationTo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
//                             </div>
//                         </div>
//                         <p className="text-sm text-gray-600 pt-2">Employees will be able to attach POI (Every financial year)</p>
//                          <div className="flex items-center gap-4">
//                             <div className="w-1/2">
//                                 <label htmlFor="poiAttachmentFrom" className="block text-xs font-medium text-gray-700 mb-1">From</label>
//                                 <input type="date" id="poiAttachmentFrom" name="poiAttachmentFrom" value={formData.poiAttachmentFrom} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
//                             </div>
//                             <div className="w-1/2">
//                                 <label htmlFor="poiAttachmentTo" className="block text-xs font-medium text-gray-700 mb-1">To</label>
//                                 <input type="date" id="poiAttachmentTo" name="poiAttachmentTo" value={formData.poiAttachmentTo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex justify-start gap-4 pt-6">
//                         <button type="submit" className="px-10 py-2.5 bg-purple-600 text-white rounded-md">SUBMIT</button>
//                         <button type="button" onClick={handleCancel} className="px-10 py-2.5 border rounded-md">Cancel</button>
//                     </div>
//                 </form>
//             </main>
//         </div>
//     );
// };

// export default PayrollConfigurationPage;

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { z } from 'zod';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchPayrollConfig, updatePayrollConfig, type PayrollConfig } from '../../../store/slice/payrollConfigSlice';
import toast, { Toaster } from 'react-hot-toast';

const payrollConfigSchema = z.object({
  amountRounding: z.enum(['NEAREST_HALF_OR_ONE', 'ROUND_UP', 'NEAREST_ONE', 'ROUND_DOWN']),
  taxCalculationMode: z.enum(['MONTHLY_FROM_JOIN_MONTH', 'MONTHLY_FROM_FIRST_PAYSLIP', 'ALWAYS_AVG_FOR_12_MONTH']),
  daysInPayrollRun: z.enum(['CALENDAR_DAYS', 'FIXED_30_DAYS', 'FIXED_26_DAYS']),
  esicWagesMode: z.enum(['GROSS_EARNINGS', 'BASIC_ONLY']),
  investmentDeclarationFrom: z.number().int().min(1, 'Day must be at least 1.').max(31, 'Day cannot be more than 31.'),
  investmentDeclarationTo: z.number().int().min(1, 'Day must be at least 1.').max(31, 'Day cannot be more than 31.'),
  poiAttachmentFrom: z.string().min(1, 'From date is required.'),
  poiAttachmentTo: z.string().min(1, 'To date is required.'),
}).refine(data => data.investmentDeclarationFrom <= data.investmentDeclarationTo, {
    message: "'From Day' must be less than or equal to 'To Day'",
    path: ['investmentDeclarationTo'],
}).refine(data => {
    try {
        return new Date(data.poiAttachmentFrom) <= new Date(data.poiAttachmentTo);
    } catch { return false; }
}, {
    message: "'From' date cannot be after 'To' date",
    path: ['poiAttachmentTo'],
});

const PayrollConfigurationPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { data: configData, status, error } = useSelector((state: RootState) => state.payrollConfig);
    
    const [formData, setFormData] = useState<PayrollConfig | null>(null);
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchPayrollConfig());
        }
        if (status === 'succeeded' && configData) {
            setFormData(configData);
        }
    }, [status, dispatch, configData]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? (value === '' ? 0 : parseInt(value, 10)) : value;
        setFormData(prev => (prev ? { ...prev, [name]: finalValue } : null));
    }, []);
    
    const handleCancel = () => {
        navigate('/getting-started');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!formData) {
            toast.error('Form data is missing.');
            return;
        }

        const validationResult = payrollConfigSchema.safeParse(formData);

        if (!validationResult.success) {
            setErrors(validationResult.error.flatten().fieldErrors);
            toast.error('Please fix the errors in the form.');
            return;
        }

        setIsSubmitting(true);
        const promise = dispatch(updatePayrollConfig(validationResult.data)).unwrap();

        try {
            await toast.promise(promise, {
                loading: 'Updating configuration...',
                success: (result) => result.message || 'Configuration updated successfully!',
                error: (err) => err.message || 'Failed to update configuration.',
            });
            navigate('/getting-started');
        } catch (err) {
            // Error is handled by toast.promise
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading' || !formData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600">Loading Configuration...</p>
                    <div className="mt-4 w-16 h-16 border-4 border-purple-600 border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }
    
    if (status === 'failed') {
        return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6 min-h-screen">
            <Toaster position="top-center" />
            <header className="mb-6 flex justify-between items-center">
                 <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Payroll Configuration</h1>
                <nav aria-label="Breadcrumb" className="hidden sm:flex items-center text-sm text-gray-500">
                    <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
                    <ChevronRight size={16} className="mx-1" />
                    <span className="font-medium text-gray-800">Payroll Configuration</span>
                </nav>
            </header>

            <main className="max-w-4xl mx-auto">
                <form noValidate className="bg-white p-8 rounded-lg shadow-md border space-y-8" onSubmit={handleSubmit}>
                    
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Amount Rounding Off</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-center"><input id="NEAREST_HALF_OR_ONE" name="amountRounding" type="radio" value="NEAREST_HALF_OR_ONE" checked={formData.amountRounding === 'NEAREST_HALF_OR_ONE'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="NEAREST_HALF_OR_ONE" className="ml-3 text-gray-700">Nearest Half or One</label></div>
                           <div className="flex items-center"><input id="ROUND_UP" name="amountRounding" type="radio" value="ROUND_UP" checked={formData.amountRounding === 'ROUND_UP'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="ROUND_UP" className="ml-3 text-gray-700">Round Up</label></div>
                           <div className="flex items-center"><input id="NEAREST_ONE" name="amountRounding" type="radio" value="NEAREST_ONE" checked={formData.amountRounding === 'NEAREST_ONE'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="NEAREST_ONE" className="ml-3 text-gray-700">Nearest One</label></div>
                           <div className="flex items-center"><input id="ROUND_DOWN" name="amountRounding" type="radio" value="ROUND_DOWN" checked={formData.amountRounding === 'ROUND_DOWN'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="ROUND_DOWN" className="ml-3 text-gray-700">Round Down</label></div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Tax Calculation Mode</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-start"><input id="MONTHLY_FROM_JOIN_MONTH" name="taxCalculationMode" type="radio" value="MONTHLY_FROM_JOIN_MONTH" checked={formData.taxCalculationMode === 'MONTHLY_FROM_JOIN_MONTH'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600 mt-1" /><label htmlFor="MONTHLY_FROM_JOIN_MONTH" className="ml-3 text-gray-700">Monthly TDS According to Joining Date</label></div>
                           <div className="flex items-start"><input id="MONTHLY_FROM_FIRST_PAYSLIP" name="taxCalculationMode" type="radio" value="MONTHLY_FROM_FIRST_PAYSLIP" checked={formData.taxCalculationMode === 'MONTHLY_FROM_FIRST_PAYSLIP'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600 mt-1" /><label htmlFor="MONTHLY_FROM_FIRST_PAYSLIP" className="ml-3 text-gray-700">Monthly TDS According to 1st Payslip for a Year</label></div>
                           <div className="flex items-center"><input id="ALWAYS_AVG_FOR_12_MONTH" name="taxCalculationMode" type="radio" value="ALWAYS_AVG_FOR_12_MONTH" checked={formData.taxCalculationMode === 'ALWAYS_AVG_FOR_12_MONTH'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="ALWAYS_AVG_FOR_12_MONTH" className="ml-3 text-gray-700">Always Avg for 12 Month</label></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Days in Payroll Run</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-center"><input id="CALENDAR_DAYS" name="daysInPayrollRun" type="radio" value="CALENDAR_DAYS" checked={formData.daysInPayrollRun === 'CALENDAR_DAYS'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="CALENDAR_DAYS" className="ml-3 text-gray-700">Calendar Days</label></div>
                           <div className="flex items-center"><input id="FIXED_30_DAYS" name="daysInPayrollRun" type="radio" value="FIXED_30_DAYS" checked={formData.daysInPayrollRun === 'FIXED_30_DAYS'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="FIXED_30_DAYS" className="ml-3 text-gray-700">Fixed 30 Days</label></div>
                           <div className="flex items-center"><input id="FIXED_26_DAYS" name="daysInPayrollRun" type="radio" value="FIXED_26_DAYS" checked={formData.daysInPayrollRun === 'FIXED_26_DAYS'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="FIXED_26_DAYS" className="ml-3 text-gray-700">Fixed 26 Days</label></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">ESIC Wages Mode</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-center"><input id="GROSS_EARNINGS" name="esicWagesMode" type="radio" value="GROSS_EARNINGS" checked={formData.esicWagesMode === 'GROSS_EARNINGS'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="GROSS_EARNINGS" className="ml-3 text-gray-700">Gross Earnings</label></div>
                           <div className="flex items-center"><input id="BASIC_ONLY" name="esicWagesMode" type="radio" value="BASIC_ONLY" checked={formData.esicWagesMode === 'BASIC_ONLY'} onChange={handleInputChange} disabled={isSubmitting} className="h-4 w-4 text-purple-600" /><label htmlFor="BASIC_ONLY" className="ml-3 text-gray-700">Basic Only</label></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Investment declaration</h3>
                        <p className="text-sm text-gray-600">Employees will be able to update the declared investments (every month)</p>
                        <div className="flex items-start gap-4">
                            <div className="w-1/2">
                                <label htmlFor="investmentDeclarationFrom" className="block text-xs font-medium text-gray-700 mb-1">From Day</label>
                                <input type="number" min="1" max="31" id="investmentDeclarationFrom" name="investmentDeclarationFrom" value={formData.investmentDeclarationFrom || ''} onChange={handleInputChange} disabled={isSubmitting} className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
                                {errors.investmentDeclarationFrom && <p className="text-xs text-red-500 mt-1">{errors.investmentDeclarationFrom[0]}</p>}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="investmentDeclarationTo" className="block text-xs font-medium text-gray-700 mb-1">To Day</label>
                                <input type="number" min="1" max="31" id="investmentDeclarationTo" name="investmentDeclarationTo" value={formData.investmentDeclarationTo || ''} onChange={handleInputChange} disabled={isSubmitting} className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100" />
                                {errors.investmentDeclarationTo && <p className="text-xs text-red-500 mt-1">{errors.investmentDeclarationTo[0]}</p>}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 pt-2">Employees will be able to attach POI (Every financial year)</p>
                         <div className="flex items-start gap-4">
                            <div className="w-1/2">
                                <label htmlFor="poiAttachmentFrom" className="block text-xs font-medium text-gray-700 mb-1">From</label>
                                <input type="date" id="poiAttachmentFrom" name="poiAttachmentFrom" value={formData.poiAttachmentFrom} onChange={handleInputChange} disabled={isSubmitting} className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"/>
                                {errors.poiAttachmentFrom && <p className="text-xs text-red-500 mt-1">{errors.poiAttachmentFrom[0]}</p>}
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="poiAttachmentTo" className="block text-xs font-medium text-gray-700 mb-1">To</label>
                                <input type="date" id="poiAttachmentTo" name="poiAttachmentTo" value={formData.poiAttachmentTo} onChange={handleInputChange} disabled={isSubmitting} className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"/>
                                {errors.poiAttachmentTo && <p className="text-xs text-red-500 mt-1">{errors.poiAttachmentTo[0]}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start gap-4 pt-6 border-t">
                        <button type="submit" disabled={isSubmitting} className="px-10 py-2.5 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : 'SUBMIT'}</button>
                        <button type="button" onClick={handleCancel} disabled={isSubmitting} className="px-10 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default PayrollConfigurationPage;