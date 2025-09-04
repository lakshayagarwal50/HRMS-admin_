import React, { useState, useEffect, useRef, useCallback} from 'react';
import { Plus, ChevronDown, ChevronRight, MoreHorizontal, X, ServerCrash, RefreshCw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AlertModal from '../../../components/Modal/AlertModal';
import type { AppDispatch, RootState } from '../../../store/store';
import {
  fetchSalaryComponents,
  deleteSalaryComponent,
  clearComponents,
  type SalaryComponent,
} from '../../../store/slice/salaryComponentSlice';

const SkeletonSection: React.FC = () => (
    <div className="bg-white rounded-lg border shadow-sm animate-pulse">
        <div className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-t-lg">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
        <div className="border-t border-gray-200 p-4 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-md w-full"></div>)}
        </div>
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
        <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Components</h3>
        <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
        <div className="mt-6">
            <button type="button" onClick={onRetry} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                Try Again
            </button>
        </div>
    </div>
);

const ComponentRow = React.memo(({ 
    item, 
    structureId, 
    onDeleteClick, 
    onToggleDropdown, 
    isDropdownOpen 
}: { 
    item: SalaryComponent, 
    structureId: string | undefined,
    onDeleteClick: (item: SalaryComponent) => void,
    onToggleDropdown: (id: string) => void,
    isDropdownOpen: boolean
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    const formatSettingKey = (key: string) => {
        switch (key) {
            case 'CTC': return 'Is CTC';
            case 'leaveBased': return 'Leave Based';
            case 'adjustmentBalanced': return 'Adjustable';
            default: return key.charAt(0).toUpperCase() + key.slice(1);
        }
    };
    
    return (
        <div className="grid grid-cols-5 gap-4 items-center py-3 px-4 border-b last:border-b-0">
          <div>
            <p className="font-semibold text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500">{item.type}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {Object.entries(item.otherSetting).map(([key, value]) => (
                  <div key={key} className="flex items-center" title={formatSettingKey(key)}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span className="text-gray-600">{formatSettingKey(key)}</span>
                  </div>
              ))}
          </div>
          <span className="text-sm text-gray-700 font-mono">{item.value}</span>
          <span className="text-sm font-semibold text-gray-800">₹ {Number(item.testAmount).toLocaleString()}</span>
          <div className="relative text-right">
            <button onClick={() => onToggleDropdown(item.id)} className="p-2 rounded-full hover:bg-gray-200">
              <MoreHorizontal size={20} />
            </button>
            {isDropdownOpen && (
              <div ref={dropdownRef} className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-xl z-20">
                <Link to={`/employee-salary-structures/${structureId}/components/${item.id}`} className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">Edit</Link>
                <button onClick={() => onDeleteClick(item)} className="block w-full text-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 rounded-b-lg">Delete</button>
              </div>
            )}
          </div>
        </div>
    );
});

const AccordionSection: React.FC<{
  title: string;
  components: SalaryComponent[];
  structureId: string | undefined;
  onDeleteClick: (component: SalaryComponent) => void;
  activeDropdown: string | null;
  onToggleDropdown: (id: string) => void;
}> = ({ title, components, structureId, onDeleteClick, activeDropdown, onToggleDropdown }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (components.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-700 bg-gray-50 rounded-t-lg"
      >
        <span>{`${title} (${components.length})`}</span>
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
          {components.map(item => (
              <ComponentRow 
                key={item.id}
                item={item}
                structureId={structureId}
                onDeleteClick={onDeleteClick}
                onToggleDropdown={onToggleDropdown}
                isDropdownOpen={activeDropdown === item.id}
              />
          ))}
        </div>
      )}
    </div>
  );
};

const SalaryComponentPage: React.FC = () => {
  const { structureId } = useParams<{ structureId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { data: componentData, status, error } = useSelector((state: RootState) => state.salaryComponents);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState<SalaryComponent | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (structureId) {
      dispatch(fetchSalaryComponents(structureId));
    }
    return () => {
      dispatch(clearComponents());
    };
  }, [dispatch, structureId]);

  const handleDeleteClick = useCallback((item: SalaryComponent) => {
    setComponentToDelete(item);
    setIsModalOpen(true);
    setActiveDropdown(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (componentToDelete) {
      dispatch(deleteSalaryComponent(componentToDelete.id));
    }
    setIsModalOpen(false);
    setComponentToDelete(null);
  }, [dispatch, componentToDelete]);

  const handleRetry = useCallback(() => {
      if(structureId) {
          dispatch(fetchSalaryComponents(structureId));
      }
  }, [dispatch, structureId]);

  const handleToggleDropdown = useCallback((id: string) => {
      setActiveDropdown(prev => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pageRef.current && !pageRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderContent = () => {
    if (status === 'loading' || status === 'idle') {
      return (
        <div className="space-y-6">
            <SkeletonSection />
            <SkeletonSection />
        </div>
      );
    }
    if (status === 'failed') {
      return <ErrorState onRetry={handleRetry} error={error} />;
    }
    if (status === 'succeeded' && componentData && Object.keys(componentData).length > 0) {
      return Object.entries(componentData).map(([key, value]) => (
        <AccordionSection
          key={key}
          title={key}
          components={value.components}
          structureId={structureId}
          onDeleteClick={handleDeleteClick}
          activeDropdown={activeDropdown}
          onToggleDropdown={handleToggleDropdown}
        />
      ));
    }
    return <p className="text-center text-gray-500 mt-8">No salary components found for this structure.</p>;
  };

  return (
    <div className="w-full bg-gray-50 p-6" ref={pageRef}>
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Salary Components</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
              <Link to="/payslip-components" className="hover:text-gray-700">Employee Salary Structures</Link>
              <ChevronRight size={16} className="mx-1" />
              <Link to="" className="hover:text-gray-700">Salary Structures</Link>
    
            </nav>
          </div>
          <Link to={`/employee-salary-structures/${structureId}/add-component`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
          </Link>
        </div>
      </header>

      <main className="space-y-6">
        {renderContent()}
      </main>
      
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Remove ${componentToDelete?.name}`}
        icon={<X className="h-8 w-8 text-red-600" strokeWidth={3}/>}
      >
        <p>Are you sure you want to delete this component?</p>
      </AlertModal>
    </div>
  );
};

export default SalaryComponentPage;
