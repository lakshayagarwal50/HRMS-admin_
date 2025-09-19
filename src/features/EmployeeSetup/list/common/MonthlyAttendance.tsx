import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../../../services";
import UpdateAttendanceModal from "../modal/UpdateAttendanceModal";
import toast from "react-hot-toast";

type AttendanceStatus = "P" | "W" | "L" | "HD" | "H" | "AB";

interface MonthlyApiResponse {
  empCode: string;
  year: number;
  month: number;
  days: {
    [day: string]: AttendanceStatus;
  };
}

const attendanceConfig: Record<
  AttendanceStatus,
  { color: string; label: string }
> = {
  P: { color: "bg-green-100 text-green-800", label: "Present" },
  W: { color: "bg-yellow-100 text-yellow-800", label: "Weekoff" },
  L: { color: "bg-red-100 text-red-800", label: "Leave" },
  HD: { color: "bg-blue-100 text-blue-800", label: "HalfDay" },
  H: { color: "bg-cyan-100 text-cyan-800", label: "Holiday" },
  AB: { color: "bg-gray-200 text-gray-700", label: "Absent" },
};

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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

interface MonthlyAttendanceProps {
  employee: { name: string; employeeCode: string };
  year: number;
  month: string;
  onBack: () => void;
}

const MonthlyAttendance: React.FC<MonthlyAttendanceProps> = ({
  employee,
  year,
  month,
  onBack,
}) => {
  const [attendanceDays, setAttendanceDays] = useState<
    MonthlyApiResponse["days"]
  >({});
  const [loading, setLoading] = useState(true);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchMonthlyData = async () => {
    setLoading(true);

    const monthIndex = calendarMonths.indexOf(month) + 1;
    try {
      const response = await axiosInstance.get<MonthlyApiResponse>(
        `/employees/getMonthly/${employee.employeeCode}`,
        { params: { year, month: monthIndex } }
      );
      setAttendanceDays(response.data.days);
    } catch (err) {
      toast.error("Failed to fetch monthly attendance.", {
        className: "bg-red-50 text-red-800",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [employee, year, month]);

  const handleUpdateSubmit = () => {
    toast.success("Attendance updated successfully!", {
      className: "bg-green-50 text-green-800",
    });

    fetchMonthlyData();
    setIsUpdateModalOpen(false);
  };

  const handleOpenUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };

  const monthIndex = calendarMonths.indexOf(month);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();

  const renderGrid = () => {
    if (loading)
      return (
        <div className="text-center p-12 col-span-7">
          Loading Monthly View...
        </div>
      );

    const gridCells = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      gridCells.push(
        <div
          key={`empty-${i}`}
          className="border border-gray-400 rounded-md"
        ></div>
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const status = attendanceDays[day];
      const config = status ? attendanceConfig[status] : null;
      gridCells.push(
        <div
          key={day}
          className={`border rounded-md p-2 text-center text-black cursor-pointer ${
            config?.color.replace("bg-", "bg-").replace("-100", "-500") ??
            "bg-gray-50"
          }`}
          onClick={handleOpenUpdateModal}
        >
          <div className="font-bold text-lg">
            {day.toString().padStart(2, "0")}
          </div>
          <div className="text-xs font-semibold">{config?.label ?? "-"}</div>
        </div>
      );
    }
    return gridCells;
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {`${month}-${year} Attendance for Employee ${employee.employeeCode} | ${employee.name}`}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
         
          {/* <span className="mx-2">/</span> */}
          <Link to="/dashboard" className="hover:text-[#741CDD]">
            Employee Setup
          </Link>
          <span className="mx-2">/Monthly Attendance</span>
        </p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-7 gap-2 text-center font-semibold text-sm text-gray-600 mb-4">
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{renderGrid()}</div>
      </div>

      <div className="mt-8 flex items-center space-x-4">
        <button
          onClick={handleOpenUpdateModal}
          className="bg-[#741CDD] text-white font-semibold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          UPDATE
        </button>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-8 rounded-lg hover:bg-gray-300 transition-colors"
        >
          BACK
        </button>
      </div>

      <UpdateAttendanceModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleUpdateSubmit}
        employeeCode={employee.employeeCode}
      />
    </div>
  );
};

export default MonthlyAttendance;
