import React, { useState, useRef, useEffect, } from 'react';
import { Plus, ChevronDown, ChevronRight, MoreHorizontal, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AlertModal from '../../../components/Modal/AlertModal';

// --- TYPE DEFINITIONS ---
interface ComponentSetting {
  label: string;
  enabled: boolean;
}

interface ComponentItem {
  id: string;
  name: string;
  type: string;
  settings: ComponentSetting[];
  valueOrFormula: string;
  testAmount: number;
}

// --- MOCK DATA ---
const earningsData: ComponentItem[] = [
  { id: 'e1', name: 'Basic', type: 'Earnings', settings: [{label: 'Taxable', enabled: true}, {label: 'Leave Based', enabled: false}, {label: 'Is CTC', enabled: true}, {label: 'Adjustment Relevent', enabled: false}], valueOrFormula: '[CTC]*50/100', testAmount: 25000 },
  { id: 'e2', name: 'House Rent Allowance(HRA)', type: 'Earnings', settings: [{label: 'Taxable', enabled: true}, {label: 'Leave Based', enabled: false}, {label: 'Is CTC', enabled: true}, {label: 'Adjustment Relevent', enabled: false}], valueOrFormula: '[BASIC]*50/100', testAmount: 20000 },
];

const staturiesData: ComponentItem[] = [
  { id: 's1', name: 'Provident Fund(PF)', type: 'Deductions', settings: [{label: 'Taxable', enabled: false}, {label: 'Leave Based', enabled: false}, {label: 'Is CTC', enabled: true}, {label: 'Adjustment Relevent', enabled: false}], valueOrFormula: '[BASIC]*12/100', testAmount: 10000 },
];

const otherEarningsData: ComponentItem[] = [
    { id: 'o1', name: 'Leave Encashment(LE)', type: 'Earnings', settings: [{label: 'Taxable', enabled: true}, {label: 'Leave Based', enabled: true}, {label: 'Is CTC', enabled: false}, {label: 'Adjustment Relevent', enabled: false}], valueOrFormula: '21000', testAmount: 2000 },
];

const reimbursementData: ComponentItem[] = [
    { id: 'r1', name: 'Reimbursement', type: 'Reimbursement', settings: [{label: 'Taxable', enabled: true}, {label: 'Leave Based', enabled: true}, {label: 'Is CTC', enabled: false}, {label: 'Adjustment Relevent', enabled: false}], valueOrFormula: '21000', testAmount: 2000 },
];

// --- Reusable Component Row ---
const ComponentRow: React.FC<{ 
  item: ComponentItem;
  groupName: string | undefined;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  onDelete: () => void;
}> = ({ item, groupName, isDropdownOpen, onToggleDropdown, onDelete }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center py-3 px-4 border-b last:border-b-0">
            <div>
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">{item.type}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                {item.settings.map(setting => (
                    <div key={setting.label} className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${setting.enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-gray-600">{setting.label}</span>
                    </div>
                ))}
            </div>
            <span className="text-sm text-gray-700 font-mono">{item.valueOrFormula}</span>
            <span className="text-sm font-semibold text-gray-800">₹ {item.testAmount.toLocaleString()}</span>
            <div className="relative text-right">
                <button 
                    onClick={onToggleDropdown}
                    className="p-2 rounded-full hover:bg-gray-200"
                >
                    <MoreHorizontal size={20} />
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl z-20">
                        <Link to={`/salary-group/${groupName}/edit-component/${item.id}`} className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">Edit</Link>
                        <button onClick={onDelete} className="block w-full text-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 rounded-b-lg">Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Reusable Accordion Section Component ---
const AccordionSection: React.FC<{
  title: string;
  count: number;
  items: ComponentItem[];
  groupName: string | undefined;
  activeDropdown: string | null;
  onToggleDropdown: (id: string) => void;
  onDelete: (item: ComponentItem) => void;
}> = ({ title, count, items, groupName, activeDropdown, onToggleDropdown, onDelete }) => {
  const [isOpen, setIsOpen] = useState(true); // Set to true to be open by default

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 bg-gray-50 rounded-t-lg"
      >
        <span>{`${title} (${count})`}</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>
      {isOpen && (
        <div className="border-t border-gray-200">
            <div className="grid grid-cols-5 gap-4 py-2 px-4 bg-gray-100 text-xs font-semibold text-gray-500 uppercase">
                <span>Name</span>
                <span>Other Settings</span>
                <span>Value/Formula</span>
                <span>Test Amnt.</span>
                <span className="text-right">Action</span>
            </div>
            {items.map(item => (
                <ComponentRow 
                    key={item.id} 
                    item={item}
                    groupName={groupName}
                    isDropdownOpen={activeDropdown === item.id}
                    onToggleDropdown={() => onToggleDropdown(item.id)}
                    onDelete={() => onDelete(item)}
                />
            ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const SalaryComponentPage: React.FC = () => {
  const { groupName } = useParams<{ groupName: string }>();
  const [totalAmount, setTotalAmount] = useState(50000);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState<ComponentItem | null>(null);

  const handleToggleDropdown = (id: string) => {
      setActiveDropdown(prevId => (prevId === id ? null : id));
  };

  const handleDeleteClick = (item: ComponentItem) => {
    setComponentToDelete(item);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setComponentToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (componentToDelete) {
        console.log("Deleting component:", componentToDelete.name);
        handleCloseModal();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (pageRef.current && !pageRef.current.contains(event.target as Node)) {
            setActiveDropdown(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="w-full bg-gray-50 p-6" ref={pageRef}>
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
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
          </div>
          <Link to={`/salary-group/${groupName}/add-component`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
          </Link>
        </div>
      </header>

      <main className="space-y-6">
        <AccordionSection title="EARNINGS" count={earningsData.length} items={earningsData} groupName={groupName} activeDropdown={activeDropdown} onToggleDropdown={handleToggleDropdown} onDelete={handleDeleteClick} />
        <AccordionSection title="STATUTORIES" count={staturiesData.length} items={staturiesData} groupName={groupName} activeDropdown={activeDropdown} onToggleDropdown={handleToggleDropdown} onDelete={handleDeleteClick} />
        <AccordionSection title="OTHER EARNINGS" count={otherEarningsData.length} items={otherEarningsData} groupName={groupName} activeDropdown={activeDropdown} onToggleDropdown={handleToggleDropdown} onDelete={handleDeleteClick} />
        <AccordionSection title="REIMBURSEMENT" count={reimbursementData.length} items={reimbursementData} groupName={groupName} activeDropdown={activeDropdown} onToggleDropdown={handleToggleDropdown} onDelete={handleDeleteClick} />

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-800 mb-2">
                Note: Amount 50,000 is Just For Testing CTC Components...
            </p>
            <div className="flex justify-between items-center">
                <p className="text-md font-bold text-gray-900">Total: {totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                <div className="flex items-center gap-2">
                    <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    <button className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700">VALIDATE WITH AMOUNT</button>
                </div>
            </div>
        </div>
      </main>
      
      {/* Use your custom AlertModal */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={`Remove ${componentToDelete?.name}`}
        icon={<X className="h-8 w-8 text-red-600" strokeWidth={3}/>}
      >
        <p>
          If this component is not being used any where than it can be delete otherwise this component will be InActive. Note: Current Payslip Or Saved Salary Component will not affect after making InActive.
        </p>
      </AlertModal>
    </div>
  );
};

export default SalaryComponentPage;
