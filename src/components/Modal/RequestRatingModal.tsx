import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { addRecord, type NewRecordPayload } from '../../store/slice/recordSlice';

// --- PROPS DEFINITION ---
interface RequestRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
}

// --- MAIN COMPONENT ---
const RequestRatingModal: React.FC<RequestRatingModalProps> = ({ isOpen, onClose, setToast }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [employeeFrom, setEmployeeFrom] = useState('');
  const [employeeTo, setEmployeeTo] = useState('');
  const [managerFrom, setManagerFrom] = useState('');
  const [managerTo, setManagerTo] = useState('');

  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      // Reset form to default values when opened
      setSelectedMonth('November');
      setEmployeeFrom(formatDateForInput(new Date('2025-11-20')));
      setEmployeeTo(formatDateForInput(new Date('2025-11-25')));
      setManagerFrom(formatDateForInput(new Date('2025-12-25')));
      setManagerTo(formatDateForInput(new Date('2026-01-25')));
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: NewRecordPayload = {
        month: selectedMonth,
        employeeOpenFrom: employeeFrom,
        employeeOpenTo: employeeTo,
        managerOpenFrom: managerFrom,
        managerOpenTo: managerTo,
    };

    try {
        await dispatch(addRecord(newRecord)).unwrap();
        setToast({ message: 'Rating request created successfully!', type: 'success' });
        onClose();
    } catch (error: any) {
        setToast({ message: error || 'Failed to create rating request.', type: 'error' });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <header className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Request Rating</h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                <X size={22} />
              </button>
            </header>
            <main className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Employee Open Window</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1">From</label>
                    <input type="date" value={employeeFrom} onChange={(e) => setEmployeeFrom(e.target.value)} className="w-full p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">To</label>
                    <input type="date" value={employeeTo} onChange={(e) => setEmployeeTo(e.target.value)} className="w-full p-2 border rounded-md" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Manager Open Window</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs mb-1">From</label>
                    <input type="date" value={managerFrom} onChange={(e) => setManagerFrom(e.target.value)} className="w-full p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">To</label>
                    <input type="date" value={managerTo} onChange={(e) => setManagerTo(e.target.value)} className="w-full p-2 border rounded-md" />
                  </div>
                </div>
              </div>
            </main>
            <footer className="flex justify-end items-center p-4 border-t space-x-3 bg-gray-50 rounded-b-lg">
              <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                CANCEL
              </button>
              <button type="submit" className="px-6 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700">
                SUBMIT
              </button>
            </footer>
          </form>
        </div>
      </div>
  );
};

export default RequestRatingModal;
