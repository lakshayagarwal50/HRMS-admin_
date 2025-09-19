// import React, { useEffect, type ReactNode } from 'react';
// import { X } from 'lucide-react';


// interface SidePanelFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: ReactNode;
//   onSubmit: (e: React.FormEvent) => void;
//   submitText?: string;
// }

// const SidePanelForm: React.FC<SidePanelFormProps> = ({
//   isOpen,
//   onClose,
//   title,
//   children,
//   onSubmit,
//   submitText = 'Submit',
// }) => {
  
//   useEffect(() => {
//     const handleEsc = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         onClose();
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [onClose]);

//   return (
//     <>
      
//       <div
//         className={`fixed inset-0 bg-black/60 bg-opacity-50 z-40 transition-opacity duration-300 ${
//           isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
//         }`}
//         onClick={onClose}
//       ></div>

      
//       <div
//         className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         <form onSubmit={onSubmit} className="h-full flex flex-col">
          
//           <div className="flex justify-between items-center p-4 border-b">
//             <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//             <button
//               type="button"
//               onClick={onClose}
//               className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600"
//             >
//               <X size={18} />
//             </button>
//           </div>

        
//           <div className="flex-1 p-6 overflow-y-auto">
//             {children}
//           </div>

//           <div className="p-4 border-t bg-gray-50 flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-md hover:from-purple-600 hover:to-indigo-700"
//             >
//               {submitText}
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default SidePanelForm;

import React, { useEffect, type ReactNode } from 'react';
import { X, RefreshCw } from 'lucide-react'; // 1. Import a loading icon

// --- PROPS DEFINITION ---
interface SidePanelFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  isSubmitting?: boolean; // 2. Add a new prop to handle the loading state
}

const SidePanelForm: React.FC<SidePanelFormProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Submit',
  isSubmitting = false, // 3. Default to not submitting
}) => {
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <form onSubmit={onSubmit} className="h-full flex flex-col">
          
          <header className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600"
            >
              <X size={18} />
            </button>
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>

          {/* --- THIS IS THE UPDATED PART --- */}
          <footer className="p-4 border-t bg-gray-50 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting} // The Cancel button is now disabled during submission
              className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting} // The Submit button is also disabled
              className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center"
            >
              {/* Show a spinning icon when submitting */}
              {isSubmitting && <RefreshCw className="animate-spin -ml-1 mr-2" size={16} />}
              {isSubmitting ? 'Submitting...' : submitText}
            </button>
          </footer>
        </form>
      </div>
    </>
  );
};

export default SidePanelForm;

