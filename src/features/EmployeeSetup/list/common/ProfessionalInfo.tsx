
// import React from "react";
// import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
// import { DetailItem, SectionHeader, EditButton } from "../common/DetailItem";

// interface ProfessionalInfoProps {
//   data: EmployeeDetail;
//   onEdit: () => void;
// }

// // Helper Component for the Work Week card
// interface WorkWeekScheduleProps {
//   workPattern: string;
// }

// const WorkWeekSchedule: React.FC<WorkWeekScheduleProps> = ({ workPattern }) => {
//   let schedule;
//   const title = workPattern; // The title of the card will be the pattern name

//   // Logic to determine which schedule to use based on the workPattern prop
//   if (workPattern === "5 days Week") {
//     // This is the schedule for a standard 5-day week
//     schedule = {
//       Sunday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
//       Monday: ["Working Day", "Working Day", "Working Day", "Working Day"],
//       Tuesday: ["Working Day", "Working Day", "Working Day", "Working Day"],
//       Wednesday: ["Working Day", "Working Day", "Working Day", "Working Day"],
//       Thursday: ["Working Day", "Working Day", "Working Day", "Working Day"],
//       Friday: ["Working Day", "Working Day", "Working Day", "Working Day"],
//       Saturday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
//     };
//   } else {
//     // This is the alternate schedule for any other workPattern
//     // It shows Mon, Wed, Fri as working days.
//     schedule = {
//       Sunday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
//       Monday: ["Working Day", "Working Day", "Working Day", "Working Day"],
//       Tuesday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
//       Wednesday: ["Working Day", "Working Day", "Working Day", "Working Day"],
//       Thursday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
//       Friday: ["Working Day", "Working Day", "Working Day", "Working Day"],
//       Saturday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
//     };
//   }

//   return (
//     <div className="mt-6 w-full overflow-hidden rounded-lg bg-white shadow-md">
//       <div className="bg-purple-600 p-3 text-center">
//         <h3 className="font-semibold text-white">{title}</h3>
//       </div>
//       <div className="grid grid-cols-5 gap-x-4 p-4 text-sm">
//         {/* Column Titles */}
//         <div className="font-bold text-gray-500"></div>{" "}
//         {/* Empty for Day column */}
//         <div className="text-center font-bold text-gray-500">Week 1</div>
//         <div className="text-center font-bold text-gray-500">Week 2</div>
//         <div className="text-center font-bold text-gray-500">Week 3</div>
//         <div className="text-center font-bold text-gray-500">Week 4</div>
//         {/* Data Rows from the dynamically chosen schedule */}
//         {Object.entries(schedule).map(([day, statuses]) => (
//           <React.Fragment key={day}>
//             <div className={`mt-4 border-t pt-3 font-medium text-gray-800`}>
//               {day}
//             </div>
//             {statuses.map((status, i) => (
//               <div
//                 key={i}
//                 className={`mt-4 border-t pt-3 text-center font-medium ${
//                   status === "Working Day" ? "text-sky-600" : "text-gray-400"
//                 }`}
//               >
//                 {status}
//               </div>
//             ))}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Main component that displays all professional information
// const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
//   data,
//   onEdit,
// }) => {
//   const { professional } = data;
//   return (
//     <>
//       {/* Professional Details Section */}
//       <div>
//         <SectionHeader
//           title="Professional Info"
//           action={<EditButton onClick={onEdit} />}
//         />
//         <div className="space-y-2 border-b">
//           <DetailItem
//             label="Joining Date"
//             value={new Date(professional.joiningDate).toLocaleDateString()}
//           />
//           <DetailItem label="Location" value={professional.location} />
//           <DetailItem label="Department" value={professional.department} />
//           <DetailItem label="Designation" value={professional.designation} />
//           <div className="flex items-center justify-between py-1">
//             <p className="text-sm text-gray-600">CTC</p>
//             <div className="flex items-center space-x-4">
//               <p className="text-sm font-semibold text-gray-800">
//                 {professional.ctcAnnual}
//               </p>
//               <button
//                 onClick={() => alert("View CTC Breakup Clicked!")}
//                 className="text-sm font-medium text-blue-600 hover:underline"
//               >
//                 View CTC Breakup
//               </button>
//             </div>
//           </div>
//           <DetailItem
//             label="Payslip Component"
//             value={professional.payslipComponent}
//           />
//           <DetailItem label="Tax Regime" value={"OM"} />
//           <DetailItem label="Holiday Group" value={professional.holidayGroup} />
//           <DetailItem label="Role" value={"Manager"} />
//           <DetailItem
//             label="Reporting Manager"
//             value={professional.reportingManager}
//           />
//           <DetailItem label="Rental City" value={"Jaipur"} />
//           <DetailItem label="Leaving Date" value={"25-Jan-2018"} />
//         </div>
//       </div>

//       {/* Conditionally render the schedule card and pass the work pattern prop */}
//       {/* This will only render the card if a `workWeek` value exists in the data */}
//       {professional.workWeek && (
//         <WorkWeekSchedule workPattern={professional.workWeek} />
//       )}
//     </>
//   );
// };

// export default ProfessionalInfo;
import React from "react";
import toast from "react-hot-toast"; // New: Import toast
import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
import { DetailItem, SectionHeader, EditButton } from "../common/DetailItem";

interface ProfessionalInfoProps {
  data: EmployeeDetail;
  onEdit: () => void;
}

// Helper Component for the Work Week card
interface WorkWeekScheduleProps {
  workPattern: string;
}

const WorkWeekSchedule: React.FC<WorkWeekScheduleProps> = ({ workPattern }) => {
  let schedule;
  const title = workPattern;

  if (workPattern === "5 days Week") {
    schedule = {
      Sunday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
      Monday: ["Working Day", "Working Day", "Working Day", "Working Day"],
      Tuesday: ["Working Day", "Working Day", "Working Day", "Working Day"],
      Wednesday: ["Working Day", "Working Day", "Working Day", "Working Day"],
      Thursday: ["Working Day", "Working Day", "Working Day", "Working Day"],
      Friday: ["Working Day", "Working Day", "Working Day", "Working Day"],
      Saturday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
    };
  } else {
    schedule = {
      Sunday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
      Monday: ["Working Day", "Working Day", "Working Day", "Working Day"],
      Tuesday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
      Wednesday: ["Working Day", "Working Day", "Working Day", "Working Day"],
      Thursday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
      Friday: ["Working Day", "Working Day", "Working Day", "Working Day"],
      Saturday: ["WeekOff", "WeekOff", "WeekOff", "WeekOff"],
    };
  }

  return (
    <div className="mt-6 w-full overflow-hidden rounded-lg bg-white shadow-md">
      <div className="bg-purple-600 p-3 text-center">
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-5 gap-x-4 p-4 text-sm">
        <div className="font-bold text-gray-500"></div>{" "}
        <div className="text-center font-bold text-gray-500">Week 1</div>
        <div className="text-center font-bold text-gray-500">Week 2</div>
        <div className="text-center font-bold text-gray-500">Week 3</div>
        <div className="text-center font-bold text-gray-500">Week 4</div>
        {Object.entries(schedule).map(([day, statuses]) => (
          <React.Fragment key={day}>
            <div className={`mt-4 border-t pt-3 font-medium text-gray-800`}>
              {day}
            </div>
            {statuses.map((status, i) => (
              <div
                key={i}
                className={`mt-4 border-t pt-3 text-center font-medium ${
                  status === "Working Day" ? "text-sky-600" : "text-gray-400"
                }`}
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

// Main component that displays all professional information
const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({
  data,
  onEdit,
}) => {
  const { professional } = data;

  // New: A handler to show a toast. In a real app, this would open a modal.
  const handleViewBreakup = () => {
    toast("Opening CTC breakup details...", {
      icon: "📄",
      className: "bg-blue-50 text-blue-800",
    });
  };

  return (
    <>
      {/* Professional Details Section */}
      <div>
        <SectionHeader
          title="Professional Info"
          action={<EditButton onClick={onEdit} />}
        />
        <div className="space-y-2 border-b">
          <DetailItem
            label="Joining Date"
            value={new Date(professional.joiningDate).toLocaleDateString()}
          />
          <DetailItem label="Location" value={professional.location} />
          <DetailItem label="Department" value={professional.department} />
          <DetailItem label="Designation" value={professional.designation} />
          <div className="flex items-center justify-between py-1">
            <p className="text-sm text-gray-600">CTC</p>
            <div className="flex items-center space-x-4">
              <p className="text-sm font-semibold text-gray-800">
                {professional.ctcAnnual}
              </p>
              {/* Modified: Replaced alert with the new toast handler */}
              <button
                onClick={handleViewBreakup}
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
          <DetailItem label="Tax Regime" value={"OM"} />
          <DetailItem label="Holiday Group" value={professional.holidayGroup} />
          <DetailItem label="Role" value={"Manager"} />
          <DetailItem
            label="Reporting Manager"
            value={professional.reportingManager}
          />
          <DetailItem label="Rental City" value={"Jaipur"} />
          <DetailItem label="Leaving Date" value={"25-Jan-2018"} />
        </div>
      </div>

      {professional.workWeek && (
        <WorkWeekSchedule workPattern={professional.workWeek} />
      )}
    </>
  );
};

export default ProfessionalInfo;