//imports
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Filter } from "lucide-react";
import Table, { type Column } from "../../../components/common/Table"; 

//interface
interface AuditLog {
  id: number;
  activityTime: string;
  object: string;
  type: {
    name: string;
    severity: "Info" | "Warning" | "Error";
  };
  message: string;
  who: string;
}

//mock data
const mockData: AuditLog[] = [
  {
    id: 1,
    activityTime: "15 Jan 2023, 15:02",
    object: "jackson.graham@example.com",
    type: { name: "Ramesh Sharma", severity: "Info" },
    message: "Attendance(Date=01/10/2022) is Created",
    who: "Admin email ID",
  },
  {
    id: 2,
    activityTime: "30 Dec 2022, 15:02",
    object: "felicia.reid@example.com",
    type: { name: "Richa Verma", severity: "Info" },
    message: "Attendance(Date=02/10/2022) is Created",
    who: "Admin email ID",
  },
  {
    id: 3,
    activityTime: "12 Nov 2022, 15:02",
    object: "jessica.hanson@example.com",
    type: { name: "Raghu Nadh", severity: "Info" },
    message: "PostDateStatus Changed from false to true",
    who: "Admin email ID",
  },
  {
    id: 4,
    activityTime: "3 Nov 2022, 15:02",
    object: "alma.lawson@example.com",
    type: { name: "Swapna Shinde", severity: "Info" },
    message: "Attendance(Date=03/10/2022) is Created",
    who: "Admin email ID",
  },
  {
    id: 5,
    activityTime: "17 Nov 2022, 15:02",
    object: "georgia.young@example.com",
    type: { name: "Yasmin Gowda", severity: "Info" },
    message: "Department(name=test,code=test2) is Created",
    who: "Admin email ID",
  },
  {
    id: 6,
    activityTime: "14 Oct 2022, 15:02",
    object: "nevaeh.simmons@example.com",
    type: { name: "Kapil Ojha", severity: "Info" },
    message: "Name Changed from test to test2",
    who: "Admin email ID",
  },
  {
    id: 7,
    activityTime: "20 Oct 2022, 15:02",
    object: "tanya.hill@example.com",
    type: { name: "Kishore Kumar", severity: "Info" },
    message: "Code Changed from test to test2",
    who: "Admin email ID",
  },
  {
    id: 8,
    activityTime: "13 Oct 2022, 15:02",
    object: "debra.holt@example.com",
    type: { name: "Anuja Shinde", severity: "Info" },
    message:
      "Employee(karthik123) logged In with IP(123.235.76.166, 34.111.160.148,35.191.15.5, 127.0.0.6) and OS:Windows, Browser:Chrome(106.0.0.0)",
    who: "Employee name",
  },
  {
    id: 9,
    activityTime: "12 Nov 2022, 11:02",
    object: "deanna.curtis@example.com",
    type: { name: "Priyanka Jadhav", severity: "Info" },
    message:
      "Employee(arun123) logged In with IP(123.235.76.166, 34.111.160.148,35.191.15.5) and OS:Windows, Browser:Chrome(106.0.0.0)",
    who: "Employee name",
  },
  {
    id: 10,
    activityTime: "1 Nov 2022, 15:02",
    object: "tim.jennings@example.com",
    type: { name: "Suraj Pandey", severity: "Info" },
    message:
      "Employee(arun123) logged In with IP(123.235.76.166, 34.111.160.148,35.191.15.5, 127.0.0.6) and OS:Windows, Browser:Chrome(106.0.0.0)",
    who: "Employee name",
  },
];

//main code
const AuditHistory: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const columns: Column<AuditLog>[] = [
    { key: "activityTime", header: "Activity Time" },
    { key: "object", header: "Object" },
    {
      key: "type",
      header: "Type",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.type.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-gray-500">Severity</p>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {row.type.severity}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "message",
      header: "Message",
      className: "whitespace-normal",
    },
    { key: "who", header: "Who?" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Audit History</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            <Link to="/dashboard">Dashboard</Link> /{" "}
            <Link to="/reports">Reports</Link> / Audit History
          </p>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#741CDD] text-white p-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <Table
            data={mockData}
            columns={columns}
            showSearch={false}
            showPagination={true}
            className="w-[1350px]"
          />
        </div>
      </div>

     
    </div>
  );
};

export default AuditHistory;
