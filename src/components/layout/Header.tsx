// src/components/layout/Header.tsx
import { useDispatch } from 'react-redux';
import { logout } from '../../services';
import { setUser } from '../../features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logout();
    dispatch(setUser(null));
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Employee Payroll System</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;