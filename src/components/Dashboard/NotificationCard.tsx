
import React, { useEffect } from 'react';
import { User, ServerCrash, RefreshCw } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'; // 1. Import Link
import type { AppDispatch, RootState } from '../../store/store';
import { fetchNotifications, type Notification } from '../../store/slice/notificationSlice';

// --- UI State Components ---
const SkeletonLoader: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
    <div className="text-center py-10 px-4">
        <ServerCrash className="mx-auto h-10 w-10 text-red-400" />
        <h3 className="mt-2 text-md font-semibold text-red-800">Could not load notifications</h3>
        <p className="mt-1 text-xs text-red-600">{error || 'An unknown error occurred.'}</p>
        <button type="button" onClick={onRetry} className="mt-4 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
            <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
            Try Again
        </button>
    </div>
);

// --- MAIN COMPONENT ---
const NotificationCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: notifications, status, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNotifications({ page: 1, limit: 5 }));
    }
  }, [status, dispatch]);

  // 2. Helper function to determine the correct link for a notification
  const getNotificationLink = (notification: Notification): string => {
    switch (notification.type.toLowerCase()) {
      case 'leave':
        return `/leave/request`;
      case 'loan':
        return `/loanandadvance`; // Corrected route
      default:
        // Fallback to a generic employee detail page if type is unknown
        return `/employees/list/detail`;
    }
  };

  const renderContent = () => {
    if (status === 'loading' || status === 'idle') {
        return <SkeletonLoader />;
    }
    if (status === 'failed') {
        return <ErrorState onRetry={() => dispatch(fetchNotifications({ page: 1, limit: 5 }))} error={error} />;
    }
    if (status === 'succeeded' && notifications.length === 0) {
        return <div className="text-center py-10 text-gray-500 text-sm">No pending notifications.</div>;
    }
    return (
        notifications.map((notif, index) => (
            // 3. Each notification is now wrapped in a dynamic Link
            <Link
              to={getNotificationLink(notif)}
              key={notif.id}
              className={`flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors duration-200 ${
                index < notifications.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-300">
                <User className="text-purple-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 capitalize">{notif.type} Request</p>
                <p className="text-xs text-gray-500">Requested By: {notif.name}</p>
                <p className="text-xs text-gray-500">Time: {new Date(notif.date).toLocaleString()}</p>
                <p className="text-xs text-blue-500">Status: {notif.status}</p>
              </div>
            </Link>
        ))
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[29rem]">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Pending Notifications</h2>
      <div className="scroll-container flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default NotificationCard;


