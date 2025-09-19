// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { X, ChevronDown } from 'lucide-react';
// import SidePanelForm from '../../components/common/SidePanelForm';
// import { updateHolidayCalendarEntry, type HolidayCalendarEntry } from '../../store/slice/holidayCalendarSlice';
// import { fetchHolidayConfigurations } from '../../store/slice/holidayconfigurationSlice';
// import type { RootState, AppDispatch } from '../../store/store';
// import toast from 'react-hot-toast';


// interface UpdateHolidayProps {
//   isOpen: boolean;
//   onClose: () => void;
//   holidayData: HolidayCalendarEntry | null;
// }


// const UpdateHoliday: React.FC<UpdateHolidayProps> = ({ isOpen, onClose, holidayData }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { items: holidayGroups, status: groupStatus } = useSelector((state: RootState) => state.holidayConfigurations);

//   const [type, setType] = useState('');
//   const [name, setName] = useState('');
//   const [date, setDate] = useState('');
//   const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
//   const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);


//   useEffect(() => {
//     if (isOpen && groupStatus === 'idle') {
//       dispatch(fetchHolidayConfigurations());
//     }
//   }, [isOpen, groupStatus, dispatch]);

  
//   useEffect(() => {
//     if (holidayData) {
//       setType(holidayData.type);
//       setName(holidayData.name);
//       setDate(new Date(holidayData.date).toISOString().split('T')[0]);
//       setSelectedGroups(holidayData.holidayGroups);
//     }
//   }, [holidayData]);

//   const handleGroupToggle = (groupName: string) => {
//     setSelectedGroups(prev =>
//       prev.includes(groupName)
//         ? prev.filter(g => g !== groupName)
//         : [...prev, groupName]
//     );
//   };

//   const handleSelectAllGroups = () => {
//     if (selectedGroups.length === holidayGroups.length) {
//       setSelectedGroups([]);
//     } else {
//       setSelectedGroups(holidayGroups.map(g => g.groupName));
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!type || !name || !date || selectedGroups.length === 0 || !holidayData) {
//     toast.error('Please fill all required fields.');
//     return;
//   }

//   const updatedEntry: HolidayCalendarEntry = {
//     ...holidayData,
//     name,
//     type,
//     date,
//     holidayGroups: selectedGroups,
//   };

//   dispatch(updateHolidayCalendarEntry(updatedEntry));
//   toast.success('Holiday calendar entry updated successfully!');
//   onClose();
// };


//   return (
//     <SidePanelForm
//       isOpen={isOpen}
//       onClose={onClose}
//       title="Edit Holiday"
//       onSubmit={handleSubmit}
//       submitText="Update"
//     >
//       <div className="space-y-4">
    
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Type <span className="text-red-500">*</span></label>
//           <select value={type} onChange={e => setType(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md bg-white">
//             <option value="" disabled>Select type</option>
//             <option value="Festival">Festival</option>
//             <option value="National">National</option>
//             <option value="Optional">Optional</option>
//           </select>
//         </div>

       
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
//           <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md"/>
//         </div>

      
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
//           <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md"/>
//         </div>

        
//         <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
//             <div className="relative">
//                 <button type="button" onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center">
//                     <span>Select groups</span>
//                     <ChevronDown size={16} />
//                 </button>
//                 {isGroupDropdownOpen && (
//                     <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
//                         <div className="p-2 border-b">
//                             <label className="flex items-center">
//                                 <input type="checkbox"
//                                     checked={selectedGroups.length === holidayGroups.length}
//                                     onChange={handleSelectAllGroups}
//                                     className="h-4 w-4 rounded"
//                                 />
//                                 <span className="ml-2 text-sm">Select All Group</span>
//                             </label>
//                         </div>
//                         <div className="max-h-40 overflow-y-auto p-2">
//                             {holidayGroups.map(group => (
//                                 <label key={group.id} className="flex items-center p-1">
//                                     <input type="checkbox"
//                                         checked={selectedGroups.includes(group.groupName)}
//                                         onChange={() => handleGroupToggle(group.groupName)}
//                                         className="h-4 w-4 rounded"
//                                     />
//                                     <span className="ml-2 text-sm">{group.groupName}</span>
//                                 </label>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//             <div className="p-2 border border-gray-300 rounded-md min-h-[80px] mt-2">
//                 <div className="flex flex-wrap gap-2">
//                 {selectedGroups.map(group => (
//                     <span key={group} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm">
//                     {group}
//                     <button type="button" onClick={() => handleGroupToggle(group)} className="ml-2 text-gray-600 hover:text-gray-800">
//                         <X size={14} />
//                     </button>
//                     </span>
//                 ))}
//                 </div>
//             </div>
//         </div>
//       </div>
//     </SidePanelForm>
//   );
// };

// export default UpdateHoliday;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, ChevronDown } from 'lucide-react';
import { z } from 'zod';
import SidePanelForm from '../../components/common/SidePanelForm';
import {
  updateHolidayCalendarEntry,
  type HolidayCalendarEntry,
  type UpdateHolidayCalendarPayload,
} from '../../store/slice/holidayCalendarSlice';
import { fetchHolidayConfigurations } from '../../store/slice/holidayconfigurationSlice';
import type { RootState, AppDispatch } from '../../store/store';
import toast, { Toaster } from 'react-hot-toast';

// Zod schema
const holidaySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required.')
    .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces.'),
  type: z.enum(['Festival', 'National', 'Optional'], {
    errorMap: () => ({ message: 'Please select a valid type.' }),
  }),
  date: z.string().min(1, 'Date is required.'),
  holidayGroups: z.array(z.string()).min(1, 'At least one group must be selected.'),
});

interface UpdateHolidayProps {
  isOpen: boolean;
  onClose: () => void;
  holidayData: HolidayCalendarEntry | null;
}

const UpdateHoliday: React.FC<UpdateHolidayProps> = ({ isOpen, onClose, holidayData }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: holidayGroups, status: groupStatus } = useSelector(
    (state: RootState) => state.holidayConfigurations
  );

  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && groupStatus === 'idle') {
      dispatch(fetchHolidayConfigurations());
    }
  }, [isOpen, groupStatus, dispatch]);

  useEffect(() => {
    if (isOpen && holidayData) {
      setType(holidayData.type);
      setName(holidayData.name);
      setDate(new Date(holidayData.date).toISOString().split('T')[0]);
      setSelectedGroups(holidayData.holidayGroups);
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, holidayData]);

  const handleGroupToggle = (groupName: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupName) ? prev.filter((g) => g !== groupName) : [...prev, groupName]
    );
  };

  const handleSelectAllGroups = () => {
    if (selectedGroups.length === holidayGroups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(holidayGroups.map((g) => g.name));
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!holidayData) {
      toast.error('Original holiday data is missing.');
      return;
    }

    const currentData = { name, type, date, holidayGroups: selectedGroups };
    const validationResult = holidaySchema.safeParse(currentData);

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      toast.error('Please fix the errors in the form.');
      return;
    }

    // Only changed fields
    const changedFields = Object.keys(validationResult.data).reduce((acc, key) => {
      const typedKey = key as keyof typeof validationResult.data;
      if (
        JSON.stringify(validationResult.data[typedKey]) !==
        JSON.stringify(holidayData[typedKey])
      ) {
        acc[typedKey] = validationResult.data[typedKey];
      }
      return acc;
    }, {} as Partial<HolidayCalendarEntry>);

    if (Object.keys(changedFields).length === 0) {
      toast('No changes detected.');
      return;
    }

    setIsSubmitting(true);

    const updatedEntry: UpdateHolidayCalendarPayload = {
      id: holidayData.id,
      ...changedFields,
    };

    const promise = dispatch(updateHolidayCalendarEntry(updatedEntry)).unwrap();

    try {
      await toast.promise(promise, {
        loading: 'Updating holiday...',
        success: (result) => result.message || 'Holiday updated successfully!',
        error: (err) => err.message || 'Failed to update holiday.',
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidePanelForm
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Holiday"
      onSubmit={handleSubmit}
      submitText={isSubmitting ? 'Updating...' : 'Update'}
      isSubmitting={isSubmitting}
    >


      <div className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100"
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="Festival">Festival</option>
            <option value="National">National</option>
            <option value="Optional">Optional</option>
          </select>
          {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type[0]}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
          />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date[0]}</p>}
        </div>

        {/* Groups */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
              disabled={isSubmitting}
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center disabled:bg-gray-100"
            >
              <span>Select groups</span>
              <ChevronDown size={16} />
            </button>
            {isGroupDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-2 border-b">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        holidayGroups.length > 0 &&
                        selectedGroups.length === holidayGroups.length
                      }
                      onChange={handleSelectAllGroups}
                      className="h-4 w-4 rounded"
                    />
                    <span className="ml-2 text-sm">Select All Group</span>
                  </label>
                </div>
                <div className="max-h-40 overflow-y-auto p-2">
                  {holidayGroups.map((group) => (
                    <label key={group.id} className="flex items-center p-1">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.name)}
                        onChange={() => handleGroupToggle(group.name)}
                        className="h-4 w-4 rounded"
                      />
                      <span className="ml-2 text-sm">{group.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          {errors.holidayGroups && (
            <p className="text-xs text-red-500 mt-1">{errors.holidayGroups[0]}</p>
          )}

          {/* Selected groups */}
          <div className="p-2 border border-gray-300 rounded-md min-h-[80px] mt-2 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {selectedGroups.map((group) => (
                <span
                  key={group}
                  className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm"
                >
                  {group}
                  <button
                    type="button"
                    onClick={() => handleGroupToggle(group)}
                    disabled={isSubmitting}
                    className="ml-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
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

export default UpdateHoliday;
