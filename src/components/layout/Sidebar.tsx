import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
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
} from 'lucide-react';
import { auth } from '../../services/firebase/auth';
 // Ensure this path is correct

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  subItems?: string[];
  link?: string;
}

const menuItems: MenuItem[] = [
    { label: 'Getting Started', icon: Rocket, link: '/getting-started' },
    { label: 'Dashboard', icon: LayoutDashboard, link: '/' },
    {
      label: 'Employee Setup',
      icon: Users,
      subItems: ['List', 'Create Employee', 'Upload Employee'],
    },
    {
      label: 'Payroll',
      icon: Wallet,
      subItems: ['List', 'Crystal Employee', 'Full & Final Statement', 'Upload Form 16'],
    },
    { label: 'Payment', icon: Wallet, subItems: ['Salary', 'TDS'] },
    {
      label: 'Leave Configuration',
      icon: Calendar,
      subItems: ['Leave Setup', 'Employee Leave Request'],
    },
    { label: 'Attendance', icon: Clock, subItems: ['Summary', 'Upload Attendance'] },
    { label: 'DSR', icon: BarChart, link: '#' },
    { label: 'Project', icon: Briefcase, link: '#' },
    {
      label: 'Rating',
      icon: Star,
      subItems: ['Rating', 'Record', 'Request', 'Criteria & Scale'],
    },
    {
      label: 'Reports',
      icon: FileText,
      subItems: ['Standard', 'Statutory', 'Audit History'],
    },
    { label: 'Logout', icon: LogOut, link: '#' },
];


const Sidebar: React.FC = () => {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    if (!menuItems.find((item) => item.label === label)?.subItems) {
      setIsSidebarOpen(false); 
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };


  return (
    <>
      <style>
        {`
          .icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            line-height: 1;
          }
          .icon-container svg {
            display: block;
            margin: auto;
            vertical-align: middle;
          }
        `}
      </style>

      {/* Mobile Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-[#8A2BE2] text-white rounded-md flex items-center justify-center"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
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
            {menuItems.map((item, index) => (
              <li key={index} className="mb-1">
                {item.label === 'Logout' ? (
                   <button
                    onClick={handleLogout}
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50`}
                  >
                    <span
                      className={`icon-container rounded-md flex items-center justify-center mr-3 transition-colors duration-200 bg-white text-[#4B5563] hover:bg-[#8A2BE2] hover:text-white`}
                    >
                      <item.icon size={20} />
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ) : item.subItems ? (
                  <>
                    <button
                      onClick={() => {
                        toggleDropdown(item.label);
                        handleItemClick(item.label);
                      }}
                      className="flex items-center w-full p-3 text-gray-700 rounded-lg transition-all duration-200 hover:bg-purple-100 hover:translate-x-1"
                    >
                      <span
                        className={`icon-container rounded-md flex items-center justify-center mr-3 transition-colors duration-200 ${
                          activeItem === item.label
                            ? 'bg-[#8A2BE2] text-white'
                            : 'bg-white text-[#4B5563]'
                        } hover:bg-[#8A2BE2] hover:text-white`}
                      >
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
                      className={`pl-12 pr-3 text-sm overflow-hidden transition-all duration-300 ${
                        openDropdowns[item.label] ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href="#"
                            className="block p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                            onClick={() => {
                              setIsSidebarOpen(false);
                              setActiveItem(subItem);
                            }}
                          >
                            {subItem}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a
                    href={item.link}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 text-gray-700 hover:bg-purple-100 hover:translate-x-1`}
                    onClick={() => handleItemClick(item.label)}
                  >
                    <span
                      className={`icon-container rounded-md flex items-center justify-center mr-3 transition-colors duration-200 ${
                        activeItem === item.label
                          ? 'bg-[#8A2BE2] text-white'
                          : 'bg-white text-[#4B5563]'
                      } hover:bg-[#8A2BE2] hover:text-white`}
                    >
                      <item.icon size={20} />
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;