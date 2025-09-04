import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { fetchPayrollConfig, updatePayrollConfig, type PayrollConfig } from '../../../store/slice/payrollConfigSlice';
import toast from 'react-hot-toast';

const PayrollConfigurationPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { data: configData, status, error } = useSelector((state: RootState) => state.payrollConfig);
    
    
    const [formData, setFormData] = useState<PayrollConfig | null>(null);

    useEffect(() => {
      
        if (status === 'idle') {
            dispatch(fetchPayrollConfig());
        }
       
        if (status === 'succeeded' && configData) {
            setFormData(configData);
        }
    }, [status, dispatch, configData]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => (prev ? { ...prev, [name]: value } : null));
    }, []);
    
    const handleCancel = () => {
        navigate('/getting-started');
    };

    const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (formData) {
    dispatch(updatePayrollConfig(formData));
    toast.success('Payroll configuration updated successfully!');
    navigate('/getting-started');
  } else {
    toast.error('Form data is missing.');
  }
};

    if (status === 'loading' || !formData) {
        return <div className="p-6 text-center">Loading Configuration...</div>;
    }
    
    if (status === 'failed') {
        return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6">
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
                <form className="bg-white p-8 rounded-lg shadow-md border space-y-8" onSubmit={handleSubmit}>
                    
                 
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Amount Rounding Off</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-center"><input id="NEAREST_HALF_OR_ONE" name="amountRounding" type="radio" value="NEAREST_HALF_OR_ONE" checked={formData.amountRounding === 'NEAREST_HALF_OR_ONE'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="NEAREST_HALF_OR_ONE" className="ml-3 text-gray-700">Nearest Half or One</label></div>
                           <div className="flex items-center"><input id="ROUND_UP" name="amountRounding" type="radio" value="ROUND_UP" checked={formData.amountRounding === 'ROUND_UP'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="ROUND_UP" className="ml-3 text-gray-700">Round Up</label></div>
                           <div className="flex items-center"><input id="NEAREST_ONE" name="amountRounding" type="radio" value="NEAREST_ONE" checked={formData.amountRounding === 'NEAREST_ONE'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="NEAREST_ONE" className="ml-3 text-gray-700">Nearest One</label></div>
                           <div className="flex items-center"><input id="ROUND_DOWN" name="amountRounding" type="radio" value="ROUND_DOWN" checked={formData.amountRounding === 'ROUND_DOWN'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="ROUND_DOWN" className="ml-3 text-gray-700">Round Down</label></div>
                        </div>
                    </div>
                    
                
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Tax Calculation Mode</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-start"><input id="MONTHLY_FROM_JOIN_MONTH" name="taxCalculationMode" type="radio" value="MONTHLY_FROM_JOIN_MONTH" checked={formData.taxCalculationMode === 'MONTHLY_FROM_JOIN_MONTH'} onChange={handleInputChange} className="h-4 w-4 text-purple-600 mt-1" /><label htmlFor="MONTHLY_FROM_JOIN_MONTH" className="ml-3 text-gray-700">Monthly TDS According to Joining Date</label></div>
                           <div className="flex items-start"><input id="MONTHLY_FROM_FIRST_PAYSLIP" name="taxCalculationMode" type="radio" value="MONTHLY_FROM_FIRST_PAYSLIP" checked={formData.taxCalculationMode === 'MONTHLY_FROM_FIRST_PAYSLIP'} onChange={handleInputChange} className="h-4 w-4 text-purple-600 mt-1" /><label htmlFor="MONTHLY_FROM_FIRST_PAYSLIP" className="ml-3 text-gray-700">Monthly TDS According to 1st Payslip for a Year</label></div>
                           <div className="flex items-center"><input id="ALWAYS_AVG_FOR_12_MONTH" name="taxCalculationMode" type="radio" value="ALWAYS_AVG_FOR_12_MONTH" checked={formData.taxCalculationMode === 'ALWAYS_AVG_FOR_12_MONTH'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="ALWAYS_AVG_FOR_12_MONTH" className="ml-3 text-gray-700">Always Avg for 12 Month</label></div>
                        </div>
                    </div>

                  
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Investment declaration</h3>
                        <p className="text-sm text-gray-600">Employees will be able to update the declared investments (every month)</p>
                        <div className="flex items-center gap-4">
                            <div className="w-1/2">
                                <label htmlFor="investmentDeclarationFrom" className="block text-xs font-medium text-gray-700 mb-1">From Day</label>
                                <input type="number" min="1" max="31" id="investmentDeclarationFrom" name="investmentDeclarationFrom" value={formData.investmentDeclarationFrom} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="investmentDeclarationTo" className="block text-xs font-medium text-gray-700 mb-1">To Day</label>
                                <input type="number" min="1" max="31" id="investmentDeclarationTo" name="investmentDeclarationTo" value={formData.investmentDeclarationTo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 pt-2">Employees will be able to attach POI (Every financial year)</p>
                         <div className="flex items-center gap-4">
                            <div className="w-1/2">
                                <label htmlFor="poiAttachmentFrom" className="block text-xs font-medium text-gray-700 mb-1">From</label>
                                <input type="date" id="poiAttachmentFrom" name="poiAttachmentFrom" value={formData.poiAttachmentFrom} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="poiAttachmentTo" className="block text-xs font-medium text-gray-700 mb-1">To</label>
                                <input type="date" id="poiAttachmentTo" name="poiAttachmentTo" value={formData.poiAttachmentTo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start gap-4 pt-6">
                        <button type="submit" className="px-10 py-2.5 bg-purple-600 text-white rounded-md">SUBMIT</button>
                        <button type="button" onClick={handleCancel} className="px-10 py-2.5 border rounded-md">Cancel</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default PayrollConfigurationPage;

