import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, MoreHorizontal, ChevronRight, X as AlertIcon, RefreshCw, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Redux Imports ---
import {
  fetchLeaveSetups,
  addLeaveSetup,
  updateLeaveSetup,
  deleteLeaveSetup,
  type LeaveSetup,
  type NewLeaveSetup,
} from '../../store/slice/leaveSetupSlice'; // Corrected slice import
import type { RootState, AppDispatch } from '../../store/store';

// --- Component Imports ---
import Table, { type Column } from '../../components/common/Table'; 
import AlertModal from '../../components/Modal/AlertModal'; 
import SidePanelForm from '../../components/common/SidePanelForm';

// --- TYPE DEFINITION for display data ---
type LeaveSetupDisplay = LeaveSetup & { s_no: number };

// --- UI State Components ---
const TableSkeleton: React.FC = () => (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>)}
        </div>
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg">
        <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Data</h3>
        <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
        <div className="mt-6">
            <button type="button" onClick={onRetry} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                Try Again
            </button>
        </div>
    </div>
);

const EmptyState: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <div className="text-center py-10 px-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Leave Setups Found</h3>
        <p className="mt-1 text-sm text-gray-600">
            Get started by adding a new leave type.
        </p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Leave Type
            </button>
        </div>
    </div>
);

// --- Reusable Toggle Switch ---
const ToggleSwitch: React.FC<{
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ label, enabled, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`${
        enabled ? 'bg-purple-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition`}
      />
    </button>
  </div>
);

// --- Create Form Component ---
const CreateLeaveSetup: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [type, setType] = useState<'Every Month' | 'Every Year'>('Every Year');
    const [noOfLeaves, setNoOfLeaves] = useState(0);
    const [isCarryForward, setIsCarryForward] = useState(false);
    const [enableLeaveEncashment, setEnableLeaveEncashment] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newLeave: NewLeaveSetup = {
            name,
            type,
            noOfLeaves,
            isCarryForward: isCarryForward ? 'YES' : 'NO',
            enableLeaveEncashment,
        };
        dispatch(addLeaveSetup(newLeave));
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setType('Every Year');
            setNoOfLeaves(0);
            setIsCarryForward(false);
            setEnableLeaveEncashment(false);
        }
    }, [isOpen]);

    return (
        <SidePanelForm isOpen={isOpen} onClose={onClose} title="Configure New Leave" onSubmit={handleSubmit} submitText="Submit">
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={type} onChange={e => setType(e.target.value as 'Every Month' | 'Every Year')} className="w-full p-2 border rounded-md bg-white">
                        <option value="Every Year">Every Year</option>
                        <option value="Every Month">Every Month</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No Of Leave</label>
                    <input type="number" value={noOfLeaves} onChange={e => setNoOfLeaves(Number(e.target.value))} className="w-full p-2 border rounded-md"/>
                </div>
                <ToggleSwitch label="Is Carry Forward" enabled={isCarryForward} onChange={setIsCarryForward} />
                <ToggleSwitch label="Enable Leave Encashment" enabled={enableLeaveEncashment} onChange={setEnableLeaveEncashment} />
            </div>
        </SidePanelForm>
    );
};

// --- Update Form Component ---
const UpdateLeaveSetup: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    leaveData: LeaveSetup | null;
}> = ({ isOpen, onClose, leaveData }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [type, setType] = useState<'Every Month' | 'Every Year'>('Every Year');
    const [noOfLeaves, setNoOfLeaves] = useState(0);
    const [isCarryForward, setIsCarryForward] = useState(false);
    const [enableLeaveEncashment, setEnableLeaveEncashment] = useState(false);

    useEffect(() => {
        if (leaveData) {
            setName(leaveData.name);
            setType(leaveData.type);
            setNoOfLeaves(leaveData.noOfLeaves);
            setIsCarryForward(leaveData.isCarryForward === 'YES');
            setEnableLeaveEncashment(leaveData.enableLeaveEncashment || false);
        }
    }, [leaveData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leaveData) return;
        const updatedLeave: LeaveSetup = {
            ...leaveData,
            name,
            type,
            noOfLeaves,
            isCarryForward: isCarryForward ? 'YES' : 'NO',
            enableLeaveEncashment,
        };
        dispatch(updateLeaveSetup(updatedLeave));
        onClose();
    };

    return (
        <SidePanelForm isOpen={isOpen} onClose={onClose} title={`Edit '${leaveData?.name || ''}'`} onSubmit={handleSubmit} submitText="Update">
            <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={type} onChange={e => setType(e.target.value as 'Every Month' | 'Every Year')} className="w-full p-2 border rounded-md bg-white">
                        <option value="Every Year">Every Year</option>
                        <option value="Every Month">Every Month</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No Of Leave</label>
                    <input type="number" value={noOfLeaves} onChange={e => setNoOfLeaves(Number(e.target.value))} className="w-full p-2 border rounded-md"/>
                </div>
                <ToggleSwitch label="Is Carry Forward" enabled={isCarryForward} onChange={setIsCarryForward} />
                <ToggleSwitch label="Enable Leave Encashment" enabled={enableLeaveEncashment} onChange={setEnableLeaveEncashment} />
            </div>
        </SidePanelForm>
    );
};


// --- MAIN PAGE COMPONENT ---
const LeaveSetupPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: leaveData, status, error } = useSelector((state: RootState) => state.leaveSetups);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveSetup | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; leaveId: string | null }>({
    isOpen: false,
    leaveId: null,
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLeaveSetups());
    }
  }, [status, dispatch]);

  const handleEditClick = useCallback((leave: LeaveSetup) => {
    setEditingLeave(leave);
    setActiveDropdown(null);
  }, []);

  const handleDeleteClick = useCallback((leaveId: string) => {
    setDeleteAlert({ isOpen: true, leaveId });
    setActiveDropdown(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteAlert.leaveId) {
        dispatch(deleteLeaveSetup(deleteAlert.leaveId));
    }
    setDeleteAlert({ isOpen: false, leaveId: null });
  }, [deleteAlert.leaveId, dispatch]);

  const columns = useMemo<Column<LeaveSetupDisplay>[]>(() => [
    { key: 's_no', header: 'S.No', className: 'w-16 text-center' },
    { key: 'name', header: 'Name' },
    { key: 'type', header: 'Type' },
    { key: 'noOfLeaves', header: 'No of Leaves' },
    { key: 'isCarryForward', header: 'Is Carry Forward' },
    { 
      key: 'status', 
      header: 'Status',
      render: (row) => (
        <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full capitalize ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-center',
      render: (row) => (
        <div className="relative inline-block">
          <button 
            onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} 
            className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none"
          >
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
              <a href="#" onClick={(e) => { e.preventDefault(); handleEditClick(row); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteClick(row.id); }} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">Delete</a>
            </div>
          )}
        </div>
      ),
    },
  ], [activeDropdown, handleEditClick, handleDeleteClick]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderContent = () => {
    if ((status === 'loading' || status === 'idle') && leaveData.length === 0) {
        return <TableSkeleton />;
    }
    if (status === 'failed' && leaveData.length === 0) {
        return <ErrorState onRetry={() => dispatch(fetchLeaveSetups())} error={error} />;
    }
    if (status === 'succeeded' && leaveData.length === 0) {
        return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
    }
    
    const tableData = leaveData.map((item, index) => ({ ...item, s_no: index + 1 }));
    return (
        <Table
            columns={columns}
            data={tableData}
            showSearch={true}
            searchPlaceholder="Search leaves..."
            showPagination={true}
        />
    );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Setup</h1>
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mt-1 flex items-center">
            <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="font-medium text-gray-800">Leave Setup</span>
          </nav>
        </div>
        <button
            onClick={() => setCreatePanelOpen(true)} 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
        >
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
        </button>
      </header>
      
      <main>
          {renderContent()}
      </main>

      <CreateLeaveSetup
        isOpen={isCreatePanelOpen}
        onClose={() => setCreatePanelOpen(false)}
      />

      <UpdateLeaveSetup
        isOpen={!!editingLeave}
        onClose={() => setEditingLeave(null)}
        leaveData={editingLeave}
      />

      <AlertModal
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, leaveId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Leave Type"
        icon={<AlertIcon className="text-red-500" size={40} strokeWidth={3} />}
      >
        <p>Are you sure you want to delete this leave type?</p>
      </AlertModal>
    </div>
  );
};

export default LeaveSetupPage;
