import React, { useState, useEffect, useCallback } from "react";
import { evaluateFormula } from "../../../../utils/formulaEvaluator";


interface SalaryComponentItem {
  id: string;
  name: string;
  code: string;
  formula: string;
  defaultSelected: boolean;
  selected: boolean; 
  grossAmount: number; 
  netPay: number; 
}

interface InitialSalaryData {
  employeeCode: string;
  employeeName: string;
  selectedMonth: string;
  selectedYear: string;
  monthlyCTC: number;
  earnings: SalaryComponentItem[];
  statutories: SalaryComponentItem[];
  otherEarnings: SalaryComponentItem[];
}


interface SalaryComponentProps {
  employeeCode: string;
  employeeName: string;
  selectedMonth: string;
  selectedYear: string;
  onClose: () => void; 
}

const SalaryComponent: React.FC<SalaryComponentProps> = ({
  employeeCode,
  employeeName,
  selectedMonth,
  selectedYear,
  onClose,
}) => {
  
  const [monthlyCTC, setMonthlyCTC] = useState<number | string>("");
  const [lossOfPayDays, setLossOfPayDays] = useState<number | string>(0);
  const [earnings, setEarnings] = useState<SalaryComponentItem[]>([]);
  const [statutories, setStatutories] = useState<SalaryComponentItem[]>([]);
  const [otherEarnings, setOtherEarnings] = useState<SalaryComponentItem[]>([]);

  
  const [totalGrossPay, setTotalGrossPay] = useState<number>(0);
  const [totalDeductions, setTotalDeductions] = useState<number>(0);
  const [netPayable, setNetPayable] = useState<number>(0);

  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchSalaryData = async () => {
      setIsLoading(true);
      setError(null);
      try {
       
        const mockData: InitialSalaryData = {
          employeeCode,
          employeeName,
          selectedMonth,
          selectedYear,
          monthlyCTC: 15148.0,
          earnings: [
            {
              id: "e1",
              name: "Basic",
              code: "BASIC",
              formula: "[CTC*50/100]",
              defaultSelected: true,
              selected: true,
              grossAmount: 0,
              netPay: 0,
            },
            {
              id: "e2",
              name: "Conveyance",
              code: "CONVEYANCE",
              formula: "0",
              defaultSelected: true,
              selected: true,
              grossAmount: 0,
              netPay: 0,
            },
            {
              id: "e3",
              name: "House Rent Allowance",
              code: "HRA",
              formula: "[BASIC*80/100]",
              defaultSelected: true,
              selected: true,
              grossAmount: 0,
              netPay: 0,
            },
          ],
          statutories: [
            {
              id: "s1",
              name: "Provident Fund",
              code: "PF",
              formula: "[BASIC*12/100]",
              defaultSelected: true,
              selected: true,
              grossAmount: 0,
              netPay: 0,
            },
            {
              id: "s2",
              name: "Professional Tax",
              code: "PT",
              formula: "0",
              defaultSelected: true,
              selected: true,
              grossAmount: 0,
              netPay: 0,
            },
          ],
          otherEarnings: [
            {
              id: "o1",
              name: "Leave encashment",
              code: "LEAVE_ENCASH",
              formula: "0",
              defaultSelected: true,
              selected: true,
              grossAmount: 0,
              netPay: 0,
            },
          ],
        };
        const data = mockData;
       

        setMonthlyCTC(data.monthlyCTC);
        setEarnings(
          data.earnings.map((e) => ({
            ...e,
            selected: e.defaultSelected,
            grossAmount: 0,
            netPay: 0,
          }))
        );
        setStatutories(
          data.statutories.map((s) => ({
            ...s,
            selected: s.defaultSelected,
            grossAmount: 0,
            netPay: 0,
          }))
        );
        setOtherEarnings(
          data.otherEarnings.map((o) => ({
            ...o,
            selected: o.defaultSelected,
            grossAmount: 0,
            netPay: 0,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch salary data:", err);
        setError("Failed to load salary data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalaryData();
  }, [employeeCode, employeeName, selectedMonth, selectedYear]);

  
  const calculatePayslip = useCallback(() => {
    let currentCTC = Number(monthlyCTC) || 0;
    const currentLossOfPayDays = Number(lossOfPayDays) || 0;
    const effectiveDaysInMonth = 30;
    const ctcPerDay = currentCTC / effectiveDaysInMonth;
    const adjustedCTC = currentCTC - ctcPerDay * currentLossOfPayDays;
    const calculatedVariables: { [key: string]: number } = { CTC: adjustedCTC };

    const processComponents = (comps: SalaryComponentItem[]) => {
      return comps.map((component) => {
        let gross = 0;
        if (component.selected) {
          gross = isNaN(Number(component.formula))
            ? evaluateFormula(component.formula, calculatedVariables)
            : Number(component.formula);
        }
        calculatedVariables[component.code] = gross;
        return { ...component, grossAmount: gross, netPay: gross };
      });
    };

    const earningsWithBasicFirst = [...earnings].sort((a) =>
      a.code === "BASIC" ? -1 : 1
    );
    const updatedEarnings = processComponents(earningsWithBasicFirst);
    const updatedStatutories = processComponents(statutories);
    const updatedOtherEarnings = processComponents(otherEarnings);

    setEarnings(updatedEarnings);
    setStatutories(updatedStatutories);
    setOtherEarnings(updatedOtherEarnings);

    const currentTotalGrossPay = [...updatedEarnings, ...updatedOtherEarnings]
      .filter((c) => c.selected)
      .reduce((sum, c) => sum + c.grossAmount, 0);

    const currentTotalDeductions = updatedStatutories
      .filter((c) => c.selected)
      .reduce((sum, c) => sum + c.grossAmount, 0);

    setTotalGrossPay(parseFloat(currentTotalGrossPay.toFixed(2)));
    setTotalDeductions(parseFloat(currentTotalDeductions.toFixed(2)));
    setNetPayable(
      parseFloat((currentTotalGrossPay - currentTotalDeductions).toFixed(2))
    );
  }, [monthlyCTC, lossOfPayDays, earnings, statutories, otherEarnings]);

  // Effect to trigger calculation
  useEffect(() => {
    if (!isLoading) {
      calculatePayslip();
    }
  }, [monthlyCTC, lossOfPayDays, isLoading, calculatePayslip]);

  
  const handleComponentCheckboxChange = (
    type: "earnings" | "statutories" | "otherEarnings",
    id: string,
    checked: boolean
  ) => {
    const setStateAction = {
      earnings: setEarnings,
      statutories: setStatutories,
      otherEarnings: setOtherEarnings,
    }[type];
    setStateAction((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: checked } : c))
    );
  };

  
  const handleComponentAmountChange = (
    type: "earnings" | "statutories" | "otherEarnings",
    id: string,
    value: string
  ) => {
    const updatedValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    const setStateAction = {
      earnings: setEarnings,
      statutories: setStatutories,
      otherEarnings: setOtherEarnings,
    }[type];
    setStateAction((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, grossAmount: updatedValue, netPay: updatedValue }
          : c
      )
    );
  };

  // --- API 2: Create Payslip (POST request) ---
  const handleCreatePayslip = async () => {
    /* ... existing payslip creation logic ... */
    alert("Payslip created successfully! (Mock response)");
    onClose();
  };

  // Helper render function for tables
  const renderTableSection = (
    title: string,
    components: SalaryComponentItem[],
    type: "earnings" | "statutories" | "otherEarnings"
  ) => (
    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
      <h3 className="bg-gray-100 text-gray-800 font-medium px-4 py-2 text-sm md:text-base">
        {title} ({components.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Table headers */}
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Select
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">
                Formula/Value
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                Gross Amount
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/12">
                Net Pay
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {components.map((comp) => (
              <tr key={comp.id}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                  <input
                    type="checkbox"
                    checked={comp.selected}
                    onChange={(e) =>
                      handleComponentCheckboxChange(
                        type,
                        comp.id,
                        e.target.checked
                      )
                    }
                    className="form-checkbox h-4 w-4 text-[#741CDD] rounded focus:ring-[#741CDD] border-gray-300"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {comp.name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {comp.formula === "0" ? "-" : comp.formula}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    value={comp.grossAmount.toFixed(2)}
                    onChange={(e) =>
                      handleComponentAmountChange(type, comp.id, e.target.value)
                    }
                    className="w-24 border border-gray-300 rounded-md px-2 py-1 text-right text-xs focus:outline-none focus:ring-1 focus:ring-[#741CDD]"
                    step="0.01"
                  />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {comp.netPay.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">
        Salary Distribution for {employeeName} ({employeeCode}) -{" "}
        {selectedMonth} {selectedYear}
      </h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label
                htmlFor="monthlyCTC"
                className="block text-sm font-medium text-gray-700"
              >
                Monthly CTC
              </label>
              <input
                type="number"
                id="monthlyCTC"
                value={monthlyCTC}
                onChange={(e) => setMonthlyCTC(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#741CDD] focus:border-[#741CDD] sm:text-sm"
                step="0.01"
              />
            </div>
            <div>
              <label
                htmlFor="lossOfPayDays"
                className="block text-sm font-medium text-gray-700"
              >
                Loss Of Pay Days
              </label>
              <input
                type="number"
                id="lossOfPayDays"
                value={lossOfPayDays}
                onChange={(e) => setLossOfPayDays(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#741CDD] focus:border-[#741CDD] sm:text-sm"
                step="0.01"
              />
            </div>
            <div className="md:col-span-1 flex items-end justify-end gap-3">
              <button
                onClick={calculatePayslip}
                className="bg-[#741CDD] hover:bg-[#6117b8] text-white px-4 py-2 text-sm rounded transition duration-200"
              >
                CALCULATE
              </button>
              <button
                onClick={handleCreatePayslip}
                className="bg-[#741CDD] hover:bg-[#6117b8] text-white px-4 py-2 text-sm rounded transition duration-200"
                disabled={isLoading}
              >
                CREATE PAYSLIP
              </button>
              <button
                onClick={onClose}
                className="border border-gray-300 text-gray-700 px-4 py-2 text-sm rounded transition duration-200 hover:bg-gray-100"
              >
                CLOSE
              </button>
            </div>
          </div>

          <div
            className="bg-[#EAE5F9] border-l-4 border-[#741CDD] text-[#741CDD] p-4 mb-6"
            role="alert"
          >
            <p className="font-semibold">Salary Distribution</p>
            <ul className="list-disc list-inside text-sm ml-4">
              <li>Use "Calculate" Button To Calculate Draft Salary.</li>
              <li>
                Use "Create Payslip" Button To Process Payslip For Employee.
              </li>
              <li>
                <a href="#" className="text-[#741CDD] hover:underline">
                  Your Leave Balance Is ?
                </a>
              </li>
            </ul>
          </div>

          {renderTableSection("Earnings", earnings, "earnings")}
          {renderTableSection("Statutories", statutories, "statutories")}
          {renderTableSection("Other earnings", otherEarnings, "otherEarnings")}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-medium">
            <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
              <span>Total Gross Pay:</span>
              <span>₹{totalGrossPay.toFixed(2)}</span>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
              <span>Total Deductions:</span>
              <span>₹{totalDeductions.toFixed(2)}</span>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg flex justify-between">
              <span>Net Payable:</span>
              <span>₹{netPayable.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SalaryComponent;
