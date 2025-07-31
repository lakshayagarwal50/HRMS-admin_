import React from 'react';
import { Eye } from 'lucide-react';
import type { Event } from '../../types/index';

interface EventsCardProps {
  events: Event[];
}

const EventsCard: React.FC<EventsCardProps> = ({ events }) => (
  // The card is now a flex container with a fixed height to ensure a stable UI.
  // - `flex flex-col` arranges the title and list vertically.
  // - `h-[29rem]` gives the card a consistent height, matching the notification card.
  <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[29rem]">
    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">Current Events</h2>
    
    {/* This container will grow to fill the remaining space and scroll internally.
      - `flex-grow` allows it to expand.
      - `overflow-y-auto` adds a vertical scrollbar only when the content overflows.
    */}
    <div className="scroll-container flex-grow overflow-y-auto">
      {events.map((event, index) => (
        <div
          key={event.id}
          className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 ${
            index < events.length - 1 ? 'border-b border-gray-200' : ''
          }`}
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{event.title}</p>
            <p className="text-xs text-gray-500">{event.description}</p>
          </div>
          <a href="#" className="text-[#3C00F2] hover:text-[#2a008f] flex items-center space-x-1">
            <Eye size={16} />
            <span className="text-sm">View</span>
          </a>
        </div>
      ))}
    </div>
  </div>
);

export default EventsCard;