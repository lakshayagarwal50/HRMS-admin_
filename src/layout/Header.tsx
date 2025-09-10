// import React, { useState, useEffect, useRef } from 'react';
// import { Bell, User as UserIcon,  } from 'lucide-react';
// import { useSelector } from 'react-redux';


// const HeaderSkeleton: React.FC = () => (
//     <header className="bg-white shadow-sm fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)]">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-16">
//             <div className="flex items-center space-x-4 animate-pulse">
//                 <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
//                 <div className="h-9 w-32 bg-gray-200 rounded-full"></div>
//             </div>
//         </div>
//     </header>
// );


// const LoginPrompt: React.FC<{ onLogin: () => void; error: string | null; isLoading: boolean }> = ({ onLogin, error, isLoading }) => (
//     <div className="flex items-center justify-center h-screen bg-gray-50">
//         <div className="p-8 bg-white rounded-lg shadow-md text-center">
//             <h2 className="text-xl font-bold text-gray-800">Authentication Required</h2>
//             <p className="text-gray-600 mt-2">Please log in to access the application.</p>
//             {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
//             <button 
//                 onClick={onLogin} 
//                 disabled={isLoading}
//                 className="mt-6 w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400"
//             >
//                 {isLoading ? 'Logging in...' : 'Login as Admin'}
//             </button>
//         </div>
//     </div>
// );


// const Header: React.FC = () => {
//   const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   //
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   if (isLoading) {
//     return <HeaderSkeleton />;
//   }

//   if (!isAuthenticated) {
//     // Note: This login prompt will take over the whole screen. 
//     // This is often desired for a locked-down application.
//     return <LoginPrompt onLogin={performLogin} error={error} isLoading={isLoading} />;
//   }

//   return (
//     <header className="bg-white shadow-sm fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-17">
//         <div className="flex items-center space-x-4">
//           <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
//             <Bell size={22} />
//             <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
//           </button>
          
//           <div className="relative" ref={dropdownRef}>
//             <button 
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//             >
//               <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
//                 <UserIcon className="text-purple-600" size={20} />
//               </div>
//               <span className="hidden sm:inline text-sm font-medium text-gray-800">
//                 {user?.displayName || 'User'}
//               </span>
//             </button>

//             {/* Dropdown Menu with transition */}
//             <div
//               className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 ${
//                 isDropdownOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'
//               }`}
//             >
//                 <div className="py-1">
//                     <div className="px-4 py-2 text-sm text-gray-700 border-b">
//                         <p className="font-semibold">{user?.displayName || 'Welcome'}</p>
//                         <p className="text-xs text-gray-500 truncate">{user?.role || 'User Role'}</p>
//                     </div>
//                     {/* The Logout button has been intentionally removed as requested. */}
//                 </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


import React, { useState, useEffect, useRef } from 'react';
import { Bell, User as UserIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';

// --- Component & Redux Imports ---
import type { AppDispatch, RootState } from '../store/store';
import { checkAuthStatus, loginUser } from '../features/auth/authSlice';
import NotificationPanel from '../components/NotificationPanel'; // 1. Import the NotificationPanel

// --- UI State Components ---
const HeaderSkeleton: React.FC = () => (
    <header className="bg-white shadow-sm fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-16">
            <div className="flex items-center space-x-4 animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                <div className="h-9 w-32 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    </header>
);

const LoginPrompt: React.FC<{ onLogin: () => void; error: string | null; isLoading: boolean }> = ({ onLogin, error, isLoading }) => (
    <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-800">Authentication Required</h2>
            <p className="text-gray-600 mt-2">Please log in to access the application.</p>
            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            <button 
                onClick={onLogin} 
                disabled={isLoading}
                className="mt-6 w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-400"
            >
                {isLoading ? 'Logging in...' : 'Login as Admin'}
            </button>
        </div>
    </div>
);


const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false); // 2. Add state for the panel
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  const performLogin = () => {
    dispatch(loginUser({ email: "Admin@superadmin.com", password: "admin011" }));
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  if (!isAuthenticated) {
    return <LoginPrompt onLogin={performLogin} error={error} isLoading={isLoading} />;
  }

  return (
    <>
      <header className="bg-white shadow-sm fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-17">
          <div className="flex items-center space-x-4">
            {/* 3. This button now opens the notification panel */}
            <button 
              onClick={() => setIsNotificationPanelOpen(true)}
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                  <UserIcon className="text-purple-600" size={20} />
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-800">
                  {user?.displayName || 'User'}
                </span>
              </button>

              <div
                className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 ${
                  isDropdownOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95 pointer-events-none'
                }`}
              >
                  <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                          <p className="font-semibold">{user?.displayName || 'Welcome'}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.role || 'User Role'}</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* 4. Render the notification panel */}
      <NotificationPanel 
        isOpen={isNotificationPanelOpen} 
        onClose={() => setIsNotificationPanelOpen(false)} 
      />
    </>
  );
};

export default Header;


