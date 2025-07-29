// src/components/layout/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;