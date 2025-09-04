import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, MoreHorizontal, RefreshCw, ServerCrash, ChevronRight } from 'lucide-react';
import {
  fetchHolidayConfigurations,
  addHolidayConfiguration,
  updateHolidayConfiguration,
  deleteHolidayConfiguration,
  type HolidayConfiguration,
} from '../../../store/slice/holidayconfigurationSlice'; 
import type { RootState, AppDispatch } from '../../../store/store'; 
import Table, { type Column } from "../../../components/common/Table"; 
import AlertModal from '../../../components/Modal/AlertModal'; 
import SidePanelForm from '../../../components/common/SidePanelForm';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

type HolidayConfigDisplay = HolidayConfiguration & { s_no: number };


const TableSkeleton: React.FC = () => (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-md w-full"></div>)}
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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Configurations Found</h3>
        <p className="mt-1 text-sm text-gray-600">Get started by adding a new holiday configuration.</p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Configuration
            </button>
        </div>
    </div>
);

const CreateHolidayConfiguration: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim()) {
    toast.error('Name is required.');
    return;
  }

  dispatch(addHolidayConfiguration({ groupName: name, code, description }));
  toast.success('Holiday configuration added successfully!');
  onClose();
};


  useEffect(() => {
    if (isOpen) {
      setName('');
      setCode('');
      setDescription('');
    }
  }, [isOpen]);

  return (
    <SidePanelForm isOpen={isOpen} onClose={onClose} title="Create Holiday Group" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input type="text" value={name}  placeholder='eg: diwali' onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input type="text" value={code} placeholder='1001' onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} placeholder='type here' onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
    </SidePanelForm>
  );
};

const UpdateHolidayConfiguration: React.FC<{ isOpen: boolean; onClose: () => void; configData: HolidayConfiguration | null; }> = ({ isOpen, onClose, configData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (configData) {
      setName(configData.groupName);
      setCode(configData.code);
      setDescription(configData.description);
    }
  }, [configData]);

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim() || !configData) {
    toast.error('Name is required.');
    return;
  }

  dispatch(updateHolidayConfiguration({ ...configData, groupName: name, code, description }));
  toast.success('Holiday configuration updated successfully!');
  onClose();
};


  return (
    <SidePanelForm isOpen={isOpen} onClose={onClose} title="Edit Holiday Group" onSubmit={handleSubmit} submitText="Update">
       <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input type="text" value={name} placeholder='eg: Diwali' onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
    </SidePanelForm>
  );
};

const HolidayConfigurationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: holidayConfigs, status, error } = useSelector((state: RootState) => state.holidayConfigurations);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<HolidayConfiguration | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; configId: string | null }>({
    isOpen: false,
    configId: null,
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHolidayConfigurations());
    }
  }, [status, dispatch]);

  const handleEditClick = useCallback((config: HolidayConfiguration) => {
    setEditingConfig(config);
    setActiveDropdown(null);
  }, []);

  const handleDeleteClick = useCallback((configId: string) => {
    setDeleteAlert({ isOpen: true, configId });
    setActiveDropdown(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteAlert.configId) {
      dispatch(deleteHolidayConfiguration(deleteAlert.configId));
    }
    setDeleteAlert({ isOpen: false, configId: null });
  }, [deleteAlert.configId, dispatch]);

  const columns = useMemo<Column<HolidayConfigDisplay>[]>(() => [
    { key: 's_no', header: 'S.No', className: 'w-16 text-center' },
    { key: 'groupName', header: 'Group Name' },
    { key: 'code', header: 'Code' },
    { key: 'description', header: 'Description' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="relative">
          <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full">
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
    if ((status === 'loading' || status === 'idle') && holidayConfigs.length === 0) {
      return <TableSkeleton />;
    }

    if (status === 'failed' && holidayConfigs.length === 0) {
      return <ErrorState onRetry={() => dispatch(fetchHolidayConfigurations())} error={error} />;
    }

    if (status === 'succeeded' && holidayConfigs.length === 0) {
      return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
    }

    const tableData = holidayConfigs.map((item, index) => ({ ...item, s_no: index + 1 }));

    return (
      <Table
        columns={columns}
        data={tableData}
        defaultItemsPerPage={5}
        showSearch={true}
        searchPlaceholder="Search Configurations..."
      />
    );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md border border-blue-200">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holiday Configuration</h1>
          <nav aria-label="Breadcrumb"className="mt-1 flex items-center text-sm text-gray-500">
             <Link to="/dashboard" className="hover:text-gray-700">
                Dashboard
              </Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <Link to="/getting-started" className="hover:text-gray-700">
                Getting Started
              </Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-800">Holiday Configurationr</span>
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
      
      <CreateHolidayConfiguration 
        isOpen={isCreatePanelOpen} 
        onClose={() => setCreatePanelOpen(false)}
      />

      <UpdateHolidayConfiguration
        isOpen={!!editingConfig}
        onClose={() => setEditingConfig(null)}
        configData={editingConfig}
      />

      <AlertModal
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, configId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Configuration"
      >
        <p>Are you sure you want to delete this holiday configuration?</p>
      </AlertModal>
    </div>
  );
};

export default HolidayConfigurationPage;
