import React from 'react';
import { HardHat } from 'lucide-react';

const ComingSoon: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center p-8 rounded-lg">
      <HardHat className="w-24 h-24 text-purple-400 mb-6" strokeWidth={1} />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Coming Soon!</h1>
      <p className="text-lg text-gray-600">
        This page is under construction. We're working hard to bring it to you.
      </p>
    </div>
  );
};

export default ComingSoon;