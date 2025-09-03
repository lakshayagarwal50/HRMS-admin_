import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
import type { LoanDetails } from "../../../../store/slice/loanSlice";

import { SectionHeader, AddButton } from "./DetailItem";
import Table, { type Column } from "../../../../components/common/Table";

interface LoanAdvancesProps {
  data: EmployeeDetail;
  loans: LoanDetails[] | null;
  onEdit: (loanItem: LoanDetails) => void;
  onViewDetails: (loanItem: LoanDetails) => void;
  onAddLoan: () => void;
}

const LoanAdvances: React.FC<LoanAdvancesProps> = ({
  data,
  loans,
  onEdit,
  onViewDetails,
  onAddLoan,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columns: Column<LoanDetails>[] = [
    { key: "reqDate", header: "Requested Date" },
    { key: "amountReq", header: "Requested Amount" },
    { key: "amountApp", header: "Approved Amount" },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        if (!row || !row.status) {
          return <span className="text-gray-500">--</span>;
        }
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              row.status === "approved"
                ? "bg-green-100 text-green-800"
                : row.status === "declined"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {row.status}
          </span>
        );
      },
    },
    { key: "paybackTerm.installment", header: "No. Of Installment" },
    { key: "paybackTerm.remaining", header: "Remaining Installment" },
    { key: "balance", header: "Balance" },
    {
      key: "action",
      header: "Actions",
      render: (row) => {
        if (!row || !row.id) {
          return <span className="text-gray-500">--</span>;
        }
        const isOpen = openDropdownId === row.id;

        return (
          <div className="relative" key={row.id}>
            <button
              onClick={() => setOpenDropdownId(isOpen ? null : row.id)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <MoreVertical size={16} />
            </button>
            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none flex flex-col"
              >
                <button
                  onClick={() => {
                    setOpenDropdownId(null);
                    onViewDetails(row);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-[#f5f5f5]"
                >
                  View Detail
                </button>
                <button
                  onClick={() => {
                    setOpenDropdownId(null);
                    onEdit(row);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-[#f5f5f5]"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const hasLoans = loans && loans.length > 0;

  return (
    <div>
      <SectionHeader
        title="Loan and Advances"
        action={hasLoans ? <AddButton onClick={onAddLoan} /> : null}
      />
      {hasLoans ? (
        <Table data={loans} columns={columns} />
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border border-dashed text-center text-gray-500">
          <p>No loan details available.</p>
          <div className="mt-4">
            <AddButton onClick={onAddLoan} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanAdvances;