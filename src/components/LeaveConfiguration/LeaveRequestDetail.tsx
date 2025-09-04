import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import type { AppDispatch } from '../../store/store';
import { updateLeaveStatus, type LeaveRequest } from '../../store/slice/leaveRequestSlice';

interface LeaveRequestDetailProps {
    isOpen: boolean;
    onClose: () => void;
    request: LeaveRequest | null;
    setToast: (toast: { message: string; type: 'success' | 'error' } | null) => void;
}

const LeaveRequestDetail: React.FC<LeaveRequestDetailProps> = ({ isOpen, onClose, request, setToast }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [declineReason, setDeclineReason] = useState('');
    const [showDeclineForm, setShowDeclineForm] = useState(false);
    useEffect(() => {
        if (!isOpen) {
            setShowDeclineForm(false);
            setDeclineReason('');
        }
    }, [isOpen]);

    const handleApprove = async () => {
        if (request) {
            try {
                await dispatch(updateLeaveStatus({ id: request.id, status: 'Approved' })).unwrap();
                setToast({ message: 'Leave has been approved successfully.', type: 'success' });
                onClose(); 
            } catch (err: any) {
                setToast({ message: err || 'An error occurred', type: 'error' });
            }
        }
    };

    const handleDecline = async () => {
        if (request && declineReason) {
            try {
                await dispatch(updateLeaveStatus({ id: request.id, status: 'Rejected', declineReason })).unwrap();
                setToast({ message: 'Leave has been declined.', type: 'success' });
                onClose(); 
            } catch (err: any) {
                setToast({ message: err || 'An error occurred', type: 'error' });
            }
        } else if (!declineReason) {
            alert('Please provide a reason for declining the request.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}>
            <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-xl p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Leave Request Details</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={24} /></button>
                </div>

                {!request ? (
                    <p>Loading details...</p>
                ) : (
                    <div className="space-y-4 text-sm">
                        <p><strong>Employee:</strong> {request.employeeName} ({request.empCode})</p>
                        <p><strong>Department:</strong> {request.department}</p>
                        <p><strong>Leave Type:</strong> {request.leaveType}</p>
                        <p><strong>Dates:</strong> {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()}</p>
                        <p><strong>Duration:</strong> {request.duration} Day(s)</p>
                        <p><strong>Reason:</strong> {request.reason}</p>
                        <a href={request.uploadedDocument} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">View Document</a>
                        
                        <div className="pt-4 border-t">
                            <h3 className="font-semibold mb-2">Leave Balance</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(request.leaveBalance).map(([type, balance]) => (
                                    <div key={type} className="bg-gray-50 p-2 rounded">
                                        <p className="font-medium">{type}</p>
                                        <p>Balance: {balance.balance}/{balance.allowedLeave}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {request.myApprovalStatus === 'Pending' && (
                             <div className="pt-6 border-t space-y-4">
                                {!showDeclineForm ? (
                                    <div className="flex gap-4">
                                        <button onClick={handleApprove} className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Approve</button>
                                        <button onClick={() => setShowDeclineForm(true)} className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Decline</button>
                                    </div>
                                ) : (
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
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveRequestDetail;

