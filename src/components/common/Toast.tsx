import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
  const Icon = isSuccess ? CheckCircle : XCircle;
  const iconColor = isSuccess ? 'text-green-500' : 'text-red-500';

  return (
    <div className={`fixed top-5 right-5 z-50 w-full max-w-sm rounded-md shadow-lg border-l-4 ${borderColor} ${bgColor}`}>
        <div className="p-4 flex items-start">
            <Icon className={`h-6 w-6 ${iconColor} mr-3`} />
            <div className="flex-1">
                <p className="font-bold text-gray-800">{isSuccess ? 'Success' : 'Error'}</p>
                <p className="text-sm text-gray-600">{message}</p>
            </div>
            <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-gray-200">
                <X className="h-5 w-5 text-gray-500" />
            </button>
        </div>
    </div>
  );
};

export default Toast;
