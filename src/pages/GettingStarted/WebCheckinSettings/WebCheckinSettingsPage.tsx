import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Reusable Time Input Component ---
const TimeInput: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, onChange }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="time"
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
    />
  </div>
);

// --- Main Page Component ---
const WebCheckinSettingsPage: React.FC = () => {
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('19:00');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = { startTime, endTime };
    console.log('Submitting Web Checkin Settings:', settings);
    // Add your API call logic here
  };

  const handleCancel = () => {
    navigate('/getting-started');
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <header className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Web Checkin Settings</h1>
          <nav aria-label="Breadcrumb" className="mt-1 flex items-center text-sm text-gray-500">
            <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
            <ChevronRight className="w-4 h-4 mx-1" />
            <a href="/getting-started" className="hover:text-gray-700">Getting Started</a>
            <ChevronRight className="w-4 h-4 mx-1" />
            <span className="font-medium text-gray-800">Web Checkin Settings</span>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-medium text-gray-800 mb-6 border-b pb-4">Enter shift timings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <TimeInput label="Shift Start Time:" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              <TimeInput label="Shift End Time:" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
            <div className="flex justify-start space-x-4">
              <button
                type="submit"
                className="px-10 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 shadow-md transition-all"
              >
                SUBMIT
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-10 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default WebCheckinSettingsPage;
