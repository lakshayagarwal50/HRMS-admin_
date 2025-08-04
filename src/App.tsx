// src/App.tsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { checkAuthStatus } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  // This useEffect will run only once when the application first loads.
  useEffect(() => {
    // We dispatch the action to check if a token and user exist in localStorage.
    // If they do, our slice will update the state to be authenticated.
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;