import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import type { AppDispatch, RootState } from '../../store/store';
import { clearSelectedLeaveRequest, updateLeaveStatus } from '../../store/slice/leaveRequestSlice';

const LeaveRequestDetail: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { selectedRequest, selectedRequestStatus } = useSelector((state: RootState) => state.leaveRequests);
    const [declineReason, setDeclineReason] = useState('');
    const [showDeclineForm, setShowDeclineForm] = useState(false);

    const handleClose = () => {
        dispatch(clearSelectedLeaveRequest());
        setShowDeclineForm(false);
        setDeclineReason('');
    };

    const handleApprove = () => {
        if (selectedRequest) {
            dispatch(updateLeaveStatus({ id: selectedRequest.id, status: 'Approved' }));
            handleClose();
        }
    };

    const handleDecline = () => {
        if (selectedRequest && declineReason) {
            dispatch(updateLeaveStatus({ id: selectedRequest.id, status: 'Rejected', declineReason }));
            handleClose();
        }
    };

    if (!selectedRequest && selectedRequestStatus !== 'loading') return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose}>
            <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Leave Request Details</h2>
                    <button onClick={handleClose}><X size={24} /></button>
                </div>

                {selectedRequestStatus === 'loading' && <p>Loading details...</p>}

                {selectedRequestStatus === 'succeeded' && selectedRequest && (
                    <div className="space-y-4 text-sm">
                        <p><strong>Employee:</strong> {selectedRequest.employeeName} ({selectedRequest.empCode})</p>
                        <p><strong>Department:</strong> {selectedRequest.department}</p>
                        <p><strong>Leave Type:</strong> {selectedRequest.leaveType}</p>
                        <p><strong>Dates:</strong> {new Date(selectedRequest.startDate).toLocaleDateString()} to {new Date(selectedRequest.endDate).toLocaleDateString()}</p>
                        <p><strong>Duration:</strong> {selectedRequest.duration} Day(s)</p>
                        <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                        <a href={selectedRequest.uploadedDocument} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">View Document</a>
                        
                        <div className="pt-4 border-t">
                            <h3 className="font-semibold mb-2">Leave Balance</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(selectedRequest.leaveBalance).map(([type, balance]) => (
                                    <div key={type} className="bg-gray-50 p-2 rounded">
                                        <p className="font-medium">{type}</p>
                                        <p>Balance: {balance.balance}/{balance.allowedLeave}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t space-y-4">
                            {!showDeclineForm && (
                                <div className="flex gap-4">
                                    <button onClick={handleApprove} className="flex-1 py-2 bg-green-600 text-white rounded-md">Approve</button>
                                    <button onClick={() => setShowDeclineForm(true)} className="flex-1 py-2 bg-red-600 text-white rounded-md">Decline</button>
                                </div>
                            )}

                            {showDeclineForm && (
                                <div className="space-y-2">
                                    <label htmlFor="declineReason" className="font-semibold">Reason for Decline</label>
                                    <textarea id="declineReason" value={declineReason} onChange={(e) => setDeclineReason(e.target.value)} className="w-full p-2 border rounded-md" rows={3}></textarea>
                                    <div className="flex gap-4">
                                        <button onClick={() => setShowDeclineForm(false)} className="flex-1 py-2 bg-gray-200 rounded-md">Cancel</button>
                                        <button onClick={handleDecline} className="flex-1 py-2 bg-red-600 text-white rounded-md">Confirm Decline</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveRequestDetail;
