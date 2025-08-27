import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../../services";
import Table, { type Column } from "../../../../components/common/Table";
import AddNewLeaveTypeModal from "../modal/AddNewLeaveTypeModal";
import NewLeaveRequestModal from "../modal/NewLeaveRequestModal";
import MonthlyAttendance from "./MonthlyAttendance";

const attendanceConfig: Record<
  AttendanceStatus,
  { color: string; label: string }
> = {
  P: { color: "bg-green-100 text-green-800", label: "Present" },
  W: { color: "bg-yellow-100 text-yellow-800", label: "WeekOff" },
  L: { color: "bg-red-100 text-red-800", label: "Leave" },
  HD: { color: "bg-blue-100 text-blue-800", label: "HalfDay" },
  H: { color: "bg-cyan-100 text-cyan-800", label: "Holiday" },
  AB: { color: "bg-gray-200 text-gray-700", label: "Absent" },
};

interface ApiResponse {
  empCode: string;
  year: number;
  months: { [month: string]: { [day: string]: AttendanceStatus } };
}
interface LeaveBalance {
  id: number;
  name: string;
  allowed: number;
  taken: number;
  unpaid: number;
  balance: number;
}
interface UpcomingLeave {
  id: number;
  period: string;
  name: string;
}
type AttendanceStatus = "P" | "W" | "L" | "HD" | "H" | "AB";

const calendarMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AttendanceLegend = () => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
    {Object.entries(attendanceConfig).map(([key, { color, label }]) => (
      <div key={key} className="flex items-center">
        <button
          className={`px-4 py-1.5 text-xs font-semibold rounded-md ${color}`}
        >
          {key}-{label}
        </button>
      </div>
    ))}
  </div>
);

const Attendance: React.FC = () => {
  const { employeeCode } = useParams<{ employeeCode: string }>();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState<
    ApiResponse["months"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [editingMonth, setEditingMonth] = useState<{
    month: string;
    year: number;
  } | null>(null);

  useEffect(() => {
    if (employeeCode && selectedYear) {
      const fetchAttendance = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axiosInstance.get<ApiResponse>(
            `/employees/getYearly/${selectedYear}/${employeeCode}`
          );
          setAttendanceData(response.data.months);
        } catch (err) {
          setError("Failed to fetch attendance data. Please try again.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchAttendance();
    }
  }, [employeeCode, selectedYear]);

  const handleLeaveSubmit = (leaveType: string) => {
    console.log("New leave type submitted:", leaveType);
    setIsLeaveModalOpen(false);
  };

  const handleRequestSubmit = (formData: any) => {
    console.log("New leave request data:", formData);
    setIsRequestModalOpen(false);
  };

  const leaveBalanceColumns: Column<LeaveBalance>[] = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    { key: "allowed", header: "Allowed Leaves" },
    { key: "taken", header: "Leaves Taken" },
    { key: "unpaid", header: "Unpaid Leaves" },
    { key: "balance", header: "Balance" },
    { key: "action", header: "Actions", render: () => <button>🗑️</button> },
  ];
  const leaveBalanceData: LeaveBalance[] = [
    {
      id: 5648,
      name: "Sick Leaves",
      allowed: 5.0,
      taken: 1,
      unpaid: 0.0,
      balance: 4.0,
    },
    {
      id: 5463,
      name: "Casual Leaves",
      allowed: 1.0,
      taken: 0,
      unpaid: 0.0,
      balance: 1.0,
    },
  ];

  const upcomingLeavesColumns: Column<UpcomingLeave>[] = [
    { key: "id", header: "#" },
    { key: "period", header: "Period" },
    { key: "name", header: "Name" },
  ];
  const upcomingLeavesData: UpcomingLeave[] = [
    { id: 1, period: "11/02/2022", name: "Casual Leaves" },
  ];

  if (editingMonth && employeeCode) {
    return (
      <MonthlyAttendance
        // --- CHANGE HERE: Pass employeeCode instead of employeeId for clarity ---
        employee={{ employeeCode: employeeCode, name: "Employee" }}
        year={editingMonth.year}
        month={editingMonth.month}
        onBack={() => setEditingMonth(null)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="appearance-none font-semibold bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-md"
          >
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <AttendanceLegend />
      </div>

      <div className="overflow-x-auto border rounded-lg">
        {loading ? (
          <div className="text-center p-16">Loading Attendance...</div>
        ) : error ? (
          <div className="text-center p-16 text-red-500">{error}</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-28 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Days
                </th>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <th
                    key={day}
                    className="w-12 text-center text-xs font-medium text-gray-500 p-2"
                  >
                    {day}
                  </th>
                ))}
                <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {calendarMonths.map((month) => (
                <tr key={month} className="border-t">
                  <td
                    onClick={() =>
                      selectedYear &&
                      setEditingMonth({ month, year: selectedYear })
                    }
                    className="px-4 py-2 font-semibold text-purple-700 cursor-pointer hover:text-purple-900 hover:bg-gray-50"
                  >
                    {month}
                  </td>
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const status = attendanceData?.[month]?.[day];
                    const config = status ? attendanceConfig[status] : null;
                    return (
                      <td key={day} className="text-center border-l p-0.5">
                        <div
                          className={`w-full h-8 flex items-center justify-center rounded-sm font-semibold ${
                            config?.color ?? "bg-gray-50"
                          }`}
                        >
                          {status}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-4 py-2 border-l">
                    <button
                      onClick={() =>
                        selectedYear &&
                        setEditingMonth({ month, year: selectedYear })
                      }
                      className="text-xs text-gray-600 font-medium hover:text-purple-700 disabled:opacity-50"
                      disabled={!selectedYear}
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Leave Balance And Details
          </h2>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="bg-[#741CDD] text-white font-semibold py-2 px-4 rounded-md text-sm"
          >
            Add New
          </button>
        </div>
        <Table
          columns={leaveBalanceColumns}
          data={leaveBalanceData}
          showSearch={false}
          showPagination={false}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Upcoming Requested Leaves
          </h2>
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="bg-[#741CDD] text-white font-semibold py-2 px-4 rounded-md text-sm"
          >
            New Leave Request
          </button>
        </div>
        <Table
          columns={upcomingLeavesColumns}
          data={upcomingLeavesData}
          showSearch={false}
          showPagination={false}
        />
      </div>

      <AddNewLeaveTypeModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleLeaveSubmit}
      />
      <NewLeaveRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleRequestSubmit}
      />
    </div>
  );
};

export default Attendance;
