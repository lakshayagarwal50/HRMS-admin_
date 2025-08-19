import React, { useState, useEffect } from 'react';
import { X, AlertTriangle} from 'lucide-react';

// --- Reusable Toast Alert Component ---
const ToastAlert: React.FC<{
  message: string;
  onClose: () => void;
}> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-lg z-[100] flex items-center">
      <AlertTriangle className="text-red-500 mr-3" />
      <div>
        <p className="font-bold">Oh error!</p>
        <p className="text-sm">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-red-200">
        <X size={18} />
      </button>
    </div>
  );
};

// --- Reusable Date Input Component ---
const DateInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
        <input
            type="date"
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-purple-500 focus:border-purple-500"
        />
    </div>
  </div>
);

// --- PROPS DEFINITION ---
interface RequestRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- MAIN COMPONENT ---
const RequestRatingModal: React.FC<RequestRatingModalProps> = ({ isOpen, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [employeeFrom, setEmployeeFrom] = useState('');
  const [employeeTo, setEmployeeTo] = useState('');
  const [managerFrom, setManagerFrom] = useState('');
  const [managerTo, setManagerTo] = useState('');
  const [alert, setAlert] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      setSelectedMonth('November');
      setEmployeeFrom(formatDateForInput(new Date('2021-11-20')));
      setEmployeeTo(formatDateForInput(new Date('2021-11-25')));
      setManagerFrom(formatDateForInput(new Date('2021-12-25')));
      setManagerTo(formatDateForInput(new Date('2022-01-25')));
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMonth === 'January') {
      setAlert({ show: true, message: 'Rating for this month is already requested' });
      return;
    }
    console.log({
      month: selectedMonth,
      employeeWindow: { from: employeeFrom, to: employeeTo },
      managerWindow: { from: managerFrom, to: managerTo },
    });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {alert.show && (
        <ToastAlert 
          message={alert.message} 
          onClose={() => setAlert({ show: false, message: '' })} 
        />
      )}
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
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>November</option>
                  <option>December</option>
                </select>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Employee Open Window</h3>
                <div className="grid grid-cols-2 gap-4">
                  <DateInput label="From" value={employeeFrom} onChange={(e) => setEmployeeFrom(e.target.value)} />
                  <DateInput label="To" value={employeeTo} onChange={(e) => setEmployeeTo(e.target.value)} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Manager Open Window</h3>
                <div className="grid grid-cols-2 gap-4">
                  <DateInput label="From" value={managerFrom} onChange={(e) => setManagerFrom(e.target.value)} />
                  <DateInput label="To" value={managerTo} onChange={(e) => setManagerTo(e.target.value)} />
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
    </>
  );
};

export default RequestRatingModal;
