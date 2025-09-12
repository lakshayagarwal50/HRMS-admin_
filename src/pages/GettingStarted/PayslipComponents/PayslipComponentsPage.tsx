import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Plus, MoreHorizontal, ChevronRight, RefreshCw, ServerCrash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Table, { type Column } from '../../../components/common/Table';
import AlertModal from '../../../components/Modal/AlertModal';
import CreateSalaryStructure from '../../../components/PayslipComponents/CreateSalaryStructure';
import UpdateSalaryStructure from '../../../components/PayslipComponents/UpdateSalaryStructure';
import type { AppDispatch, RootState } from '../../../store/store';
import {
  fetchSalaryStructures,
  deleteSalaryStructure,
  addSalaryStructure,
  updateSalaryStructure,
  type SalaryStructure,
  type NewSalaryStructure,
} from '../../../store/slice/salaryStructureSlice';

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
        <h3 className="mt-2 text-lg font-semibold text-gray-800">No Salary Structures Found</h3>
        <p className="mt-1 text-sm text-gray-600">Get started by adding a new salary structure.</p>
        <div className="mt-6">
            <button type="button" onClick={onAddNew} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                <Plus size={20} className="-ml-1 mr-2" />
                Add New Structure
            </button>
        </div>
    </div>
);

const PayslipComponentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: structures, status, error } = useSelector((state: RootState) => state.salaryStructures);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isCreatePanelOpen, setCreatePanelOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState<SalaryStructure | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{ isOpen: boolean; structureId: string | null }>({
    isOpen: false,
    structureId: null,
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchSalaryStructures());
    }
  }, [status, dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(fetchSalaryStructures());
  }, [dispatch]);

  const handleEditClick = useCallback((structure: SalaryStructure) => {
    setEditingStructure(structure);
    setActiveDropdown(null);
  }, []);

  const handleDeleteClick = useCallback((structureId: string) => {
    setDeleteAlert({ isOpen: true, structureId });
    setActiveDropdown(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteAlert.structureId) {
      dispatch(deleteSalaryStructure(deleteAlert.structureId));
    }
    setDeleteAlert({ isOpen: false, structureId: null });
  }, [dispatch, deleteAlert.structureId]);

  const handleAddStructure = useCallback((newStructureData: NewSalaryStructure) => {
      dispatch(addSalaryStructure(newStructureData));
      setCreatePanelOpen(false);
  }, [dispatch]);

  const handleUpdateStructure = useCallback((updatedStructureData: Omit<SalaryStructure, 'id' | 'salaryComponent' | 'isDeleted'>) => {
      if (editingStructure) {
          dispatch(updateSalaryStructure({ id: editingStructure.id, ...updatedStructureData }));
      }
      setEditingStructure(null);
  }, [dispatch, editingStructure]);

  const columns = useMemo<Column<SalaryStructure>[]>(() => [
    { key: 'groupName', header: 'Group Name' },
    { key: 'code', header: 'Code' },
    { key: 'description', header: 'Description' },
    {
      key: 'salaryComponent',
      header: 'Salary Components',
      render: (row) => (
        <Link to={`/employee-salary-structures/${row.id}/components`} className="text-purple-600 hover:underline">
          Edit Components
        </Link>
      )
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <div className="relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === row.id ? null : row.id)}
            className="text-gray-500 hover:text-purple-600 p-1 rounded-full focus:outline-none"
          >
            <MoreHorizontal size={20} />
          </button>
          {activeDropdown === row.id && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
              <button onClick={() => handleEditClick(row)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Edit
              </button>
              <button onClick={() => handleDeleteClick(row.id)} className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100">
                Delete
              </button>
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
    if (status === 'loading' || status === 'idle') {
      return <TableSkeleton />;
    }
    if (status === 'failed') {
      return <ErrorState onRetry={handleRetry} error={error} />;
    }
    if (status === 'succeeded' && structures.length === 0) {
      return <EmptyState onAddNew={() => setCreatePanelOpen(true)} />;
    }
    return (
      <Table
        columns={columns}
        data={structures}
        showSearch={false}
        showPagination={true}
        defaultItemsPerPage={10}
      />
    );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <header className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Salary Structures</h1>
            <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
              <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
                                 <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-medium text-gray-800">Employee Salary Structures</span>
            </nav>
          </div>
          <button
            onClick={() => setCreatePanelOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            <Plus size={20} className="-ml-1 mr-2" />
            ADD NEW
          </button>
        </div>
      </header>

      <main>
        {renderContent()}
      </main>

      <CreateSalaryStructure
        isOpen={isCreatePanelOpen}
        onClose={() => setCreatePanelOpen(false)}
        onSubmit={handleAddStructure}
      />

      <UpdateSalaryStructure
        isOpen={!!editingStructure}
        onClose={() => setEditingStructure(null)}
        onSubmit={handleUpdateStructure}
        structureData={editingStructure}
      />

      <AlertModal
        isOpen={deleteAlert.isOpen}
        onClose={() => setDeleteAlert({ isOpen: false, structureId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Salary Structure"
      >
        <p>Are you sure you want to delete this salary structure?</p>
      </AlertModal>
    </div>
  );
};

export default PayslipComponentsPage;