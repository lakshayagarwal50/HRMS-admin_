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




// src/components/layout/Header.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell, User as UserIcon, LogOut } from 'lucide-react';

// Define a type for the user data based on the API response
interface User {
  uid: string;
  displayName: string;
  role: string;
}

const Header: React.FC = () => {
  // State for user data, authentication, loading, and errors
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
        // Clear potentially corrupted storage
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Function to fetch user data by logging in
  const performLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://172.50.5.116:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: "Admin@superadmin.com",
          password: "admin011"
        }),
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
      
      // Update component state
      setUser(fetchedUser);
      setIsAuthenticated(true);

      // Persist session to localStorage
      localStorage.setItem('user', JSON.stringify(fetchedUser));
      localStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }

    } catch (e: any) {
      setError(e.message || "Failed to log in. Please try again.");
      setIsAuthenticated(false);
      setUser(null);
      // Clear any stale data from storage on failure
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout action
  const handleLogout = () => {
    // Clear component state
    setUser(null);
    setIsAuthenticated(false);
    setIsDropdownOpen(false);

    // Clear session from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <header className="bg-white shadow-sm fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-16">
            <p className="text-gray-500 animate-pulse">Loading...</p>
         </div>
      </header>
    );
  }

  // Handle error or logged-out state
  if (!isAuthenticated) {
    return (
        <div className="p-4 bg-gray-100 text-center">
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <p className="text-gray-700">You are not logged in.</p>
            <button 
                onClick={performLogin} 
                className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
                Login as Admin
            </button>
        </div>
    );
  }

  // Render the header when authenticated
  return (
    <header className="bg-white shadow-sm fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-17">
        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
            <span className="sr-only">View notifications</span>
            <Bell size={22} />
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true"></span>
          </button>
          
          {/* Profile Section with Dropdown */}
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

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-semibold">{user?.displayName || 'Welcome'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.role || 'User Role'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

