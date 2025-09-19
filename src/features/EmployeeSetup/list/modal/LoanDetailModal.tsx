import React from "react";
import type { LoanDetails } from "../../../../store/slice/loanSlice";
import { DetailItem } from "../common/DetailItem";

interface LoanDetailModalProps {
  loan: LoanDetails;
  onClose: () => void;
  onApprove: (loanId: string) => void;
  onDecline: (loanId: string) => void;
}

const LoanDetailModal: React.FC<LoanDetailModalProps> = ({
  loan,
  onClose,
  onApprove,
  onDecline,
}) => {
  return (
    <div className="bg-white h-full flex flex-col">
      <div className="relative flex items-center justify-center p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-slate-800">
          Loan {loan.amountReq} Requested
        </h2>
        <button
          onClick={onClose}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div className="flex-grow overflow-y-auto px-6 py-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Loan & Advance Details
          </h3>
          <DetailItem label="Employee" value={loan.empName ?? "--"} />
          <DetailItem label="Requested Date" value={loan.reqDate ?? "--"} />
          <DetailItem label="Status" value={loan.status ?? "--"} />
          <DetailItem label="Amount Requested" value={loan.amountReq ?? "--"} />
          <DetailItem label="Approved Amount" value={loan.amountApp ?? "--"} />
          <DetailItem label="Balance" value={loan.balance ?? "--"} />
          <DetailItem label="Approved By" value={loan.approvedBy ?? "--"} />
          <DetailItem label="Staff Notes" value={loan.staffNote ?? "--"} />
          <DetailItem label="Notes" value={loan.note ?? "--"} />
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Activities
          </h3>
          <p className="text-sm text-gray-500">
            {loan.activity?.join(", ") ?? "--"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
        <>
          <button
            onClick={() => onDecline(loan.id)}
            className="py-2.5 px-6 font-semibold bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => onApprove(loan.id)}
            className="py-2.5 px-6 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] transition-colors"
          >
            Approve
          </button>
        </>
      </div>
    </div>
  );
};

export default LoanDetailModal;
