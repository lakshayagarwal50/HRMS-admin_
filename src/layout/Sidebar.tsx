// src/layout/Sidebar.tsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks'; // Import the typed dispatch hook
import { logoutUser } from '../features/auth/authSlice'; // Import the logoutUser thunk
import {
  Rocket,
  LayoutDashboard,
  Users,
  Wallet,
  Calendar,
  Clock,
  BarChart,
  Briefcase,
  Star,
  FileText,
  LogOut,
  ChevronDown,
  Menu,
  X,
  HandCoins,
} from 'lucide-react';

// Define types for menu items
interface SubMenuItem {
  label: string;
  link: string;
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  subItems?: SubMenuItem[];
  link?: string;
}

const menuItems: MenuItem[] = [
    { label: 'Getting Started', icon: Rocket, link: '/getting-started' },
    { label: 'Dashboard', icon: LayoutDashboard, link: '/' },
    {
      label: 'Employee Setup',
      icon: Users,
      subItems: [
        { label: 'List', link: '/employees/list' },
        { label: 'Create Employee', link: '/employees/create' },
        { label: 'Upload Employee', link: '/employees/upload' },
      ],
    },
    {
      label: 'Payroll',
      icon: Wallet,
      subItems: [
        { label: 'List', link: '/payroll/list' },
        { label: 'Crystal Employee', link: '/payroll/crystal' },
        { label: 'Full & Final Statement', link: '/payroll/final-statement' },
        { label: 'Upload Form 16', link: '/payroll/upload-form16' },
      ],
    },
    { 
      label: 'Payment', 
      icon: Wallet, 
      subItems: [
        { label: 'Salary', link: '/payment/salary' },
        { label: 'TDS', link: '/payment/tds' },
      ] 
    },
    {
      label: 'Leave Configuration',
      icon: Calendar,
      subItems: [
        { label: 'Leave Setup', link: '/leave/setup' },
        { label: 'Employee Leave Request', link: '/leave/request' },
      ],
    },
    { 
      label: 'Attendance', 
      icon: Clock, 
      subItems: [
        { label: 'Summary', link: '/attendance/summary' },
        { label: 'Upload Attendance', link: '/attendance/upload' },
      ] 
    },
    { label: 'DSR', icon: BarChart, link: '/dsr' },
    { label: 'Projects', icon: Briefcase, link: '/projects' },
    {
      label: 'Rating',
      icon: Star,
      subItems: [
        { label: 'Rating', link: '/rating/rate' },
        { label: 'Record', link: '/rating/record' },
        { label: 'Request', link: '/rating/request' },
        { label: 'Criteria & Scale', link: '/rating/criteria' },
      ],
    },
     { label: 'Loan & Advances', icon: HandCoins, link: '/loanandandvance' },
    {
      label: 'Reports',
      icon: FileText,
      subItems: [
        { label: 'Standard', link: '/reports/standard' },
        { label: 'Statutory', link: '/reports/statutory' },
        { label: 'Audit History', link: '/reports/audit' },
      ],
    },
    { label: 'Logout', icon: LogOut },
];

const Sidebar: React.FC = () => {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Use typed dispatch

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({ [label]: !prev[label] }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Dispatch the logoutUser thunk
      navigate('/login'); // Redirect to login page after successful logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <style>{`
        .icon-container { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; line-height: 1; }
        .icon-container svg { display: block; margin: auto; vertical-align: middle; }
        .sidebar-link.active { background-color: #f3e8ff; color: #8A2BE2; font-weight: 500; }
        .sidebar-link.active .icon-container { background-color: #8A2BE2; color: white; }
        .sidebar-sublink.active { background-color: #ede9fe; color: #8A2BE2; font-weight: 500; }
      `}</style>

      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-[#8A2BE2] text-white rounded-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 w-72 bg-white shadow-xl h-screen transition-transform duration-300 transform z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4 text-center border-b border-[#8A2BE2]">
          <h1 className="text-3xl font-extrabold text-[#8A2BE2] tracking-tight">Appinventiv</h1>
        </div>
        <nav className="mt-6 px-4 overflow-y-auto h-[calc(100vh-80px)]">
          <ul>
            {menuItems.map((item) => (
              <li key={item.label} className="mb-1">
                {item.label === 'Logout' ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-red-600 hover:bg-red-50"
                  >
                    <span className="icon-container rounded-md flex items-center justify-center mr-3">
                      <item.icon size={20} />
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ) : item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center w-full p-3 text-gray-700 rounded-lg transition-colors duration-200 hover:bg-purple-100"
                    >
                      <span className="icon-container rounded-md flex items-center justify-center mr-3">
                        <item.icon size={20} />
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={`ml-auto text-gray-500 transition-transform duration-200 ${
                          openDropdowns[item.label] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <ul
                      className={`pl-10 pr-2 text-sm overflow-hidden transition-all duration-300 ${
                        openDropdowns[item.label] ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      {item.subItems.map((subItem) => (
                        <li key={subItem.link}>
                          <NavLink
                            to={subItem.link}
                            className="sidebar-sublink block p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            onClick={handleLinkClick}
                          >
                            {subItem.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <NavLink
                    to={item.link || '#'}
                    className="sidebar-link flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-gray-700 hover:bg-purple-100"
                    onClick={handleLinkClick}
                  >
                    <span className="icon-container rounded-md flex items-center justify-center mr-3">
                      <item.icon size={20} />
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;