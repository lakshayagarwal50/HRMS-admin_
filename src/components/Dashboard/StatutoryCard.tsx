import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type ChartOptions, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { StatutoryEntry } from '../../types/index';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface StatutoryCardProps {
  statutoryData: StatutoryEntry[];
}

const StatutoryCard: React.FC<StatutoryCardProps> = ({ statutoryData }) => {
  const [showGraph, setShowGraph] = useState(false);

  const chartData = {
    labels: statutoryData.map(s => s.month).reverse(),
    datasets: [
      { label: "E'ee PF", data: statutoryData.map(s => s.employeePF).reverse(), backgroundColor: '#0ea5e9' },
      { label: "E'er PF", data: statutoryData.map(s => s.employerPF).reverse(), backgroundColor: '#22c55e' },
      { label: 'P.T', data: statutoryData.map(s => s.pt).reverse(), backgroundColor: '#3c00f2' },
    ],
  };
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: "Monthly Statutory Amounts" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Last 5 Month's Statutory Amount</h2>
        <button onClick={() => setShowGraph(!showGraph)} className="p-2 bg-[#8A2BE2] text-white rounded-md hover:bg-[#6b21a8] transition-colors duration-200 flex items-center space-x-2 text-sm">
          <BarChart2 size={16} />
          <span>{showGraph ? 'Table' : 'Graph'}</span>
        </button>
      </div>
      {showGraph ? (
        <Bar options={chartOptions} data={chartData} />
      ) : (
        <div>
          <div className="grid grid-cols-4 gap-4 font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-2 text-sm">
            <div>Month</div>
            <div>E'ee PF</div>
            <div>E'er PF</div>
            <div>P.T</div>
          </div>
          {statutoryData.map((item, index) => (
            <div key={index} className={`grid grid-cols-4 gap-4 py-2 text-sm ${index < statutoryData.length - 1 ? 'border-b border-gray-200' : ''}`}>
              <div>{item.month}</div>
              <div>₹{item.employeePF.toLocaleString()}</div>
              <div>₹{item.employerPF.toLocaleString()}</div>
              <div>₹{item.pt.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatutoryCard;