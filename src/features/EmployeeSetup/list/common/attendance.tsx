import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../store/store"; // adjust path
// adjust path
import { fetchYearlyAttendance } from "../../../../store/slice/yearlyAttendanceSlice";

const Attendance: React.FC<{ empCode: string; year: number }> = ({
  empCode,
  year,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.yearlyAttendance
  );

  useEffect(() => {
    if (empCode && year) {
      dispatch(fetchYearlyAttendance({ year, empCode }));
    }
  }, [dispatch, empCode, year]);

  if (loading) return <p>Loading yearly attendance...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <p>No yearly attendance data</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Yearly Attendance for {data.empCode} ({data.year})
      </h2>

      {/* Render months with grid */}
      {Object.entries(data.months).map(([month, days]: any) => (
        <div key={month} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{month}</h3>
          <div className="grid grid-cols-7 gap-2">
            {Object.entries(days).map(([day, status]: any) => (
              <div
                key={day}
                className={`p-2 rounded text-center text-sm font-medium ${
                  status === "P"
                    ? "bg-green-200"
                    : status === "AB"
                    ? "bg-red-200"
                    : status === "HD"
                    ? "bg-yellow-200"
                    : status === "W"
                    ? "bg-gray-300"
                    : "bg-white"
                }`}
              >
                {day} <br />
                <span className="text-xs">{status}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Attendance;
