// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import SidePanelForm from '../common/SidePanelForm'; 
// import { updateWorkingPattern, type WorkingPattern } from '../../store/slice/workingPatternsSlice'; 
// import type { AppDispatch } from '../../store/store'; 
// import toast from 'react-hot-toast';

// interface UpdateWorkingPatternProps {
//   isOpen: boolean;
//   onClose: () => void;
//   patternData: WorkingPattern | null;
// }


// const FormInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }> = 
// ({ label, value, onChange, required }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
//     <input type="text" value={value} onChange={onChange} required={required} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
//   </div>
// );

// const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// const WeekRow: React.FC<{ weekName: string; checkedDays: boolean[]; onToggle: (dayIndex: number) => void }> = 
// ({ weekName, checkedDays, onToggle }) => (
//   <div className="grid grid-cols-8 items-center gap-2">
//     <span className="text-sm font-medium text-gray-700">{weekName}</span>
//     {days.map((day, index) => (
//       <div key={day} className="flex items-center">
//         <input
//           type="checkbox"
//           id={`update-${weekName}-${day}`}
//           checked={checkedDays[index]}
//           onChange={() => onToggle(index)}
//           className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
//         />
//         <label htmlFor={`update-${weekName}-${day}`} className="ml-2 text-sm text-gray-600">{day}</label>
//       </div>
//     ))}
//   </div>
// );

// const UpdateWorkingPattern: React.FC<UpdateWorkingPatternProps> = ({ isOpen, onClose, patternData }) => {
//   const dispatch = useDispatch<AppDispatch>();
 
//   const [name, setName] = useState('');
//   const [code, setCode] = useState('');
//   const [week1, setWeek1] = useState<boolean[]>([]);
//   const [week2, setWeek2] = useState<boolean[]>([]);
//   const [week3, setWeek3] = useState<boolean[]>([]);
//   const [week4, setWeek4] = useState<boolean[]>([]);

//   useEffect(() => {
//     if (patternData) {
//       setName(patternData.name);
//       setCode(patternData.code);
//       setWeek1(patternData.week1);
//       setWeek2(patternData.week2);
//       setWeek3(patternData.week3);
//       setWeek4(patternData.week4);
//     }
//   }, [patternData]);

//   const handleToggle = (week: number, dayIndex: number) => {
//     const setters = [setWeek1, setWeek2, setWeek3, setWeek4];
//     const weeks = [week1, week2, week3, week4];
//     const newWeek = [...weeks[week - 1]];
//     newWeek[dayIndex] = !newWeek[dayIndex];
//     setters[week - 1](newWeek);
//   };

//   const handleFormSubmit = async(e: React.FormEvent) => {
//     e.preventDefault();
//     if (!patternData) {
//       alert("No pattern data to update.");
//       return;
//     }
//     if (!name.trim()) {
//       alert('Pattern Name is required.');
//       return;
//     }

   
//     const updatedPattern: WorkingPattern = {
//       ...patternData,
//       name,
//       code,
//       week1,
//       week2,
//       week3,
//       week4,
//     };
    


//     try {
//         await dispatch(updateWorkingPattern(updatedPattern)).unwrap();
//         toast.success('Designation updated successfully!');
//         onClose();
//     } catch (error: any) {
//         toast.error(error || 'Failed to update designation.');
//     }
   
    
//   };

//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Update Working Pattern"
//       onSubmit={handleFormSubmit}
//       submitText="Update"
//     >
//       <div className="space-y-6">
//         <div className="grid grid-cols-2 gap-4">
//           <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
//           <FormInput label="Code" value={code} onChange={(e) => setCode(e.target.value)} />
//         </div>
//         <div className="p-4 border rounded-md space-y-4">
//             <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-500">
//                 <span>Week Name</span>
//                 {days.map(day => <span key={day} className="text-center">{day}</span>)}
//             </div>
//             <WeekRow weekName="Week 1" checkedDays={week1} onToggle={(dayIndex) => handleToggle(1, dayIndex)} />
//             <WeekRow weekName="Week 2" checkedDays={week2} onToggle={(dayIndex) => handleToggle(2, dayIndex)} />
//             <WeekRow weekName="Week 3" checkedDays={week3} onToggle={(dayIndex) => handleToggle(3, dayIndex)} />
//             <WeekRow weekName="Week 4" checkedDays={week4} onToggle={(dayIndex) => handleToggle(4, dayIndex)} />
//         </div>
//       </div>
//     </SidePanelForm>
//   );
// };

// export default UpdateWorkingPattern;
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import SidePanelForm from '../common/SidePanelForm'; 
import { updateWorkingPattern, type WorkingPattern, type UpdateWorkingPatternPayload } from '../../store/slice/workingPatternsSlice'; 
import type { AppDispatch } from '../../store/store'; 

// Zod schema for validation
const workingPatternSchema = z.object({
    name: z.string()
        .min(1, 'Name is required.')
        .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces.'),
    code: z.string()
        .regex(/^[A-Z0-9]*$/, 'Code can only contain capital letters and numbers.')
        .optional(),
});

// --- UI Sub-Components ---

interface FormInputProps {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    disabled?: boolean;
    error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, value, onChange, required, disabled, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <input 
        type="text" 
        value={value} 
        onChange={onChange} 
        disabled={disabled} 
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100" 
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeekRow: React.FC<{ weekName: string; checkedDays: boolean[]; onToggle: (dayIndex: number) => void; disabled: boolean; }> = 
({ weekName, checkedDays, onToggle, disabled }) => (
  <div className="grid grid-cols-8 items-center gap-2">
    <span className="text-sm font-medium text-gray-700">{weekName}</span>
    {days.map((day, index) => (
      <div key={day} className="flex items-center justify-center">
        <input
          type="checkbox"
          id={`update-${weekName}-${day}`}
          checked={checkedDays[index]}
          onChange={() => onToggle(index)}
          disabled={disabled}
          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
        />
      </div>
    ))}
  </div>
);

// --- MAIN COMPONENT ---

interface UpdateWorkingPatternProps {
  isOpen: boolean;
  onClose: () => void;
  patternData: WorkingPattern | null;
}

const UpdateWorkingPattern: React.FC<UpdateWorkingPatternProps> = ({ isOpen, onClose, patternData }) => {
  const dispatch = useDispatch<AppDispatch>();
 
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [week1, setWeek1] = useState<boolean[]>([]);
  const [week2, setWeek2] = useState<boolean[]>([]);
  const [week3, setWeek3] = useState<boolean[]>([]);
  const [week4, setWeek4] = useState<boolean[]>([]);

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patternData) {
      setName(patternData.name);
      setCode(patternData.code);
      setWeek1([...patternData.week1]);
      setWeek2([...patternData.week2]);
      setWeek3([...patternData.week3]);
      setWeek4([...patternData.week4]);
      setErrors({});
    }
  }, [patternData]);

  const handleToggle = (week: number, dayIndex: number) => {
    const setters = [setWeek1, setWeek2, setWeek3, setWeek4];
    const weeks = [week1, week2, week3, week4];
    const newWeek = [...weeks[week - 1]];
    newWeek[dayIndex] = !newWeek[dayIndex];
    setters[week - 1](newWeek);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!patternData) {
      toast.error("Original pattern data is missing.");
      return;
    }

    const validationResult = workingPatternSchema.safeParse({ name, code });
    if (!validationResult.success) {
        setErrors(validationResult.error.flatten().fieldErrors);
        toast.error("Please fix the errors in the form.");
        return;
    }
    
    const changes: Partial<WorkingPattern> = {};
    if (name !== patternData.name) changes.name = name;
    if (code !== patternData.code) changes.code = code;
    
    const weeksChanged = 
        JSON.stringify(week1) !== JSON.stringify(patternData.week1) ||
        JSON.stringify(week2) !== JSON.stringify(patternData.week2) ||
        JSON.stringify(week3) !== JSON.stringify(patternData.week3) ||
        JSON.stringify(week4) !== JSON.stringify(patternData.week4);

    if (weeksChanged) {
        changes.week1 = week1;
        changes.week2 = week2;
        changes.week3 = week3;
        changes.week4 = week4;
    }

    if (Object.keys(changes).length === 0) {
        toast.success("No changes to save.");
        onClose();
        return;
    }

    setIsSubmitting(true);
    const payload: UpdateWorkingPatternPayload = { id: patternData.id, ...changes };
    const promise = dispatch(updateWorkingPattern(payload)).unwrap();

    try {
        await toast.promise(promise, {
            loading: 'Updating pattern...',
            success: (result) => result.message || 'Pattern updated successfully!',
            error: (err) => err.message || 'Failed to update pattern.',
        });
        onClose();
    } catch (error) {
        // Error is handled by toast.promise
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Update Working Pattern"
      onSubmit={handleFormSubmit}
      submitText={isSubmitting ? "Updating..." : "Update"}
      isSubmitting={isSubmitting}
    >
      <Toaster position="top-center" />
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormInput 
            label="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            disabled={isSubmitting}
            error={errors.name?.[0]}
          />
          <FormInput 
            label="Code" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            disabled={isSubmitting}
            error={errors.code?.[0]}
          />
        </div>
        <div className="p-4 border rounded-md space-y-3 bg-gray-50">
            <div className="grid grid-cols-8 gap-2 text-xs font-semibold text-gray-500 border-b pb-2">
                <span className="col-span-1">Week</span>
                {days.map(day => <span key={day} className="text-center">{day}</span>)}
            </div>
            <WeekRow weekName="Week 1" checkedDays={week1} onToggle={(dayIndex) => handleToggle(1, dayIndex)} disabled={isSubmitting} />
            <WeekRow weekName="Week 2" checkedDays={week2} onToggle={(dayIndex) => handleToggle(2, dayIndex)} disabled={isSubmitting} />
            <WeekRow weekName="Week 3" checkedDays={week3} onToggle={(dayIndex) => handleToggle(3, dayIndex)} disabled={isSubmitting} />
            <WeekRow weekName="Week 4" checkedDays={week4} onToggle={(dayIndex) => handleToggle(4, dayIndex)} disabled={isSubmitting} />
        </div>
      </div>
    </SidePanelForm>
  );
};

export default UpdateWorkingPattern;