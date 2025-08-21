import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// --- TYPE DEFINITION for the form state ---
interface PayrollConfigData {
    amountRounding: string;
    taxCalculationMode: string;
    daysInPayrollRun: string;
    esicWagesMode: string;
    investmentDeclarationFrom: string;
    investmentDeclarationTo: string;
    poiAttachmentFrom: string;
    poiAttachmentTo: string;
}

// --- MAIN PAYROLL CONFIGURATION PAGE COMPONENT ---
const PayrollConfigurationPage: React.FC = () => {
    const navigate = useNavigate();
    
    // --- Initial state for the configuration form ---
    const [configData, setConfigData] = useState<PayrollConfigData>({
        amountRounding: 'nearest_half_or_one',
        taxCalculationMode: 'monthly_tds_1st_payslip',
        daysInPayrollRun: 'actual_days',
        esicWagesMode: 'on_ctc',
        investmentDeclarationFrom: '1st',
        investmentDeclarationTo: '15th',
        poiAttachmentFrom: '2024-11-20', // Changed to YYYY-MM-DD format
        poiAttachmentTo: '2025-01-25',   // Changed to YYYY-MM-DD format
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConfigData({ ...configData, [name]: value });
    };
    
    const handleCancel = () => {
        navigate('/getting-started'); // Navigate back to the previous page
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // --- Replace this with your actual submission logic ---
        console.log("Submitting Payroll Configuration:", configData);
        // For example: callAPISave('/api/payroll-config', configData);
        navigate('/getting-started');
    };

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6">
            {/* Page Header */}
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

            {/* Main Content */}
            <main className="max-w-4xl mx-auto">
                <form className="bg-white p-8 rounded-lg shadow-md border space-y-8" onSubmit={handleSubmit}>
                    
                    {/* Amount Rounding Off */}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Amount Rounding Off</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-center"><input id="round_nearest_half" name="amountRounding" type="radio" value="nearest_half_or_one" checked={configData.amountRounding === 'nearest_half_or_one'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="round_nearest_half" className="ml-3 text-gray-700">Nearest Half or One (Ex. 1.57 = 1.50, 1.85 = 2.00, 1.26 = 1.50, 1.15 = 1.00)</label></div>
                           <div className="flex items-center"><input id="round_up" name="amountRounding" type="radio" value="round_up" checked={configData.amountRounding === 'round_up'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="round_up" className="ml-3 text-gray-700">Round Up (Ex. 1.57 = 2.00, 1.85 = 2.00, 1.26 = 2.00, 1.15 = 2.00)</label></div>
                           <div className="flex items-center"><input id="round_nearest_one" name="amountRounding" type="radio" value="nearest_one" checked={configData.amountRounding === 'nearest_one'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="round_nearest_one" className="ml-3 text-gray-700">Nearest One (Ex. 1.57 = 2.00, 1.85 = 2.00, 1.26 = 1.00, 1.15 = 1.00)</label></div>
                           <div className="flex items-center"><input id="round_down" name="amountRounding" type="radio" value="round_down" checked={configData.amountRounding === 'round_down'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="round_down" className="ml-3 text-gray-700">Round Down (Ex. 1.57 = 1.00, 1.85 = 1.00, 1.26 = 1.00, 1.15 = 1.00)</label></div>
                        </div>
                    </div>
                    
                    {/* Tax Calculation Mode */}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Tax Calculation Mode</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-start"><input id="tax_monthly_joining" name="taxCalculationMode" type="radio" value="monthly_tds_joining" checked={configData.taxCalculationMode === 'monthly_tds_joining'} onChange={handleInputChange} className="h-4 w-4 text-purple-600 mt-1" /><label htmlFor="tax_monthly_joining" className="ml-3 text-gray-700">Monthly TDS According to Joining Date of employee (Ex. If employee Joined in middle of year then Avg Monthly TDS will be according to Joining Month)(If Employee joined in current Financial Year)</label></div>
                           <div className="flex items-start"><input id="tax_monthly_1st_payslip" name="taxCalculationMode" type="radio" value="monthly_tds_1st_payslip" checked={configData.taxCalculationMode === 'monthly_tds_1st_payslip'} onChange={handleInputChange} className="h-4 w-4 text-purple-600 mt-1" /><label htmlFor="tax_monthly_1st_payslip" className="ml-3 text-gray-700">Monthly TDS According to 1st Payslip for a Year (Ex. First Payslip generated on June then Monthly TDS will be average of 10 Months)</label></div>
                           <div className="flex items-center"><input id="tax_always_12" name="taxCalculationMode" type="radio" value="always_12" checked={configData.taxCalculationMode === 'always_12'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="tax_always_12" className="ml-3 text-gray-700">Always Avg for 12 Month</label></div>
                        </div>
                    </div>

                    {/* Days In Payroll Run */}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Days In Payroll Run</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-center"><input id="days_actual" name="daysInPayrollRun" type="radio" value="actual_days" checked={configData.daysInPayrollRun === 'actual_days'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="days_actual" className="ml-3 text-gray-700">Actual Days in Month (Ex. Jan=31,Feb=28,Mar=31)</label></div>
                           <div className="flex items-center"><input id="days_30" name="daysInPayrollRun" type="radio" value="30_days" checked={configData.daysInPayrollRun === '30_days'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="days_30" className="ml-3 text-gray-700">30 Days in all Months Every Month Salary will calculate as 30 Days only</label></div>
                           <div className="flex items-center"><input id="days_31" name="daysInPayrollRun" type="radio" value="31_days" checked={configData.daysInPayrollRun === '31_days'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="days_31" className="ml-3 text-gray-700">31 Days in all Months Every Month Salary will calculate as 31 Days only</label></div>
                        </div>
                    </div>

                    {/* ESIC Total Wages Mode */}
                     <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">ESIC Total Wages Mode</h3>
                        <div className="space-y-3 text-sm">
                           <div className="flex items-center"><input id="esic_ctc" name="esicWagesMode" type="radio" value="on_ctc" checked={configData.esicWagesMode === 'on_ctc'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="esic_ctc" className="ml-3 text-gray-700">On CTC</label></div>
                           <div className="flex items-center"><input id="esic_gross" name="esicWagesMode" type="radio" value="on_gross" checked={configData.esicWagesMode === 'on_gross'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="esic_gross" className="ml-3 text-gray-700">On Gross Earning</label></div>
                           <div className="flex items-center"><input id="esic_net" name="esicWagesMode" type="radio" value="on_net" checked={configData.esicWagesMode === 'on_net'} onChange={handleInputChange} className="h-4 w-4 text-purple-600" /><label htmlFor="esic_net" className="ml-3 text-gray-700">On Net Earning</label></div>
                        </div>
                    </div>

                    {/* Investment declaration */}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-800">Investment declaration</h3>
                        <p className="text-sm text-gray-600">Employees will be able to update the declared investments (every month)</p>
                        <div className="flex items-center gap-4">
                            <div className="w-1/2">
                                <label htmlFor="investmentDeclarationFrom" className="block text-xs font-medium text-gray-700 mb-1">From</label>
                                <select id="investmentDeclarationFrom" name="investmentDeclarationFrom" value={configData.investmentDeclarationFrom} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => <option key={day} value={`${day}${['st', 'nd', 'rd'][day-1] || 'th'}`}>{`${day}${['st', 'nd', 'rd'][day-1] || 'th'}`}</option>)}
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="investmentDeclarationTo" className="block text-xs font-medium text-gray-700 mb-1">To</label>
                                <select id="investmentDeclarationTo" name="investmentDeclarationTo" value={configData.investmentDeclarationTo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => <option key={day} value={`${day}${['st', 'nd', 'rd'][day-1] || 'th'}`}>{`${day}${['st', 'nd', 'rd'][day-1] || 'th'}`}</option>)}
                                </select>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">Employees will be able to attach POI (Every financial year)</p>
                         <div className="flex items-center gap-4">
                            <div className="w-1/2">
                                <label htmlFor="poiAttachmentFrom" className="block text-xs font-medium text-gray-700 mb-1">From</label>
                                <input type="date" id="poiAttachmentFrom" name="poiAttachmentFrom" value={configData.poiAttachmentFrom} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="poiAttachmentTo" className="block text-xs font-medium text-gray-700 mb-1">To</label>
                                <input type="date" id="poiAttachmentTo" name="poiAttachmentTo" value={configData.poiAttachmentTo} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-start gap-4 pt-6">
                        <button type="submit" className="px-10 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">SUBMIT</button>
                        <button type="button" onClick={handleCancel} className="px-10 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default PayrollConfigurationPage;
