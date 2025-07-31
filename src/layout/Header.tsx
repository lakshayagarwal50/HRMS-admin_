// src/components/layout/Header.tsx
import React from 'react';
import { Bell, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    // I've cleaned up the className here for correctness.
    <header className="bg-white shadow-sm fixed top-0 right-0 z-30 w-full lg:w-[calc(100%-18rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-17">
        <div className="flex items-center space-x-4">
          {/* The button is now relative to position the notification dot */}
          <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
            <span className="sr-only">View notifications</span>
            <Bell size={20} />
            {/* This span creates the notification dot in the top-right corner of the button */}
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true"></span>
          </button>
          
          {/* Profile section */}
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="text-[#8A2BE2]" size={20} />
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-800">Full name</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
