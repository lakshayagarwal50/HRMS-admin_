import React from 'react';
import type { SummaryCardData } from '../../types/index';

const SummaryCard: React.FC<SummaryCardData> = ({ icon: Icon, iconColor, title, value }) => (
  <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:shadow-lg transition-shadow duration-200">
    <div className="flex-shrink-0 bg-white p-2 rounded-md border border-gray-200">
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <h3 className="text-base font-normal text-gray-900">{title}</h3>
      <p className="text-xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default SummaryCard;