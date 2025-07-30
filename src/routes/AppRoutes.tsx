// src/routes/AppRoutes.tsx
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
// import AuthLayout from '../components/layout/AuthLayout';
import AdminLayout from '../components/layout/AdminLayout';
import AuthLayout from '../components/layout/AuthLayout';

const Login = lazy(() => import('../features/auth/pages/Login'));
const Dashboard = lazy(() => import('../features/payroll/pages/PayrollDashboard'));
const GettingStarted = lazy (()=> import("../features/gettingstarted/pages/GettingStartedPage"));

const AppRoutes = () => (
  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/GettingStartedPage" element={<GettingStarted />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  </Suspense>
);

export default AppRoutes;