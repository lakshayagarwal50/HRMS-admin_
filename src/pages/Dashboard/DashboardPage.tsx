

// Import Types
import EventsCard from "../../components/Dashboard/EventCard";
import NotificationCard from "../../components/Dashboard/NotificationCard";
import PayrollCard from "../../components/Dashboard/PayrollCard";
import StatutoryCard from "../../components/Dashboard/StatutoryCard";
import SummaryCard from "../../components/Dashboard/SummaryCard";
import type { SummaryCardData, Notification, Event, PayrollEntry, StatutoryEntry } from "../../types/index";

// Import Icons
import { Users, FileText, Landmark, Wallet } from 'lucide-react';


// Import Components


// Data definitions (in a real app, this would come from an API)
const summaryCards: SummaryCardData[] = [
  { icon: Users, iconColor: "text-[#ffb11b]", title: "Active Employees", value: "150" },
  { icon: FileText, iconColor: "text-[#3c00f2]", title: "Payslip Count", value: "120" },
  { icon: Landmark, iconColor: "text-[#0ea5e9]", title: "Gross Paid 2024", value: "₹80,000" },
  { icon: Wallet, iconColor: "text-[#22c55e]", title: "Net Paid 2024", value: "₹50,000" },
];

const notifications: Notification[] = [
    { id: 1, name: "Ayush Chauhan", requestedBy: "HR Team", time: "2025-07-25 10:30 AM", status: "Pending" },
    { id: 2, name: "Deepak Kumar", requestedBy: "Payroll Dept", time: "2025-07-24 02:15 PM", status: "Pending" },
    { id: 3, name: "Ritesh Tiwari", requestedBy: "Admin", time: "2025-07-23 09:00 AM", status: "Pending" },
    { id: 4, name: "Kapil Sahu", requestedBy: "HR Team", time: "2025-07-22 11:45 AM", status: "Pending" },
    { id: 5, name: "Anoop Chaudhary", requestedBy: "Payroll Dept", time: "2025-07-21 03:20 PM", status: "Pending" },
    { id: 6, name: "Anurag Rajput", requestedBy: "Admin", time: "2025-07-20 08:00 AM", status: "Pending" },
];

const currentEvents: Event[] = [
    { id: 1, title: "Team Meeting", description: "Discuss Q3 goals and performance" },
    { id: 2, title: "Training Session", description: "New payroll software training" },
    { id: 3, title: "Company Outing", description: "Annual team-building event" },
    { id: 4, title: "Performance Review", description: "Q2 performance evaluations" },
    { id: 5, title: "Budget Planning", description: "2025 budget planning session" },
    { id: 6, title: "HR Workshop", description: "Compliance training" },
];

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
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Row 1: Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => <SummaryCard key={card.title} {...card} />)}
      </div>

      {/* Row 2: Notifications & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <NotificationCard notifications={notifications} />
        <EventsCard events={currentEvents} />
      </div>

      {/* Row 3: Payroll & Statutory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PayrollCard payrollData={payrollData} />
        <StatutoryCard statutoryData={statutoryData} />
      </div>
    </main>
  );
};

export default DashboardPage;