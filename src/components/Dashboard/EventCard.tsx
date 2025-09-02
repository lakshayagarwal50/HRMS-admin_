import React, { useState, useEffect } from 'react';
import { Eye, ServerCrash, RefreshCw, ArrowLeft } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchEvents, type Event } from '../../store/slice/eventsSlice';

// --- UI State Components ---
const SkeletonLoader: React.FC = () => (
    <div className="space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
            </div>
        ))}
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void; error: string | null }> = ({ onRetry, error }) => (
    <div className="text-center py-10 px-4">
        <ServerCrash className="mx-auto h-10 w-10 text-red-400" />
        <h3 className="mt-2 text-md font-semibold text-red-800">Could not load events</h3>
        <p className="mt-1 text-xs text-red-600">{error || 'An unknown error occurred.'}</p>
        <button type="button" onClick={onRetry} className="mt-4 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
            <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
            Try Again
        </button>
    </div>
);

// --- New Detail View Component ---
const EventDetailView: React.FC<{ event: Event; onBack: () => void }> = ({ event, onBack }) => (
  <div>
    <button onClick={onBack} className="flex items-center text-sm text-purple-600 hover:underline mb-4 font-medium">
      <ArrowLeft size={16} className="mr-2" />
      Back to all events
    </button>
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-800">{event.description}</h3>
      <p className="text-sm text-gray-500 mt-1">Date: {event.date}</p>
      <div className="mt-4 text-sm text-gray-600 space-y-2">
         <p>This is where additional details for the event would be displayed.</p>
         <p>Created On: {new Date(event.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  </div>
);


// --- MAIN COMPONENT ---
const EventsCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: events, status, error } = useSelector((state: RootState) => state.events);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents({ page: 1, limit: 10 }));
    }
  }, [status, dispatch]);

  const handleViewDetails = (event: Event) => {
      setSelectedEvent(event);
  };

  const handleBackToList = () => {
      setSelectedEvent(null);
  };

  const renderContent = () => {
    if (status === 'loading' || status === 'idle') {
        return <SkeletonLoader />;
    }
    if (status === 'failed') {
        return <ErrorState onRetry={() => dispatch(fetchEvents({ page: 1, limit: 10 }))} error={error} />;
    }
    
    // If an event is selected, show the detail view
    if (selectedEvent) {
        return <EventDetailView event={selectedEvent} onBack={handleBackToList} />;
    }

    if (status === 'succeeded' && events.length === 0) {
        return <div className="text-center py-10 text-gray-500 text-sm">No current events.</div>;
    }
    
    // Otherwise, show the list of events
    return (
        events.map((event, index) => (
            <div
              key={event.id}
              className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 ${
                index < events.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{event.description}</p>
                <p className="text-xs text-gray-500">{event.date}</p>
              </div>
              <button 
                onClick={() => handleViewDetails(event)} 
                className="text-purple-600 hover:text-purple-800 flex items-center space-x-1 flex-shrink-0"
              >
                <Eye size={16} />
                <span className="text-sm">View</span>
              </button>
            </div>
        ))
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[29rem]">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex-shrink-0">
        {selectedEvent ? 'Event Detail' : 'Current Events'}
      </h2>
      <div className="scroll-container flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default EventsCard;
