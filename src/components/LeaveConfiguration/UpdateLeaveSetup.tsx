import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// --- Redux Imports ---
import { updateLeaveSetup, type LeaveSetup } from '../../store/slice/leaveSetupSlice'; // Adjust path if needed
import type { AppDispatch } from '../../store/store'; // Adjust path if needed

// --- Component Imports ---
import SidePanelForm from '../common/SidePanelForm'; // Adjust path if needed

// --- Reusable Toggle Switch Component ---
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
interface UpdateLeaveSetupProps {
  isOpen: boolean;
  onClose: () => void;
  leaveData: LeaveSetup | null; // Data for the leave type being edited
}

// --- MAIN COMPONENT ---
const UpdateLeaveSetup: React.FC<UpdateLeaveSetupProps> = ({ isOpen, onClose, leaveData }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [type, setType] = useState<'Every Month' | 'Every Year'>('Every Year');
    const [noOfLeaves, setNoOfLeaves] = useState(0);
    const [isCarryForward, setIsCarryForward] = useState(false);
    const [enableLeaveEncashment, setEnableLeaveEncashment] = useState(false);

    // Effect to populate the form with existing data when the panel opens
    useEffect(() => {
        if (isOpen && leaveData) {
            setName(leaveData.name);
            setType(leaveData.type);
            setNoOfLeaves(leaveData.noOfLeaves);
            setIsCarryForward(leaveData.isCarryForward === 'YES');
            setEnableLeaveEncashment(leaveData.enableLeaveEncashment || false);
        }
    }, [isOpen, leaveData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !leaveData) {
            alert("Leave Type name is required.");
            return;
        }
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
        <SidePanelForm
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit '${leaveData?.name || ''}' Leave`}
            onSubmit={handleSubmit}
            submitText="Update"
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md"/>
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

export default UpdateLeaveSetup;
