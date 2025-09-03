// // src/components/layout/Header.tsx
// import React from 'react';
// import { Bell, User } from 'lucide-react';

// const Header: React.FC = () => {
//   return (
//     // I've cleaned up the className here for correctness.
//     <header className="bg-white shadow-sm fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-17">
//         <div className="flex items-center space-x-4">
//           {/* The button is now relative to position the notification dot */}
//           <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
//             <span className="sr-only">View notifications</span>
//             <Bell size={20} />
//             {/* This span creates the notification dot in the top-right corner of the button */}
//             <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true"></span>
//           </button>
          
//           {/* Profile section */}
//           <div className="flex items-center space-x-2">
//             <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
//               <User className="text-[#8A2BE2]" size={20} />
//             </div>
//             <span className="hidden sm:inline text-sm font-medium text-gray-800">Full name</span>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect, useRef } from 'react';
import { Bell, User as UserIcon } from 'lucide-react';

// Define a type for the user data based on the API response
interface User {
  uid: string;
  displayName: string;
  role: string;
}

// --- UI State Components ---

// A more professional skeleton loader for the header
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

// A styled login prompt for the unauthenticated state
const LoginPrompt: React.FC<{ onLogin: () => void; error: string | null; isLoading: boolean }> = ({ onLogin, error, isLoading }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-800">Welcome</h2>
            <p className="text-gray-600 mt-2">Please log in to continue.</p>
            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            <button 
                onClick={onLogin} 
                disabled={isLoading}
                className="mt-6 w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300"
            >
                {isLoading ? 'Logging in...' : 'Login as Admin'}
            </button>
        </div>
    </div>
);


const Header: React.FC = () => {
  // State for user data, authentication, loading, and errors
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to manage the visibility of the profile dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check for existing session in localStorage on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Function to fetch user data by logging in
  const performLogin = async () => {
    setIsLoginLoading(true);
    setError(null);
    try {
      const response = await fetch('http://172.50.5.116:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: "Admin@superadmin.com", password: "admin011" }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      const fetchedUser: User = {
        uid: data.uid,
        displayName: data.displayName,
        role: data.role,
      };
      
      setUser(fetchedUser);
      setIsAuthenticated(true);

      localStorage.setItem('user', JSON.stringify(fetchedUser));
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

    } catch (e: any) {
      setError(e.message || "Failed to log in. Please try again.");
      setIsAuthenticated(false);
      setUser(null);
      localStorage.clear();
    } finally {
      setIsLoginLoading(false);
    }
  };
  
  // Close the dropdown if the user clicks outside of it
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
    return <LoginPrompt onLogin={performLogin} error={error} isLoading={isLoginLoading} />;
  }

  return (
    <header className="bg-white shadow-sm fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-17">
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <span className="sr-only">View notifications</span>
            <Bell size={22} />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true"></span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                <UserIcon className="text-purple-600" size={20} />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-800">
                {user?.displayName || 'User'}
              </span>
            </button>

            {/* Dropdown Menu with transition */}
            <div
              className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-out duration-100 ${
                isDropdownOpen ? 'transform opacity-100 scale-100' : 'transform opacity-0 scale-95'
              }`}
            >
              {isDropdownOpen && (
                <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-semibold">{user?.displayName || 'Welcome'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.role || 'User Role'}</p>
                    </div>
                    {/* The Logout button has been removed from the header */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
