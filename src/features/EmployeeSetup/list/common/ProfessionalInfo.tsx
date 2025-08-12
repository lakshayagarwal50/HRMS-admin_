// import React from "react";
// import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
// import {
//   DetailItem,
//   SectionHeader,
//   EditButton,
// } from "../common/DetailItem";

// interface ProfessionalInfoProps {
//   data: EmployeeDetail;
//   onEdit: () => void;
// }

// const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
//   data,
//   onEdit,
// }) => {
//   const { professional } = data;
//   return (
//     <div>
//       <SectionHeader
//         title="Professional Details"
//         action={<EditButton onClick={onEdit} />}
//       />
//       <div className="space-y-2">
//         <DetailItem label="Designation" value={professional.designation} />
//         <DetailItem label="Department" value={professional.department} />
//         <DetailItem
//           label="Joining Date"
//           value={new Date(professional.joiningDate).toLocaleDateString()}
//         />
//         <DetailItem label="Location" value={professional.location} />
//         <DetailItem
//           label="Reporting Manager"
//           value={professional.reportingManager}
//         />
//         <DetailItem label="Work Week" value={professional.workWeek} />
//         <DetailItem label="Annual CTC" value={professional.ctcAnnual} />
//         <DetailItem label="Holiday Group" value={professional.holidayGroup} />
//         <DetailItem
//           label="Payslip Component"
//           value={professional.payslipComponent}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProfessionalInfo;
import React from "react";
import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
import { DetailItem, SectionHeader, EditButton } from "../common/DetailItem";

interface ProfessionalInfoProps {
  data: EmployeeDetail;
  onEdit: () => void;
}

// Helper Component for the "5 Days Week" card
const WorkWeekSchedule = () => {
  const schedule = {
    Sunday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
    Monday: ["Working Day", "Working Day", "Working Day", "Working Day"],
    Tuesday: ["Working Day", "Working Day", "Working Day", "Working Day"],
    Wednesday: ["Working Day", "Working Day", "Working Day", "Working Day"],
    Thursday: ["Working Day", "Working Day", "Working Day", "Working Day"],
    Friday: ["Working Day", "Working Day", "Working Day", "Working Day"],
    Saturday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
  };

  return (
    <div className="mt-6 w-full overflow-hidden rounded-lg bg-white shadow-md">
      <div className="bg-purple-600 p-3 text-center">
        <h3 className="font-semibold text-white">5 Days Week</h3>
      </div>
      <div className="grid grid-cols-5 gap-x-4 p-4 text-sm">
        {/* Column Titles */}
        <div className="font-bold text-gray-500"></div>{" "}
        {/* Empty for Day column */}
        <div className="text-center font-bold text-gray-500">Week 1</div>
        <div className="text-center font-bold text-gray-500">Week 2</div>
        <div className="text-center font-bold text-gray-500">Week 3</div>
        <div className="text-center font-bold text-gray-500">Week 4</div>
        {/* Data Rows */}
        {Object.entries(schedule).map(([day, statuses]) => (
          <React.Fragment key={day}>
            <div className={`mt-4 border-t pt-3 font-medium text-gray-800`}>
              {day}
            </div>
            {statuses.map((status, i) => (
              <div
                key={i}
                className={`mt-4 border-t pt-3 text-center font-medium text-sky-600`}
              >
                {status}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  data,
  onEdit,
}) => {
  const { professional } = data;
  return (
    <>
      {/* Original Professional Details Section */}
      <div>
        <SectionHeader
          title="Professional Info" // Updated title from screenshot
          action={<EditButton onClick={onEdit} />}
        />
        {/* The 'py-' and 'border-b' classes mimic the row styling */}
        <div className="space-y-2 border-b">
          <DetailItem
            label="Joining Date"
            value={new Date(professional.joiningDate).toLocaleDateString()}
          />
          <DetailItem label="Location" value={professional.location} />
          <DetailItem label="Department" value={professional.department} />
          <DetailItem label="Designation" value={professional.designation} />
          {/* === CTC ROW UPDATED WITH CLICKABLE BUTTON === */}
          <div className="flex items-center justify-between py-1">
            <p className="text-sm text-gray-600">CTC</p>
            <div className="flex items-center space-x-4">
              <p className="text-sm font-semibold text-gray-800">
                {professional.ctcAnnual}
              </p>
              <button
                onClick={() => alert("View CTC Breakup Clicked!")}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View CTC Breakup
              </button>
            </div>
          </div>
          <DetailItem
            label="Payslip Component"
            value={professional.payslipComponent}
          />
          <DetailItem label="Tax Regime" value={"OM"} />{" "}
          {/* Static value from screenshot */}
          <DetailItem label="Holiday Group" value={professional.holidayGroup} />
          <DetailItem label="Role" value={"Manager"} />{" "}
          {/* Static value from screenshot */}
          <DetailItem
            label="Reporting Manager"
            value={professional.reportingManager}
          />
          <DetailItem label="Rental City" value={"Jaipur"} />{" "}
          {/* Static value from screenshot */}
          <DetailItem label="Leaving Date" value={"25-Jan-2018"} />{" "}
          {/* Static value from screenshot */}
        </div>
      </div>

      {/* 5 Days Week Schedule Card */}
      <WorkWeekSchedule />
    </>
  );
};

export default ProfessionalInfo;
