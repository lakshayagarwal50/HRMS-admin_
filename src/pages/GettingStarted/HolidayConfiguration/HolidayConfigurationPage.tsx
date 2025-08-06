import React, { useState, useEffect, useRef } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';

// --- Redux Imports ---
// Assuming your store and slice are set up correctly
import { type RootState, type AppDispatch } from '../../../store/store'; 
import {
  fetchHolidayConfigurations,
  addHolidayConfiguration,
  updateHolidayConfiguration,
  deleteHolidayConfiguration,
  type HolidayConfiguration,
  type NewHolidayConfiguration,
} from '../../../store/slice/holidayconfigurationSlice'; 

// --- Component Imports ---
import Table, { type Column } from "../../../components/common/Table"; 
import AlertModal from '../../../components/Modal/AlertModal'; 
import SidePanelForm from '../../../components/common/SidePanelForm';

// --- TYPE DEFINITION for display data ---
type HolidayConfigDisplay = HolidayConfiguration & { s_no: number };

// --- Create Form Component (No changes needed here) ---
const CreateHolidayConfiguration: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newConfig: NewHolidayConfiguration) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Name is required.');
      return;
    }
    // The 'name' from the form is mapped to 'groupName' here
    onAdd({ groupName: name, code, description });
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
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
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

// --- Update Form Component (No changes needed here) ---
const UpdateHolidayConfiguration: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedConfig: HolidayConfiguration) => void;
  configData: HolidayConfiguration | null;
}> = ({ isOpen, onClose, onUpdate, configData }) => {
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
      alert('Name is required.');
      return;
    }
    onUpdate({ ...configData, groupName: name, code, description });
    onClose();
  };

  return (
    <SidePanelForm isOpen={isOpen} onClose={onClose} title="Edit Holiday Group" onSubmit={handleSubmit} submitText="Update">
       <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
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


// --- MAIN PAGE COMPONENT ---
const HolidayConfigurationPage: React.FC = () => {
  // --- Redux State ---
  const dispatch = useDispatch<AppDispatch>();
  const { items: holidayConfigs, status, error } = useSelector((state: RootState) => state.holidayConfigurations);

  // --- Local UI State ---
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<HolidayConfiguration | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; configId: string | null }>({
    isOpen: false,
    configId: null,
  });

  // --- Fetch Data on Mount ---
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchHolidayConfigurations());
    }
  }, [status, dispatch]);


  // --- Handlers ---
  const handleEditClick = (config: HolidayConfiguration) => {
    setEditingConfig(config);
    setActiveDropdown(null);
  };

  const handleDeleteClick = (configId: string) => {
    setDeleteAlert({ isOpen: true, configId });
    setActiveDropdown(null);
  };

  const handleConfirmDelete = () => {
    if (deleteAlert.configId) {
      dispatch(deleteHolidayConfiguration(deleteAlert.configId));
    }
    setDeleteAlert({ isOpen: false, configId: null });
  };

  const handleAddConfig = (newConfig: NewHolidayConfiguration) => {
    dispatch(addHolidayConfiguration(newConfig));
  };

  const handleUpdateConfig = (updatedConfig: HolidayConfiguration) => {
    dispatch(updateHolidayConfiguration(updatedConfig));
  };


  // --- Column Definitions ---
  const columns: Column<HolidayConfigDisplay>[] = [
    { 
      key: 's_no', 
      header: 'S.No',
      className: 'w-16 text-center',
    },
    { key: 'groupName', header: 'Group Name' },
    { key: 'code', header: 'Code' },
    { key: 'description', header: 'Description' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="relative">
          <button onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)} className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none">
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
  ];

  // Effect for closing dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Render Logic ---
  let content;

  if (status === 'loading') {
    content = <div className="text-center p-8">Loading configurations...</div>;
  } else if (status === 'succeeded') {
    content = (
      <Table
        columns={columns}
        data={holidayConfigs.map((item, index) => ({ ...item, s_no: index + 1 }))}
        defaultItemsPerPage={4}
      />
    );
  } else if (status === 'failed') {
    content = <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md border border-blue-200">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Holiday Configuration</h1>
          <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
            Dashboard / Getting Started / Holiday Configuration
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
          {content}
      </main>
      
      <CreateHolidayConfiguration 
        isOpen={isCreatePanelOpen} 
        onClose={() => setCreatePanelOpen(false)}
        onAdd={handleAddConfig}
      />

      <UpdateHolidayConfiguration
        isOpen={!!editingConfig}
        onClose={() => setEditingConfig(null)}
        onUpdate={handleUpdateConfig}
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
