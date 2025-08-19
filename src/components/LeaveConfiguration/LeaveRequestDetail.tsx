import React from 'react';
import { X  } from 'lucide-react';
import SidePanelForm from '../../components/common/SidePanelForm'; // Assuming a generic side panel exists

// --- TYPE DEFINITIONS ---
// These should match the types in your main page
type ApprovalStatus = 'Pending' | 'Approved' | 'Declined';

interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: string;
  appliedOn: string;
  startDate: string;
  endDate: string;
  // Add any other fields you need from your main LeaveRequest type
}

interface LeaveRequestDetailProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest | null;
}

// --- Helper Components ---
const LeaveBalanceCard: React.FC<{ title: string; allowed: number; taken: number; unpaid: number }> = ({ title, allowed, taken, unpaid }) => (
    <div className="bg-gray-50 p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Allowed Leave:</span> <span>{allowed.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Leave Taken:</span> <span>{taken.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Unpaid Leave:</span> <span>{unpaid.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold"><span>Balance:</span> <span>{(allowed - taken).toFixed(2)}</span></div>
        </div>
    </div>
);

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b last:border-b-0">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
);


// --- MAIN COMPONENT ---
const LeaveRequestDetail: React.FC<LeaveRequestDetailProps> = ({ isOpen, onClose, request }) => {
  if (!request) {
    return null;
  }

  // Dummy handler for the form submission
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Action buttons would be handled here.");
      onClose();
  };

  return (
    <SidePanelForm
        isOpen={isOpen}
        onClose={onClose}
        title={`Leave Request (${request.employeeName})`}
        onSubmit={handleSubmit}
        // Hide the default footer buttons since we have custom ones
        hideFooter={true} 
    >
        <div className="p-6 space-y-6">
            {/* Leave Balances */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LeaveBalanceCard title="Planned leave" allowed={5} taken={1} unpaid={0} />
                <LeaveBalanceCard title="Casual leave" allowed={1} taken={0} unpaid={0} />
                <LeaveBalanceCard title="Privileged leave" allowed={5} taken={1} unpaid={0} />
                <LeaveBalanceCard title="Sick leave" allowed={1} taken={0} unpaid={0} />
            </div>

            {/* Leave Details */}
            <div>
                <h3 className="text-md font-semibold mb-2 text-gray-800">Leave Details</h3>
                <div className="border rounded-lg p-4 bg-white">
                    <DetailRow label="Employee" value={request.employeeName} />
                    <DetailRow label="Leave Type" value={request.leaveType} />
                    <DetailRow label="Applied On" value={new Date(request.appliedOn).toLocaleDateString()} />
                    <DetailRow label="Start Date" value={new Date(request.startDate).toLocaleDateString()} />
                    <DetailRow label="End Date" value={new Date(request.endDate).toLocaleDateString()} />
                    <DetailRow label="Half Day" value="Yes" />
                    <DetailRow label="Uploaded Document" value={<a href="#" className="text-purple-600 hover:underline">JimmyMedical.pdf</a>} />
                    <DetailRow label="Reason" value="Need to Attend Some Family Function." />
                    <DetailRow label="Status" value={<span className="text-green-600 font-semibold">Approved</span>} />
                </div>
            </div>

            {/* Approval Status */}
            <div>
                <h3 className="text-md font-semibold mb-2 text-gray-800">Approval Status</h3>
                <div className="border rounded-lg p-4 bg-white">
                    <DetailRow label="Kushal Saran (RM)" value={<span className="text-green-600 font-semibold">Approved</span>} />
                </div>
            </div>

            {/* Custom Action Buttons */}
            <div className="flex justify-end items-center pt-4 space-x-3">
                <button type="button" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
                    Approve as unpaid
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700">
                    Approve
                </button>
                <button type="button" className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
                    Decline Leave
                </button>
            </div>
        </div>
    </SidePanelForm>
  );
};

export default LeaveRequestDetail;
