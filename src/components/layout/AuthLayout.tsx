// src/components/layout/AuthLayout.tsx
import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <Outlet />
  </div>
);

export default AuthLayout;