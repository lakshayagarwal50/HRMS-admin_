import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addLeaveSetup, type NewLeaveSetup } from '../../store/slice/leaveSetupSlice'; 
import type { AppDispatch } from '../../store/store';


import SidePanelForm from '../common/SidePanelForm'; 


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
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition`}
      />
    </button>
  </div>
);

// --- PROPS DEFINITION ---
interface CreateLeaveSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateLeaveSetup: React.FC<CreateLeaveSetupProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [type, setType] = useState<'Every Month' | 'Every Year'>('Every Year');
    const [noOfLeaves, setNoOfLeaves] = useState(0);
    const [isCarryForward, setIsCarryForward] = useState(false);
    const [enableLeaveEncashment, setEnableLeaveEncashment] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Leave Type name is required.");
            return;
        }
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
                    <input type="text" placeholder='eg: planned leave' value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={type} onChange={e => setType(e.target.value as 'Every Month' | 'Every Year')} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option value="Every Year">Every Year</option>
                        <option value="Every Month">Every Month</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No Of Leave</label>
                    <input type="number" value={noOfLeaves} onChange={e => setNoOfLeaves(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <ToggleSwitch label="Is Carry Forward" enabled={isCarryForward} onChange={setIsCarryForward} />
                <ToggleSwitch label="Enable Leave Encashment" enabled={enableLeaveEncashment} onChange={setEnableLeaveEncashment} />
            </div>
        </SidePanelForm>
    );
};

export default CreateLeaveSetup;
