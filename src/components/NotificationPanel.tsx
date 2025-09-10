import React, { useEffect } from 'react';
import { User, ServerCrash, RefreshCw, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import type { AppDispatch, RootState } from '../store/store';
import { fetchNotifications, type Notification } from '../store/slice/notificationSlice';

// --- PROPS DEFINITION ---
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- UI State Components ---
const SkeletonLoader: React.FC = () => (
    <div className="space-y-3 animate-pulse p-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
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
const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: notifications, status, error } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    // Fetch notifications only when the panel is open and they haven't been fetched yet.
    if (isOpen && status === 'idle') {
      dispatch(fetchNotifications({ page: 1, limit: 10 })); // Fetch more for the panel
    }
  }, [isOpen, status, dispatch]);

  const getNotificationLink = (notification: Notification): string => {
    // const highlightQuery = `?highlight=${notification.id}`;
    switch (notification.type.toLowerCase()) {
      case 'leave':
        return `/leave/request`;
      case 'loan':
        return `/loanandadvance`;
      default:
        return `/employees/list/detail/${notification.empId}/${notification.id}`;
    }
  };

  const renderContent = () => {
    if (status === 'loading' || status === 'idle') {
        return <SkeletonLoader />;
    }
    if (status === 'failed') {
        return <ErrorState onRetry={() => dispatch(fetchNotifications({ page: 1, limit: 10 }))} error={error} />;
    }
    if (status === 'succeeded' && notifications.length === 0) {
        return <div className="text-center py-20 text-gray-500 text-sm">No pending notifications.</div>;
    }
    return (
        notifications.map((notif) => (
            <Link
              to={getNotificationLink(notif)}
              key={notif.id}
              onClick={onClose} // Close panel on click
              className="block p-4 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-300">
                  <User className="text-purple-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">{notif.type} Request</p>
                  <p className="text-xs text-gray-500">Requested By: {notif.name}</p>
                  <p className="text-xs text-gray-500">Time: {new Date(notif.date).toLocaleString()}</p>
                </div>
              </div>
            </Link>
        ))
    );
  };

  return (
     <>
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
      >
        <div className="h-full flex flex-col">
          <header className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-200"
            >
              <X size={20} />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
