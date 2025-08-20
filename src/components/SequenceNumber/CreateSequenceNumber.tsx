import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SidePanelForm from '../../components/common/SidePanelForm'; // Adjust path
import { addSequenceNumber, type NewSequenceNumber } from '../../store/slice/sequenceNumberSlice'; // Adjust path
import type { AppDispatch } from '../../store/store'; // Adjust path

// --- TYPE DEFINITIONS ---
type SequenceType = 'Employee' | 'Payslip' | '';

interface CreateSequenceNumberProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- MAIN COMPONENT ---
const CreateSequenceNumber: React.FC<CreateSequenceNumberProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [type, setType] = useState<SequenceType>('');
  const [prefix, setPrefix] = useState('');
  const [nextAvailableNumber, setNextAvailableNumber] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) {
      alert('Type is required.');
      return;
    }
    const newSequence: NewSequenceNumber = { type, prefix, nextAvailableNumber };
    dispatch(addSequenceNumber(newSequence));
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setType('');
      setPrefix('');
      setNextAvailableNumber(0);
    }
  }, [isOpen]);

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Sequence Number"
      onSubmit={handleSubmit}
      submitText="Submit"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SequenceType)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
          >
            <option value="" disabled>Select a type</option>
            <option value="Employee">Employee</option>
            <option value="Payslip">Payslip</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
          <input
            type="number"
            value={nextAvailableNumber}
            onChange={(e) => setNextAvailableNumber(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>
    </SidePanelForm>
  );
};

export default CreateSequenceNumber;
