// src/components/layout/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => (
  <div className="flex h-screen bg-gray-50">
    {/* The Sidebar is a fixed element */}
    <Sidebar />

    {/* Main Content Area */}
    <div className="flex-1 flex flex-col lg:ml-72">
      {/* The Header will be contained within this div */}
      <Header />

      {/* The main content area where pages will be rendered */}
      {/* It has top margin to not be hidden by the fixed header and is scrollable */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto mt-16">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;