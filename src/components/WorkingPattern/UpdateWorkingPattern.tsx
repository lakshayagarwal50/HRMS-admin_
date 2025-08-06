import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SidePanelForm from '../common/SidePanelForm'; // Adjust path if needed

// --- Redux Imports ---
import { updateWorkingPattern, type WorkingPattern } from '../../store/slice/workingPatternsSlice'; // Adjust path
import type { AppDispatch } from '../../store/store'; // Adjust path

// --- PROPS DEFINITION ---
interface UpdateWorkingPatternProps {
  isOpen: boolean;
  onClose: () => void;
  patternData: WorkingPattern | null;
}

// --- HELPER COMPONENTS (can be moved to a shared file) ---
const FormInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }> = 
({ label, value, onChange, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <input type="text" value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
  </div>
);

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeekRow: React.FC<{ weekName: string; checkedDays: boolean[]; onToggle: (dayIndex: number) => void }> = 
({ weekName, checkedDays, onToggle }) => (
  <div className="grid grid-cols-8 items-center gap-2">
    <span className="text-sm font-medium text-gray-700">{weekName}</span>
    {days.map((day, index) => (
      <div key={day} className="flex items-center">
        <input
          type="checkbox"
          id={`update-${weekName}-${day}`}
          checked={checkedDays[index]}
          onChange={() => onToggle(index)}
          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
        <label htmlFor={`update-${weekName}-${day}`} className="ml-2 text-sm text-gray-600">{day}</label>
      </div>
    ))}
  </div>
);

// --- MAIN COMPONENT ---
const UpdateWorkingPattern: React.FC<UpdateWorkingPatternProps> = ({ isOpen, onClose, patternData }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Local state for the form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [week1, setWeek1] = useState<boolean[]>([]);
  const [week2, setWeek2] = useState<boolean[]>([]);
  const [week3, setWeek3] = useState<boolean[]>([]);
  const [week4, setWeek4] = useState<boolean[]>([]);

  // This effect runs when the `patternData` prop changes (i.e., when the user clicks "Edit")
  // It populates the form with the data of the selected pattern.
  useEffect(() => {
    if (patternData) {
      setName(patternData.name);
      setCode(patternData.code);
      setWeek1(patternData.week1);
      setWeek2(patternData.week2);
      setWeek3(patternData.week3);
      setWeek4(patternData.week4);
    }
  }, [patternData]);

  const handleToggle = (week: number, dayIndex: number) => {
    const setters = [setWeek1, setWeek2, setWeek3, setWeek4];
    const weeks = [week1, week2, week3, week4];
    const newWeek = [...weeks[week - 1]];
    newWeek[dayIndex] = !newWeek[dayIndex];
    setters[week - 1](newWeek);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patternData) {
      alert("No pattern data to update.");
      return;
    }
    if (!name.trim()) {
      alert('Pattern Name is required.');
      return;
    }

    // Construct the updated pattern object
    const updatedPattern: WorkingPattern = {
      ...patternData,
      name,
      code,
      week1,
      week2,
      week3,
      week4,
    };
    
    // Dispatch the Redux action to update the pattern
    dispatch(updateWorkingPattern(updatedPattern));
    onClose();
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Update Working Pattern"
      onSubmit={handleFormSubmit}
      submitText="Update"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <div className="p-4 border rounded-md space-y-4">
            <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-500">
                <span>Week Name</span>
                {days.map(day => <span key={day} className="text-center">{day}</span>)}
            </div>
            <WeekRow weekName="Week 1" checkedDays={week1} onToggle={(dayIndex) => handleToggle(1, dayIndex)} />
            <WeekRow weekName="Week 2" checkedDays={week2} onToggle={(dayIndex) => handleToggle(2, dayIndex)} />
            <WeekRow weekName="Week 3" checkedDays={week3} onToggle={(dayIndex) => handleToggle(3, dayIndex)} />
            <WeekRow weekName="Week 4" checkedDays={week4} onToggle={(dayIndex) => handleToggle(4, dayIndex)} />
        </div>
      </div>
    </SidePanelForm>
  );
};

export default UpdateWorkingPattern;
