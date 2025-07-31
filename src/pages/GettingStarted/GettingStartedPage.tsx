import React from 'react';
// 1. Import the Link component from react-router-dom
import { Link } from 'react-router-dom';
import {
  Clock,
  FileText,
  MapPin,
  GitBranch,
  UserCheck,
  Tag,
  Settings,
  Calendar,
  Building,
  ListOrdered,
  CreditCard,
  Globe,
} from 'lucide-react';


interface CardItem {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  // The link property already exists, which is great!
  link?: string;
}

const cardItems: CardItem[] = [
  { label: 'Working Patterns', icon: Clock },
  { label: 'Payslip Components', icon: FileText },
  { label: 'Location', icon: MapPin },
  // This item has the link we will use for navigation
  { label: 'Department', icon: GitBranch , link: '/department'},
  { label: 'Designation', icon: UserCheck , link: '/designation'},
  { label: 'Role', icon: Tag , link: "/role"},
  { label: 'Holiday Configuration', icon: Settings },
  { label: 'Holiday Calendar', icon: Calendar },
  { label: 'Organisation Setting', icon: Building },
  { label: 'Sequence Number', icon: ListOrdered },
  { label: 'Payroll Configuration', icon: CreditCard },
  { label: 'Web Checkin Setting', icon: Globe },
];

const GettingStartedPge: React.FC = () => {
  return (
    <div className="bg-gray-50 font-sans min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                  Home
                </a>
              </li>
              <li>
                <span className="text-sm text-gray-500">/</span>
              </li>
              <li>
                <span className="text-sm text-gray-900 font-medium">Getting Started</span>
              </li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 ">
          {cardItems.map((item, index) => {
            // 2. Conditionally wrap the card in a Link if item.link exists
            const cardContent = (
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200 border border-gray-300 h-full">
                <div className="flex-shrink-0 bg-white p-2 rounded-md">
                  <item.icon className="text-[#8A2BE2]" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-normal text-gray-900">{item.label}</h3>
                </div>
              </div>
            );

            if (item.link) {
              return (
                <Link to={item.link} key={index}>
                  {cardContent}
                </Link>
              );
            }

            return <div key={index}>{cardContent}</div>;
          })}
        </div>
      </main>
    </div>
  );
};

export default GettingStartedPge;
