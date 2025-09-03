import React from "react";
import type { EmployeeDetail } from "../../../../store/slice/employeeSlice";
import { SectionHeader } from "../common/DetailItem";
import ActivityItem, { type Activity } from "./ActivityItem"; 

interface EmployeeActivitiesProps {
  data: EmployeeDetail;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    date: "12/02/2022",
    time: "12:09 PM",
    description:
      "Payslip [July-2021] for [1001] [Alex Campbell] is now canceled.",
    authorName: "Alex Campbell",
    authorAvatarUrl: "https://i.pravatar.cc/40?u=a042581f4e29026704d",
  },
  {
    id: "2",
    date: "12/02/2022",
    time: "12:09 PM",
    description: "Name Changed from Manish Sharma to Breezyn brink",
    authorName: "alexcampbell@gmail.com",
    authorAvatarUrl: "https://i.pravatar.cc/40?u=a042581f4e29026704d",
  },
  {
    id: "3",
    date: "12/02/2022",
    time: "12:09 PM",
    description:
      "Payslip [July-2021] for [1001] [Alex Campbell] is now Approved.",
    authorName: "System User",
  },
  {
    id: "4",
    date: "12/02/2022",
    time: "12:09 PM",
    description:
      "Payslip [July-2021] for [1001] [Alex Campbell] is now locked.",
    authorName: "System User",
  },
];

const EmployeeActivities: React.FC<EmployeeActivitiesProps> = ({ data }) => {
  
  const activities = mockActivities;
  const hasActivities = activities.length > 0;

  return (
    <div>
      <SectionHeader title="Employee Activities" />
      {hasActivities ? (
        <div className="mt-4">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg border border-dashed text-center text-gray-500">
          <p>No activities found for this employee.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeActivities;
