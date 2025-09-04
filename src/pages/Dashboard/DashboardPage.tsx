

// Import Types
import EventsCard from "../../components/Dashboard/EventCard";
import NotificationCard from "../../components/Dashboard/NotificationCard";
import PayrollCard from "../../components/Dashboard/PayrollCard";
import StatutoryCard from "../../components/Dashboard/StatutoryCard";
import SummaryCard from "../../components/Dashboard/SummaryCard";
import type { SummaryCardData, Notification, Event, PayrollEntry, StatutoryEntry } from "../../types/index";
import type { AppDispatch, RootState } from '../../store/store';
import { fetchDashboardCounts } from '../../store/slice/dashboardSlice';
import { Users, FileText, Landmark, Wallet } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";


const notifications: Notification[] = [];

const currentEvents: Event[] = [];

const payrollData: PayrollEntry[] = [
  { month: 'Jul 2025', status: 'Draft', totalGross: 500000, totalNet: 420000 },
  { month: 'Jun 2025', status: 'Closed', totalGross: 480000, totalNet: 400000 },
  { month: 'May 2025', status: 'Closed', totalGross: 490000, totalNet: 410000 },
  { month: 'Apr 2025', status: 'Closed', totalGross: 470000, totalNet: 390000 },
  { month: 'Mar 2025', status: 'Draft', totalGross: 460000, totalNet: 380000 },
];

const statutoryData: StatutoryEntry[] = [
  { month: 'Jul 2025', employeePF: 10000, employerPF: 12000, pt: 2000 },
  { month: 'Jun 2025', employeePF: 9800, employerPF: 11800, pt: 1900 },
  { month: 'May 2025', employeePF: 9900, employerPF: 11900, pt: 1950 },
  { month: 'Apr 2025', employeePF: 9700, employerPF: 11700, pt: 1850 },
  { month: 'Mar 2025', employeePF: 9600, employerPF: 11600, pt: 1800 },
];

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { counts, status } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    
    if (status === 'idle') {
      dispatch(fetchDashboardCounts());
    }
  }, [status, dispatch]);
  

  const summaryCards: SummaryCardData[] = useMemo(() => {
    const isLoading = status === 'loading' || status === 'idle';
    const hasError = status === 'failed';

    const formatCurrency = (value: number) => `₹${new Intl.NumberFormat('en-IN').format(value)}`;

    return [
      { 
        icon: Users, 
        iconColor: "text-[#ffb11b]", 
        title: "Active Employees", 
        value: isLoading ? "Loading..." : hasError ? "N/A" : counts?.activeEmployees.toString() || '0'
      },
      { 
        icon: FileText, 
        iconColor: "text-[#3c00f2]", 
        title: "Payslip Count", 
        value: isLoading ? "Loading..." : hasError ? "N/A" : counts?.payslipCount.toString() || '0'
      },
      { 
        icon: Landmark, 
        iconColor: "text-[#0ea5e9]", 
        title: "Gross Paid 2024", 
        value: isLoading ? "Loading..." : hasError ? "N/A" : formatCurrency(counts?.grossPaid || 0)
      },
      { 
        icon: Wallet, 
        iconColor: "text-[#22c55e]", 
        title: "Net Paid 2024", 
        value: isLoading ? "Loading..." : hasError ? "N/A" : formatCurrency(counts?.netPaid || 0)
      },
    ];
  }, [counts, status]);
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => <SummaryCard key={card.title} {...card} />)}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <NotificationCard notifications={notifications} />
        <EventsCard events={currentEvents} />
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayrollCard payrollData={payrollData} />
        <StatutoryCard statutoryData={statutoryData} />
      </div>
    </main>
  );
};

export default DashboardPage;