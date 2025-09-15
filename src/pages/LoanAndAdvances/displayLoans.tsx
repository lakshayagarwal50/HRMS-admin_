import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MoreHorizontal,
  Filter,
  Eye,
  Pencil,
  X,
  ChevronUp,
  ChevronDown,
  Search,
  Loader2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import Table, { type Column } from "../../components/common/Table";
import useDebounce from "../../hooks/useDebounce";

import { type RootState, type AppDispatch } from "../../store/store";
import {
  fetchLoans,
  approveLoan,
  cancelLoan,
  type Loan,
} from "../../store/slice/loanAndAdvancesSlice";

type Status = "Approved" | "Pending" | "Paid" | "Declined";

interface FilterState {
  startDate: string;
  endDate: string;
  statuses: Status[];
}

//Skeleton Loader Component
const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <div className="space-y-4 animate-pulse bg-white p-6 rounded-lg shadow-sm">
      <div className="flex space-x-4 px-4">
        <div className="h-4 bg-gray-200 rounded w-[20%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[15%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
        <div className="h-4 bg-gray-200 rounded w-[10%]"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border-t border-gray-100"
          >
            <div className="h-5 bg-gray-200 rounded w-[20%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[15%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
            <div className="h-5 bg-gray-200 rounded w-[10%]"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string; value: ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-800 text-right">
      {value}
    </span>
  </div>
);

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const baseClasses =
    "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  const statusClasses = {
    Approved: "bg-green-100 text-green-800",
    Declined: "bg-red-100 text-red-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Paid: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>
  );
};

const LoanDetailView: React.FC<{
  loan: Loan;
  onClose: () => void;
  onApprove: () => void;
  onDecline: () => void;
}> = ({ loan, onClose, onApprove, onDecline }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-30 z-40"
      onClick={onClose}
    >
      <div
        className="absolute top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-slate-800">
            Loan {loan.requestedAmount} Requested
          </h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto px-6 py-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Loan & Advance Details
            </h3>
            <DetailItem label="Employee" value={loan.employeeName} />
            <DetailItem label="Requested Date" value={loan.requestDate} />
            <DetailItem
              label="Status"
              value={<StatusBadge status={loan.status} />}
            />
            <DetailItem label="Amount Requested" value={loan.requestedAmount} />
            <DetailItem label="Approved Amount" value={loan.approvedAmount} />
            <DetailItem label="Balance" value={loan.balance} />
            <DetailItem label="Installments" value={loan.installments} />
            <DetailItem label="Approved By" value={loan.approvedBy || "--"} />
            <DetailItem label="Staff Notes" value={loan.staffNote || "--"} />
            <DetailItem label="Notes" value={loan.note || "--"} />
          </div>
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h3 className="text-md font-semibold text-gray-700 mb-2">
              Activities
            </h3>
            <p className="text-sm text-gray-500">--</p>
          </div>
        </div>
        {loan.status === "Pending" && (
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
            <button
              onClick={onDecline}
              className="py-2.5 px-6 font-semibold bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onApprove}
              className="py-2.5 px-6 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] transition-colors"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ActionMenu: React.FC<{
  loan: Loan;
  activeMenuId: string | null;
  onToggle: (id: string) => void;
  onViewDetails: (loan: Loan) => void;
}> = ({ loan, activeMenuId, onToggle, onViewDetails }) => {
  const navigate = useNavigate();
  const isActive = activeMenuId === loan.id;

  const handleEditDetails = () => {
    navigate(`/loanandandvance/list/detail/${loan.id}`, { state: { loan } });
  };

  if (isActive) {
    return (
      <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg">
        <button
          onClick={() => onViewDetails(loan)}
          className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Eye size={16} className="mr-2" /> View Details
        </button>
        {loan.status === "Pending" && (
          <button
            onClick={handleEditDetails}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Pencil size={16} className="mr-2" /> Edit
          </button>
        )}
      </div>
    );
  }
  return (
    <button
      onClick={() => onToggle(loan.id)}
      className="p-2 rounded-full hover:bg-gray-200"
    >
      <MoreHorizontal size={20} />
    </button>
  );
};

const FilterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}> = ({ isOpen, onClose, onApply }) => {
  const allStatuses: Status[] = ["Approved", "Pending", "Paid", "Declined"];
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [isDateOpen, setIsDateOpen] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(true);

  const handleStatusChange = (status: Status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedStatuses(allStatuses);
    else setSelectedStatuses([]);
  };

  const handleApply = () => {
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be before the start date.", {
        className: "bg-orange-50 text-orange-800",
      });
      return;
    }
    onApply({ startDate, endDate, statuses: selectedStatuses });
    toast.success("Filters applied successfully!", {
      className: "bg-green-50 text-green-800",
    });
    onClose();
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSelectedStatuses([]);
    onApply({ startDate: "", endDate: "", statuses: [] });
    toast("Filters have been cleared.", {
      icon: "ℹ️",
      className: "bg-blue-50 text-blue-800",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[99] flex justify-end animate-fade-in-right"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:w-96 h-full shadow-lg relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Filter</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✖
          </button>
        </div>

        {/* --- Body --- */}
        <div className="p-6 space-y-4 flex-grow overflow-y-auto">
          <div className="border-b pb-4">
            <button
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="w-full flex justify-between items-center"
            >
              <h3 className="block font-medium text-sm uppercase text-[#741CDD]">
                Requested Date
              </h3>
              {isDateOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isDateOpen && (
              <div className="mt-4 space-y-3">
                <label className="block font-medium text-sm uppercase text-[#741CDD]">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <label className="block font-medium text-sm uppercase text-[#741CDD]">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full flex justify-between items-center"
            >
              <h3 className="block font-medium text-sm uppercase text-[#741CDD]">
                Status
              </h3>
              {isStatusOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
            {isStatusOpen && (
              <div className="mt-4 space-y-3">
                <label className="flex items-center justify-between w-full">
                  <span className="text-sm text-gray-700">All</span>
                  <input
                    type="checkbox"
                    checked={selectedStatuses.length === allStatuses.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-[#741CDD] focus:ring-[#741CDD]"
                  />
                </label>
                {allStatuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center justify-between w-full"
                  >
                    <span className="text-sm text-gray-700">{status}</span>
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusChange(status)}
                      className="h-4 w-4 rounded border-gray-300 text-[#741CDD] focus:ring-[#741CDD]"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- Footer Buttons --- */}
        <div className="flex justify-center gap-3 mt-6 pt-4 border-t p-6">
          <button
            onClick={handleClear}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm w-full"
          >
            CLEAR
          </button>
          <button
            onClick={handleApply}
            className="bg-[#741CDD] text-white px-6 py-2 rounded-md text-sm w-full"
          >
            APPLY FILTERS
          </button>
        </div>
      </div>
    </div>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (totalPages <= 1) return null;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
      <span>
        Showing {startItem} to {endItem} of {totalItems} items
      </span>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page
                ? "bg-[#741CDD] text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const DisplayLoans: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loans, status, error, totalPages, totalItems } = useSelector(
    (state: RootState) => state.loans
  );
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [currentFilters, setCurrentFilters] = useState<
    Omit<FilterState, "statuses"> & { statuses?: string[] }
  >({});
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [confirmingLoan, setConfirmingLoan] = useState<Loan | null>(null);

  // State for Approve Modal
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [modalFormData, setModalFormData] = useState({
    amountApp: "",
    installment: "",
    date: "",
    staffNote: "",
  });
  const [modalErrors, setModalErrors] = useState({
    amountApp: "",
    installment: "",
    date: "",
    staffNote: "",
  });

  // State for Decline Modal
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [declineError, setDeclineError] = useState("");

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set("page", "1");
          return newParams;
        },
        { replace: true }
      );
    }
  }, [itemsPerPage, debouncedSearchQuery, currentFilters]);

  useEffect(() => {
    dispatch(
      fetchLoans({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchQuery,
        ...currentFilters,
      })
    );
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    debouncedSearchQuery,
    currentFilters,
  ]);

  const handleApplyFilters = (filters: FilterState) => {
    setCurrentFilters({
      startDate: filters.startDate,
      endDate: filters.endDate,
      statuses: filters.statuses,
    });
  };
  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", String(newPage));
      return newParams;
    });
  };
  const handleToggleMenu = (id: string) => {
    setActiveMenuId((prevId) => (prevId === id ? null : id));
  };
  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setActiveMenuId(null);
  };
  const handleCloseDetails = () => {
    setSelectedLoan(null);
  };

  const handleInitiateApproval = () => {
    if (!selectedLoan) return;
    setModalFormData({
      amountApp:
        selectedLoan.approvedAmount.replace(/[^0-9.]/g, "") ||
        selectedLoan.requestedAmount.replace(/[^0-9.]/g, ""),
      installment: selectedLoan.installments || "",
      date: "",
      staffNote: selectedLoan.staffNote || "",
    });
    setModalErrors({ amountApp: "", installment: "", date: "", staffNote: "" });
    setConfirmingLoan(selectedLoan);
    setIsApproveModalOpen(true);
  };

  const handleInitiateDecline = () => {
    if (!selectedLoan) return;
    setDeclineReason("");
    setDeclineError("");
    setConfirmingLoan(selectedLoan);
    setIsDeclineModalOpen(true);
  };

  const handleCloseApproveModal = () => {
    setIsApproveModalOpen(false);
    setConfirmingLoan(null);
  };
  const handleCloseDeclineModal = () => {
    setIsDeclineModalOpen(false);
    setConfirmingLoan(null);
  };

  const validateApproveModalField = (name: string, value: string): string => {
    switch (name) {
      case "amountApp":
        if (!value) return "Approved amount is required.";
        if (Number(value) < 0) return "Amount cannot be negative.";
        if (Number(value) > 200000) return "Amount cannot exceed 200,000.";
        return "";
      case "installment":
        if (!value) return "Installments are required.";
        if (Number(value) < 0) return "Installments cannot be negative.";
        if (Number(value) > 60) return "Installments cannot exceed 60.";
        return "";
      case "staffNote":
        if (!value.trim()) return "Staff Note is required.";
        if (value.trim().length < 10)
          return "Note must be at least 10 characters.";
        if (value.trim().length > 30)
          return "Note cannot exceed 30 characters.";
        return "";
      case "date":
        if (!value) return "Payment release date is required.";
        return "";
      default:
        return "";
    }
  };

  const handleModalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setModalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const error = validateApproveModalField(name, value);
    setModalErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleApproveModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmingLoan) return;

    const newErrors = {
      amountApp: validateApproveModalField(
        "amountApp",
        modalFormData.amountApp
      ),
      installment: validateApproveModalField(
        "installment",
        modalFormData.installment
      ),
      date: validateApproveModalField("date", modalFormData.date),
      staffNote: validateApproveModalField(
        "staffNote",
        modalFormData.staffNote
      ),
    };
    setModalErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    const toastId = toast.loading("Approving loan request...");
    try {
      await dispatch(
        approveLoan({
          loanId: confirmingLoan.id,
          ...modalFormData,
        })
      ).unwrap();

      toast.success("Loan approved successfully!", { id: toastId });
      handleCloseApproveModal();
      dispatch(fetchLoans({ page: currentPage, limit: itemsPerPage }));
    } catch (err: any) {
      toast.error(err.message || "Failed to approve loan.", { id: toastId });
    }
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmingLoan) return;

    const reason = declineReason.trim();
    if (!reason) {
      setDeclineError("A reason for declining is required.");
      return;
    }
    if (reason.length < 10 || reason.length > 200) {
      setDeclineError("Reason must be between 10 and 200 characters.");
      return;
    }
    setDeclineError("");

    const toastId = toast.loading("Declining loan request...");
    try {
      await dispatch(
        cancelLoan({
          loanId: confirmingLoan.id,
          cancelReason: declineReason,
        })
      ).unwrap();

      toast.success("Loan declined successfully!", { id: toastId });
      handleCloseDeclineModal();
      dispatch(fetchLoans({ page: currentPage, limit: itemsPerPage }));
    } catch (err: any) {
      toast.error(err.message || "Failed to decline loan.", { id: toastId });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableContainerRef.current &&
        !tableContainerRef.current.contains(event.target as Node)
      ) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const columns: Column<Loan>[] = [
    {
      key: "employeeName",
      header: "Employee",
      render: (row: Loan) => {
        // Format the date for better readability
        const formattedDate = new Date(row.requestDate).toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        );

        return (
          <div>
            <div className="font-semibold">{row.employeeName}</div>
            <div className="text-xs text-gray-500">on {formattedDate}</div>
          </div>
        );
      },
    },
    { key: "requestedAmount", header: "Requested Amt" },
    {
      key: "status",
      header: "Status",
      render: (row: Loan) => <StatusBadge status={row.status} />,
    },
    { key: "approvedAmount", header: "Approved Amt" },
    { key: "installments", header: "Installments" },
    { key: "balance", header: "Balance" },
    {
      key: "action",
      header: "Action",
      className: "text-right",
      render: (row: Loan) => {
        if (["Approved", "Pending", "Declined"].includes(row.status)) {
          return (
            <div className="relative flex justify-end">
              <ActionMenu
                loan={row}
                activeMenuId={activeMenuId}
                onToggle={handleToggleMenu}
                onViewDetails={handleViewDetails}
              />
            </div>
          );
        }
        return null;
      },
    },
  ];

  const renderApproveLoanModal = () => {
    if (!isApproveModalOpen || !confirmingLoan) return null;
    const isFormValid =
      Object.values(modalErrors).every((e) => e === "") &&
      modalFormData.amountApp &&
      modalFormData.installment &&
      modalFormData.date &&
      modalFormData.staffNote;
    return (
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={handleCloseApproveModal}
      >
        <div
          className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white h-full flex flex-col">
            <form
              onSubmit={handleApproveModalSubmit}
              noValidate
              className="h-full flex flex-col"
            >
              <div className="relative flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-slate-800">
                  Approve Loan Request
                </h2>
                <button
                  type="button"
                  onClick={handleCloseApproveModal}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-grow overflow-y-auto p-6">
                <div className="bg-[#E7E9F4] p-4 rounded-md text-gray-800 text-sm">
                  You can change loan amount and number of installments before
                  approving this request.
                </div>
                <div className="mt-4 border-b border-gray-200 py-4 flex justify-between items-center text-sm font-semibold">
                  <span>Amount Requested:</span>
                  <span>{confirmingLoan.requestedAmount}</span>
                </div>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Approved Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="amountApp"
                      value={modalFormData.amountApp}
                      onChange={handleModalChange}
                      onBlur={handleModalBlur}
                      className={`w-full p-2 border rounded-md ${
                        modalErrors.amountApp
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {modalErrors.amountApp && (
                      <p className="mt-1 text-xs text-red-600">
                        {modalErrors.amountApp}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Installments <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="installment"
                      value={modalFormData.installment}
                      onChange={handleModalChange}
                      onBlur={handleModalBlur}
                      className={`w-full p-2 border rounded-md ${
                        modalErrors.installment
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {modalErrors.installment && (
                      <p className="mt-1 text-xs text-red-600">
                        {modalErrors.installment}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Payment Release Date{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={modalFormData.date}
                      onChange={handleModalChange}
                      onBlur={handleModalBlur}
                      className={`w-full p-2 border rounded-md ${
                        modalErrors.date ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {modalErrors.date && (
                      <p className="mt-1 text-xs text-red-600">
                        {modalErrors.date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Staff Note <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="staffNote"
                      value={modalFormData.staffNote}
                      onChange={handleModalChange}
                      onBlur={handleModalBlur}
                      rows={4}
                      className={`w-full p-2 border rounded-md ${
                        modalErrors.staffNote
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {modalErrors.staffNote && (
                      <p className="mt-1 text-xs text-red-600">
                        {modalErrors.staffNote}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseApproveModal}
                  className="py-2.5 px-6 font-semibold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center"
                  disabled={status === "loading" || !isFormValid}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    "Approve"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderDeclineLoanModal = () => {
    if (!isDeclineModalOpen || !confirmingLoan) return null;
    return (
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={handleCloseDeclineModal}
      >
        <div
          className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out translate-x-0"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            onSubmit={handleDeclineSubmit}
            noValidate
            className="h-full flex flex-col"
          >
            <div className="relative flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-slate-800">
                Decline Loan Request
              </h2>
              <button
                type="button"
                onClick={handleCloseDeclineModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6">
              <div className="bg-[#E7E9F4] p-4 rounded-md text-gray-800 text-sm">
                Please provide a clear reason for declining this loan request.
              </div>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Reason for Decline <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="declineReason"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    rows={5}
                    className={`w-full p-2 border rounded-md ${
                      declineError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Provide a reason (10-200 characters)..."
                  />
                  {declineError && (
                    <p className="mt-1 text-xs text-red-600">{declineError}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseDeclineModal}
                className="py-2.5 px-6 font-semibold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-6 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed flex items-center"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  "Decline Loan"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Loans & Advances</h1>
      </header>
      <div ref={tableContainerRef}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <label htmlFor="entries" className="text-sm text-gray-600 mr-2">
              Show
            </label>
            <select
              id="entries"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-[#741CDD] sm:text-sm"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-600 ml-2">entries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#741CDD] focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="p-2.5 rounded-md"
              style={{ backgroundColor: "#741CDD" }}
            >
              <Filter size={20} className="text-white" />
            </button>
          </div>
        </div>
        {status === "loading" && <TableSkeleton rows={itemsPerPage} />}
        {status === "succeeded" && (
          <>
            <Table
              key={itemsPerPage}
              defaultItemsPerPage={itemsPerPage}
              data={loans}
              columns={columns}
              className="[&_.table-controls]:hidden"
              showSearch={false}
              showPagination={false}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
      {selectedLoan && (
        <LoanDetailView
          loan={selectedLoan}
          onClose={handleCloseDetails}
          onApprove={handleInitiateApproval}
          onDecline={handleInitiateDecline}
        />
      )}
      {renderApproveLoanModal()}
      {renderDeclineLoanModal()}
    </div>
  );
};

export default DisplayLoans;
