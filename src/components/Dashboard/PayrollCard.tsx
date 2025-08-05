import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, type ChartOptions, } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { PayrollEntry } from '../../types/index';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PayrollCardProps {
  payrollData: PayrollEntry[];
}

const PayrollCard: React.FC<PayrollCardProps> = ({ payrollData }) => {
  const [showGraph, setShowGraph] = useState(false);

  const chartData = {
    labels: payrollData.map(p => p.month).reverse(),
    datasets: [
      {
        label: 'Total Gross',
        data: payrollData.map(p => p.totalGross).reverse(),
        backgroundColor: '#0ea5e9',
      },
      {
        label: 'Total Net',
        data: payrollData.map(p => p.totalNet).reverse(),
        backgroundColor: '#22c55e',
      },
    ],
  };
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Payroll Overview' },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Last 5 Payroll</h2>
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
            <div>Status</div>
            <div>Total Gross</div>
            <div>Total Net</div>
          </div>
          {payrollData.map((item, index) => (
            <div key={index} className={`grid grid-cols-4 gap-4 py-2 text-sm ${index < payrollData.length - 1 ? 'border-b border-gray-200' : ''}`}>
              <div>{item.month}</div>
              <div className={item.status === 'Closed' ? 'text-green-600' : 'text-blue-600'}>{item.status}</div>
              <div>₹{item.totalGross.toLocaleString()}</div>
              <div>₹{item.totalNet.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayrollCard;