import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// Import the separated sidebar component and the menuItems array
import ProfileSidebar, { menuItems } from "../layout/ProfileSidebar";

// --- MOCK DATA SOURCE ---
// This simulates a database of detailed employee profiles.
// The `employeeId` should match the `code` from your EmployeesTable.
const ALL_EMPLOYEES_DETAILS = [
  {
    name: "Cody Fisher",
    employeeId: "1651",
    status: "Active",
    dob: "15/02/1990",
    gender: "Male",
    phone: "9876543211",
    maritalStatus: "Married",
    email: "cody.fisher@example.com",
    secondaryEmail: "--",
    pan: "ABCD1234E",
    aadhar: "112233445566",
    currentAddress: "123 Tech Park, Noida",
    permanentAddress: "456 Home Town, Delhi",
    totalExperience: "4+",
    login: {
      username: "1651",
      enabled: "Enable",
      locked: "Disable",
    },
    avatarUrl: "https://i.pravatar.cc/128?u=codyfisher",
  },
  {
    name: "Robert Fox",
    employeeId: "8542",
    status: "Inactive",
    dob: "20/10/1995",
    gender: "Male",
    phone: "9876543212",
    maritalStatus: "Single",
    email: "robert.fox@example.com",
    secondaryEmail: "rfox@personal.com",
    pan: "FGHI5678J",
    aadhar: "223344556677",
    currentAddress: "789 Innovation Hub, Noida",
    permanentAddress: "101 Native Place, Jaipur",
    totalExperience: "3+",
    login: {
      username: "8542",
      enabled: "Disable",
      locked: "Enable",
    },
    avatarUrl: "https://i.pravatar.cc/128?u=robertfox",
  },
  {
    name: "Arlene McCoy",
    employeeId: "1152",
    status: "Active",
    dob: "21/12/1988",
    gender: "Female",
    phone: "9876543213",
    maritalStatus: "Married",
    email: "arlene.mccoy@example.com",
    secondaryEmail: "--",
    pan: "KLMN9101P",
    aadhar: "334455667788",
    currentAddress: "456 Corporate Towers, Noida",
    permanentAddress: "789 Family House, Noida",
    totalExperience: "8+",
    login: {
      username: "1152",
      enabled: "Enable",
      locked: "Disable",
    },
    avatarUrl: "https://i.pravatar.cc/128?u=arlenemccoy",
  },
];

// --- TYPE DEFINITIONS ---
type EmployeeData = (typeof ALL_EMPLOYEES_DETAILS)[0];

interface DetailItemProps {
  label: string;
  value: string | number;
}

interface SectionHeaderProps {
  title: string;
  action?: React.ReactNode;
}

// --- REUSABLE UI COMPONENTS (Unchanged) ---
const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action }) => (
  <div className="flex justify-between items-center pb-4">
    <h3 className="text-lg font-semibold text-[#741CDD]">{title}</h3>
    {action}
  </div>
);

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-800">{value}</p>
  </div>
);

const EditButton = () => (
  <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
    Edit
  </button>
);

// --- CONTENT SECTION COMPONENTS ---
const GeneralInfo: React.FC<{ data: EmployeeData }> = ({ data }) => (
  <div className="space-y-8">
    <section>
      <SectionHeader title="General Info" action={<EditButton />} />
      <div className="flex justify-center py-6">
        <div className="relative">
          <img
            src={data.avatarUrl}
            alt="Employee Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            onError={(e) => {
              const initials =
                data.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("") || "??";
              e.currentTarget.src = `https://placehold.co/128x128/E8E8E8/4A4A4A?text=${initials}`;
            }}
          />
          <button className="absolute bottom-1 right-1 bg-[#741CDD] text-white rounded-full p-2 hover:bg-[#5a16ad] transition-colors shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <DetailItem label="Name" value={data.name} />
        <DetailItem label="Employee ID" value={data.employeeId} />
        <DetailItem label="Status" value={data.status} />
        <DetailItem label="DOB" value={data.dob} />
        <DetailItem label="Gender" value={data.gender} />
        <DetailItem label="Phone Number" value={data.phone} />
        <DetailItem label="Marital Status" value={data.maritalStatus} />
        <DetailItem label="Email Primary" value={data.email} />
        <DetailItem label="Secondary Email" value={data.secondaryEmail} />
        <DetailItem label="PAN Number" value={data.pan} />
        <DetailItem label="Aadhar Number" value={data.aadhar} />
        <DetailItem label="Current Address" value={data.currentAddress} />
        <DetailItem label="Permanent Address" value={data.permanentAddress} />
        <DetailItem label="Total Experience" value={data.totalExperience} />
      </div>
    </section>
    <section>
      <SectionHeader title="Login Details" action={<EditButton />} />
      <div className="space-y-2">
        <DetailItem label="Username" value={data.login.username} />
        <DetailItem label="Login Enabled" value={data.login.enabled} />
        <DetailItem label="Account Locked" value={data.login.locked} />
      </div>
    </section>
  </div>
);

// --- PLACEHOLDER COMPONENTS (Unchanged) ---
const PlaceholderComponent: React.FC<{ title: string }> = ({ title }) => (
  <div>
    <SectionHeader title={title} action={<EditButton />} />
    <div className="bg-gray-50 p-6 rounded-lg border border-dashed text-center text-gray-500">
      <p>Content for {title} will be displayed here.</p>
      <p className="text-sm mt-1">This is a placeholder component.</p>
    </div>
  </div>
);

const ProfessionalInfo = () => (
  <PlaceholderComponent title="Professional Details" />
);
// ... (Other placeholder components are unchanged) ...
const Projects = () => <PlaceholderComponent title="Projects" />;

// --- MAIN PAGE COMPONENT ---
export default function EmployeeDetailPage() {
  const { employeeCode } = useParams<{ employeeCode: string }>();
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<string>("general");

  useEffect(() => {
    setLoading(true);
    // In a real app, you would fetch from an API. Here we simulate it.
    console.log(`Searching for employee with code: ${employeeCode}`);
    if (employeeCode) {
      setTimeout(() => {
        const foundEmployee = ALL_EMPLOYEES_DETAILS.find(
          (emp) => emp.employeeId === employeeCode
        );
        setEmployee(foundEmployee || null);
        setLoading(false);
      }, 500); // Simulate network delay
    } else {
      setLoading(false);
    }
  }, [employeeCode]);

  const renderSection = () => {
    if (!employee) return null; // Should not happen due to checks below, but good practice

    switch (currentSection) {
      case "general":
        return <GeneralInfo data={employee} />;
      case "professional":
        return <ProfessionalInfo />;
      // ... (add other cases as you build them out) ...
      default:
        // Find the title for the placeholder
        const item =
          menuItems.find(
            (m: string) =>
              m.toLowerCase().replace(/, | & | /g, "_") === currentSection
          ) || currentSection;
        return <PlaceholderComponent title={item} />;
    }
  };

  const getSectionTitle = () => {
    const item = menuItems.find(
      (m: string) =>
        m.toLowerCase().replace(/, | & | /g, "_") === currentSection
    );
    return item
      ? item
          .split(" ")
          .map(
            (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          )
          .join(" ")
      : "Details";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading Employee Details...
        </p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50 text-center">
        <h1 className="text-2xl font-bold text-red-600">Employee Not Found</h1>
        <p className="text-md text-gray-600 mt-2">
          No employee with ID '{employeeCode}' could be found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard / Employee Setup / List / Detail /{" "}
            <span className="text-[#741CDD] font-medium">
              {getSectionTitle()}
            </span>
          </p>
        </header>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <ProfileSidebar
            activeItem={currentSection}
            onSectionChange={setCurrentSection}
          />
          <main className="flex-grow w-full bg-white p-6 rounded-lg border border-gray-200">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  );
}
