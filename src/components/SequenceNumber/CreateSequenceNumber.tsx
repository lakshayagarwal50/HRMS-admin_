import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

// --- Component & Redux Imports ---
import SidePanelForm from '../../components/common/SidePanelForm'; // Adjust path
import { addSequenceNumber, type NewSequenceNumber } from '../../store/slice/sequenceNumberSlice'; // Adjust path
import type { AppDispatch } from '../../store/store'; // Adjust path

// --- TYPE DEFINITIONS ---
// Changed to string to allow for custom types
type SequenceType = string;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type.trim()) {
      toast.error('Type is a required field.');
      return;
    }
    const newSequence: NewSequenceNumber = { type: type.trim() as 'Employee' | 'Payslip', prefix, nextAvailableNumber };
    
    try {
        // .unwrap() will throw an error if the thunk is rejected
        await dispatch(addSequenceNumber(newSequence)).unwrap();
        toast.success('Sequence number created successfully!');
        onClose();
    } catch (error: unknown) { // Corrected: Changed 'any' to 'unknown' for better type safety
        // Display the error message from the slice
        let errorMessage = 'Failed to create sequence number.';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        toast.error(errorMessage);
    }
  };

  // Reset the form state when the panel is closed
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
            {/* Changed to an input with a datalist for flexibility */}
            <input
              id="type"
              name="type"
              placeholder='eg: employee'
              list="type-options"
              value={type}
              onChange={(e) => setType(e.target.value as SequenceType)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white"
            />
            <datalist id="type-options">
              <option value="Employee" />
              <option value="Payslip" />
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prefix</label>
            <input
              type="text"
              placeholder='eg: EMP'
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Available Number</label>
            <input
              type="number"
              placeholder='eg: 1001'
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
