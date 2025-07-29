// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-64 bg-gray-800 text-white h-screen p-4">
    <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
    <nav>
      <ul>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => `block p-2 ${isActive ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/employees" className={({ isActive }) => `block p-2 ${isActive ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
            Employees
          </NavLink>
        </li>
        <li>
          <NavLink to="/payroll" className={({ isActive }) => `block p-2 ${isActive ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
            Payroll
          </NavLink>
        </li>
      </ul>
    </nav>
  </div>
);

export default Sidebar;