// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { ChevronRight, RefreshCw, ServerCrash } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';

// // --- Redux Imports ---
// import {
//   fetchWebCheckinSettings,
//   updateWebCheckinSettings,
//   type WebCheckinSettings,
// } from '../../../store/slice/webCheckinSettingsSlice'; // Adjust path
// import type { RootState, AppDispatch } from '../../../store/store'; // Adjust path
// import toast from 'react-hot-toast';

// // --- UI State Components ---
// const FormSkeleton: React.FC = () => (
//     <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl animate-pulse">
//         <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
//             <div>
//                 <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
//                 <div className="h-10 bg-gray-200 rounded-md w-full"></div>
//             </div>
//             <div>
//                 <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
//                 <div className="h-10 bg-gray-200 rounded-md w-full"></div>
//             </div>
//         </div>
//     </div>
// );

// const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
//     <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl">
//         <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
//         <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Settings</h3>
//         <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
//         <div className="mt-6">
//             <button type="button" onClick={onRetry} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
//                 <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
//                 Try Again
//             </button>
//         </div>
//     </div>
// );


// // --- Reusable Time Input Component ---
// const TimeInput: React.FC<{
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }> = ({ label, value, onChange }) => (
//   <div className="relative">
//     <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//     <input
//       type="time"
//       value={value}
//       onChange={onChange}
//       className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
//     />
//   </div>
// );

// // --- Main Page Component ---
// const WebCheckinSettingsPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { data: settings, status, error } = useSelector((state: RootState) => state.webCheckinSettings);

//   const [startTime, setStartTime] = useState('10:00');
//   const [endTime, setEndTime] = useState('19:00');

//   // Fetch initial settings
//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchWebCheckinSettings());
//     }
//   }, [status, dispatch]);

//   // Update local state when settings are fetched from Redux
//   useEffect(() => {
//     if (settings) {
//       setStartTime(settings.shiftStartTime);
//       setEndTime(settings.shiftEndTime);
//     }
//   }, [settings]);

//   const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   const updatedSettings: WebCheckinSettings = {
//     shiftStartTime: startTime,
//     shiftEndTime: endTime,
//   };

//   try {
//     await dispatch(updateWebCheckinSettings(updatedSettings)).unwrap();
//     toast.success('Web check-in settings updated successfully!');
//   } catch (error) {
//     toast.error('Failed to update web check-in settings.');
//   }
// };


//   const handleCancel = () => {
//     navigate('/getting-started');
//   };

//   const renderContent = () => {
//       if ((status === 'loading' || status === 'idle') && !settings) {
//           return <FormSkeleton />;
//       }
//       if (status === 'failed' && !settings) {
//           return <ErrorState onRetry={() => dispatch(fetchWebCheckinSettings())} error={error} />;
//       }

//       return (
//         <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
//           <form onSubmit={handleSubmit}>
//             <h2 className="text-lg font-medium text-gray-800 mb-6 border-b pb-4">Enter shift timings</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
//               <TimeInput label="Shift Start Time:" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
//               <TimeInput label="Shift End Time:" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
//             </div>
//             <div className="flex justify-start space-x-4">
//               <button
//                 type="submit"
//                 disabled={status === 'loading'}
//                 className="px-10 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 shadow-md transition-all disabled:bg-gray-400"
//               >
//                 {status === 'loading' ? 'Saving...' : 'SUBMIT'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-10 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 CANCEL
//               </button>
//             </div>
//           </form>
//         </div>
//       );
//   };

//   return (
//     <div className="w-full">
//       {/* Page Header */}
//       <header className="bg-white shadow-sm mb-8">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
//           <h1 className="text-2xl font-bold text-gray-900">Web Checkin Settings</h1>
//           <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
//             <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
//             <ChevronRight className="w-4 h-4 mx-1" />
//             <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
//             <ChevronRight className="w-4 h-4 mx-1" />
//             <span className="font-medium text-gray-800">Web Checkin Settings</span>
//           </nav>
//         </div>
//       </header>

//       {/* Main Content Area */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {renderContent()}
//       </main>
//     </div>
//   );
// };

// export default WebCheckinSettingsPage;


import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronRight, RefreshCw, ServerCrash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';

// --- Redux Imports ---
import {
  fetchWebCheckinSettings,
  updateWebCheckinSettings,
  type WebCheckinSettings,
} from '../../../store/slice/webCheckinSettingsSlice'; // Adjust path
import type { RootState, AppDispatch } from '../../../store/store'; // Adjust path

// Zod schema with cross-field validation
const settingsSchema = z.object({
    shiftStartTime: z.string().min(1, 'Start time is required.'),
    shiftEndTime: z.string().min(1, 'End time is required.'),
}).refine(data => data.shiftStartTime < data.shiftEndTime, {
    message: "Start time must be before the end time.",
    path: ["shiftEndTime"],
});

// --- UI State Components ---
const FormSkeleton: React.FC = () => (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-md w-full"></div>
            </div>
            <div>
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded-md w-full"></div>
            </div>
        </div>
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
    <div className="text-center py-10 px-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl">
        <ServerCrash className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-semibold text-red-800">Failed to Load Settings</h3>
        <p className="mt-1 text-sm text-red-600">{error || 'An unknown error occurred.'}</p>
        <div className="mt-6">
            <button type="button" onClick={onRetry} className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                Try Again
            </button>
        </div>
    </div>
);

// --- Reusable Time Input Component ---
const TimeInput: React.FC<{
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}> = ({ label, value, name, onChange, disabled }) => (
  <div className="relative">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={name}
      name={name}
      type="time"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100"
    />
  </div>
);

// --- Main Page Component ---
const WebCheckinSettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data: settings, status, error } = useSelector((state: RootState) => state.webCheckinSettings);

  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('19:00');
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchWebCheckinSettings());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (settings) {
      setStartTime(settings.shiftStartTime);
      setEndTime(settings.shiftEndTime);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationResult = settingsSchema.safeParse({
        shiftStartTime: startTime,
        shiftEndTime: endTime,
    });

    if (!validationResult.success) {
        setErrors(validationResult.error.flatten().fieldErrors);
        toast.error('Please fix the errors in the form.');
        return;
    }

    setIsSubmitting(true);
    const updatedSettings: WebCheckinSettings = validationResult.data;
    
    const promise = dispatch(updateWebCheckinSettings(updatedSettings)).unwrap();

    try {
        await toast.promise(promise, {
            loading: 'Updating settings...',
            success: (result) => result.message || 'Settings updated successfully!',
            error: (err) => err.message || 'Failed to update settings.',
        });
    } catch (error) {
        // Error is handled by toast.promise
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/getting-started');
  };

  const renderContent = () => {
      if ((status === 'loading' || status === 'idle') && !settings) {
          return <FormSkeleton />;
      }
      if (status === 'failed' && !settings) {
          return <ErrorState onRetry={() => dispatch(fetchWebCheckinSettings())} error={error} />;
      }

      return (
        <div className="bg-white p-8 rounded-lg shadow-md border max-w-2xl">
          <form noValidate onSubmit={handleSubmit}>
            <h2 className="text-lg font-medium text-gray-800 mb-6 border-b pb-4">Enter shift timings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <TimeInput label="Shift Start Time:" name="shiftStartTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} disabled={isSubmitting} />
                {errors.shiftStartTime && <p className="text-xs text-red-500 mt-1">{errors.shiftStartTime[0]}</p>}
              </div>
              <div>
                <TimeInput label="Shift End Time:" name="shiftEndTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} disabled={isSubmitting} />
                {errors.shiftEndTime && <p className="text-xs text-red-500 mt-1">{errors.shiftEndTime[0]}</p>}
              </div>
            </div>
            <div className="flex justify-start space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 py-2.5 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 shadow-sm transition-all disabled:bg-purple-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'SUBMIT'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-10 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      );
  };

  return (
    // ✨ This structure has been restored to match your original layout
    <div className="w-full">
      <Toaster position="top-center" />
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Web Checkin Settings</h1>
          <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
            <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-medium text-gray-800">Web Checkin Settings</span>
          </nav>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default WebCheckinSettingsPage;