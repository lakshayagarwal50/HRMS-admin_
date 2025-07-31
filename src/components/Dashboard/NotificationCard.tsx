import React from 'react';
import { User } from 'lucide-react';
import type { Notification } from '../../types/index';

interface NotificationCardProps {
  notifications: Notification[];
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notifications }) => (
  // The card is now a flex container with a fixed height.
  // - `flex flex-col` arranges children (title and list) vertically.
  // - `h-[29rem]` gives the card a consistent height, enough for the header and ~5 list items.
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[29rem]">
    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Pending Notifications</h2>
    
    {/* This container will grow to fill the available space and scroll internally.
      - `flex-grow` makes it expand.
      - `overflow-y-auto` adds the scrollbar when needed.
    */}
    <div className="scroll-container flex-grow overflow-y-auto">
      {notifications.map((notif, index) => (
        <div
          key={notif.id}
          className={`flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors duration-200 ${
            index < notifications.length - 1 ? 'border-b border-gray-200' : ''
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-300">
            <User className="text-[#8A2BE2]" size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{notif.name}</p>
            <p className="text-xs text-gray-500">Requested By: {notif.requestedBy}</p>
            <p className="text-xs text-gray-500">Time: {notif.time}</p>
            <p className="text-xs text-[#0ea5e9]">Leave Status: {notif.status}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default NotificationCard;