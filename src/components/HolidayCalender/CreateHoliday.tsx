import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, ChevronDown } from 'lucide-react';
import SidePanelForm from '../../components/common/SidePanelForm';


import { addHolidayCalendarEntry, type NewHolidayCalendarEntry } from '../../store/slice/holidayCalendarSlice';
import { fetchHolidayConfigurations,} from '../../store/slice/holidayconfigurationSlice';
import type { RootState, AppDispatch } from '../../store/store';
import toast from 'react-hot-toast';


interface CreateHolidayFormProps {
  isOpen: boolean;
  onClose: () => void;
}


const CreateHolidayForm: React.FC<CreateHolidayFormProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: holidayGroups, status: groupStatus } = useSelector((state: RootState) => state.holidayConfigurations);

  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);


  useEffect(() => {
    if (isOpen && groupStatus === 'idle') {
      dispatch(fetchHolidayConfigurations());
    }
  }, [isOpen, groupStatus, dispatch]);
  
 
  useEffect(() => {
    if (!isOpen) {
        setType('');
        setName('');
        setDate('');
        setSelectedGroups([]);
        setIsGroupDropdownOpen(false);
    }
  }, [isOpen]);

  const handleGroupToggle = (groupName: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleSelectAllGroups = () => {
    if (selectedGroups.length === holidayGroups.length) {
        setSelectedGroups([]);
    } else {
        setSelectedGroups(holidayGroups.map(g => g.groupName));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!type || !name || !date || selectedGroups.length === 0) {
    toast.error('Please fill all required fields.');
    return;
  }

  const newEntry: NewHolidayCalendarEntry = {
    name,
    type,
    date,
    holidayGroups: selectedGroups,
  };

  dispatch(addHolidayCalendarEntry(newEntry));
  toast.success('Holiday calendar entry added successfully!');
  onClose();
};


  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Create Holiday"
      onSubmit={handleSubmit}
      submitText="Save"
    >
      <div className="space-y-4">
     
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
          <select value={type} onChange={e => setType(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md bg-white">
            <option value="" disabled>Select type</option>
            <option value="Festival">Festival</option>
            <option value="National">National</option>
            <option value="Optional">Optional</option>
          </select>
        </div>

    
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input type="text" value={name} placeholder='Name of Festival' onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md"/>
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md"/>
        </div>

       
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <div className="relative">
                <button type="button" onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center">
                    <span>Select groups</span>
                    <ChevronDown size={16} />
                </button>
                {isGroupDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                        <div className="p-2 border-b">
                            <label className="flex items-center">
                                <input type="checkbox"
                                    checked={selectedGroups.length === holidayGroups.length}
                                    onChange={handleSelectAllGroups}
                                    className="h-4 w-4 rounded"
                                />
                                <span className="ml-2 text-sm">Select All Group</span>
                            </label>
                        </div>
                        <div className="max-h-40 overflow-y-auto p-2">
                            {holidayGroups.map(group => (
                                <label key={group.id} className="flex items-center p-1">
                                    <input type="checkbox"
                                        checked={selectedGroups.includes(group.groupName)}
                                        onChange={() => handleGroupToggle(group.groupName)}
                                        className="h-4 w-4 rounded"
                                    />
                                    <span className="ml-2 text-sm">{group.groupName}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="p-2 border border-gray-300 rounded-md min-h-[80px] mt-2">
                <div className="flex flex-wrap gap-2">
                {selectedGroups.map(group => (
                    <span key={group} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">
                    {group}
                    <button type="button" onClick={() => handleGroupToggle(group)} className="ml-2 text-gray-600 hover:text-gray-800">
                        <X size={14} />
                    </button>
                    </span>
                ))}
                </div>
            </div>
        </div>
      </div>
    </SidePanelForm>
  );
};

export default CreateHolidayForm;
