import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronRight, ServerCrash } from 'lucide-react';
// NEW: Import useParams to read the URL
import { Link, useParams } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
interface ComponentItem {
  id: string;
  name: string;
  amount: number;
}

// NEW: Create a more detailed data structure for individual salary structures
interface SalaryStructureDetails {
  id: string;
  groupName: string;
  earnings: ComponentItem[];
  deductions: ComponentItem[];
  totalCTC: number;
}

// --- EXPANDED MOCK DATA (Simulating a database) ---
const allStructuresData: SalaryStructureDetails[] = [
  {
    id: '1',
    groupName: 'Default',
    earnings: [
      { id: 'e1', name: 'Basic', amount: 25000 },
      { id: 'e2', name: 'House Rent Allowance', amount: 10000 },
      { id: 'e3', name: 'Fixed Allowance', amount: 15000 },
    ],
    deductions: [
      { id: 'd1', name: 'Employee Provident Fund', amount: 1800 },
      { id: 'd2', name: 'Professional Tax', amount: 200 },
    ],
    totalCTC: 50000,
  },
  {
    id: '2',
    groupName: 'Employee',
    earnings: [
        { id: 'e4', name: 'Basic', amount: 40000 },
        { id: 'e5', name: 'House Rent Allowance', amount: 20000 },
        { id: 'e6', name: 'Performance Bonus', amount: 10000 },
    ],
    deductions: [
        { id: 'd3', name: 'Employee Provident Fund', amount: 3600 },
        { id: 'd4', name: 'Professional Tax', amount: 200 },
        { id: 'd5', name: 'Health Insurance Premium', amount: 1200 },
    ],
    totalCTC: 70000,
  },
  // ... add other structures as needed
];

// --- SIMULATED API CALL ---
const fetchStructureById = (id: string): Promise<SalaryStructureDetails> => {
    console.log(`Fetching data for ID: ${id}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const structure = allStructuresData.find(s => s.id === id);
            if (structure) {
                resolve(structure);
            } else {
                reject(new Error('Salary structure not found.'));
            }
        }, 500); // Simulate network delay
    });
};


// --- Reusable Accordion Section Component (No changes needed here) ---
const AccordionSection: React.FC<{
  title: string;
  count: number;
  children: React.ReactNode;
}> = ({ title, count, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-gray-50 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700"
      >
        <span>{`${title} (${count})`}</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

// NEW: A small component to render each row consistently
const ComponentRow: React.FC<{ item: ComponentItem }> = ({ item }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-gray-800">{item.name}</span>
        <span className="font-medium text-gray-900">₹{item.amount.toLocaleString('en-IN')}</span>
    </div>
);

// --- MAIN PAGE COMPONENT (Updated) ---
const SalaryComponentPage: React.FC = () => {
  // STEP 1: Get the structure ID from the URL
  const { structureId } = useParams<{ structureId: string }>();

  // STEP 2: Set up state to hold the dynamic data, loading, and error status
  const [structure, setStructure] = useState<SalaryStructureDetails | null>(null);
  const [status, setStatus] = useState<'loading' | 'succeeded' | 'failed'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // STEP 2 (continued): Fetch data when the component mounts or ID changes
  useEffect(() => {
    if (!structureId) return;
    
    setStatus('loading');
    fetchStructureById(structureId)
      .then(data => {
        setStructure(data);
        setTotalAmount(data.totalCTC); // Initialize total amount from fetched data
        setStatus('succeeded');
      })
      .catch((err: Error) => {
        setError(err.message);
        setStatus('failed');
      });
  }, [structureId]);

  // --- Render logic based on the status ---
  if (status === 'loading') {
    return <div className="text-center p-10">Loading component details...</div>;
  }

  if (status === 'failed') {
    return (
        <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
            <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Data</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
    );
  }

  if (!structure) {
    return null; // Should not happen if status is 'succeeded', but good for safety
  }


  // STEP 3: Render the dynamic data
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      {/* Page Header (Now dynamic) */}
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            {/* UPDATED: Title now uses the groupName from the fetched data */}
            <h1 className="text-2xl font-bold text-gray-900">
                Salary Component (Group: {structure.groupName})
            </h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
              <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
              <ChevronRight size={16} className="mx-1" />
              <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
              <ChevronRight size={16} className="mx-1" />
              <Link to="/payslip-components" className="hover:text-gray-700">Payslip components</Link>
              <ChevronRight size={16} className="mx-1" />
              <Link to="/employee-salary-structures" className="hover:text-gray-700">Employee Salary Structures</Link>
              <ChevronRight size={16} className="mx-1" />
              <span className="font-medium text-gray-800">Edit component</span>
            </nav>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
          </button>
        </div>
      </header>

      {/* Main Content Area (Now dynamic) */}
      <main className="space-y-6">
        {/* UPDATED: Accordion now shows real data */}
        <AccordionSection title="EARNINGS" count={structure.earnings.length}>
          <div className="space-y-2">
            {structure.earnings.map(item => <ComponentRow key={item.id} item={item} />)}
          </div>
        </AccordionSection>

        <AccordionSection title="DEDUCTIONS" count={structure.deductions.length}>
            <div className="space-y-2">
                {structure.deductions.map(item => <ComponentRow key={item.id} item={item} />)}
            </div>
        </AccordionSection>

        {/* Total Amount Section */}
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-800 mb-2">
                Note: This amount is used for testing CTC calculations. You can edit the amount and click "Validate" to see how it affects the components.
            </p>
            <div className="flex justify-between items-center">
                <p className="text-md font-bold text-gray-900">Total: {totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(Number(e.target.value))}
                        className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    <button className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">
                        Validate
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default SalaryComponentPage;