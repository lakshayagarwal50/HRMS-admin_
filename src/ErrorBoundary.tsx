// // src/ErrorBoundary.tsx
// import React, { Component, type ReactNode, type ErrorInfo } from 'react';

// interface ErrorBoundaryState {
//   hasError: boolean;
// }

// interface ErrorBoundaryProps {
//   children: ReactNode;
// }

// class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
//   public state: ErrorBoundaryState = {
//     hasError: false,
//   };

//   public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
//     // Update state so the next render will show the fallback UI.
//     return { hasError: true };
//   }

//   public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
//     // You can also log the error to an error reporting service
//     console.error('Uncaught error:', error, errorInfo);
//   }

//   public render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       return <h1>Sorry.. there was an error</h1>;
//     }

//     return this.props.children;
//   }
// }

// export default ErrorBoundary;

// src/ErrorBoundary.tsx
import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from './store/hooks'; // Adjust path if needed
import { logoutUser } from './features/auth/authSlice'; // Adjust path if needed
import { ServerCrash, RotateCw } from 'lucide-react';

// --- UI Component for the Error Fallback ---
// We create a functional component to use React hooks (useNavigate, useDispatch).
const ErrorFallbackUI: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
      // If logout fails, force redirect to login
      navigate('/login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-50">
      <div className="w-full max-w-md p-8 text-center bg-white rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <ServerCrash className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800">
          Oops! Something went wrong.
        </h1>
        <p className="mt-3 text-md text-gray-600">
          We're sorry, but the application has encountered an unexpected problem. Please try one of the options below.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center w-full sm:w-auto px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <RotateCw className="mr-2" size={16} />
            Refresh Page
          </button>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-5 py-3 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-colors duration-200"
          >
            Logout & Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Error Boundary Class Component ---
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Render the styled fallback UI
      return <ErrorFallbackUI />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;