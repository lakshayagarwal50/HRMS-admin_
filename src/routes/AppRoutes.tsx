import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import AuthLayout from "../layout/AuthLayout";
import DepartmentPage from "../pages/GettingStarted/Department/DepartmentPage";
import DesignationPage from "../pages/GettingStarted/Designation.tsx/DesignationPage";
import RolePage from "../pages/GettingStarted/Role/RolePage";
import WorkingPatternsPage from "../pages/GettingStarted/WorkingPattern/WorkingPatternsPage";
import OrganizationSettingsPage from "../pages/GettingStarted/OraganisationSetting/OrganizationSettingsPage";
import WebCheckinSettingsPage from "../pages/GettingStarted/WebCheckinSettings/WebCheckinSettingsPage";
import LocationPage from "../pages/GettingStarted/Location/LocationPage";
import HolidayConfigurationPage from "../pages/GettingStarted/HolidayConfiguration/HolidayConfigurationPage";
import LeaveSetupPage from "../pages/LeaveConfiguration/LeaveSetupPage";
import CommingSoon from "../components/NotFound/CommingSoon";
import HolidayCalendarPage from "../pages/GettingStarted/HolidayCalendar/HolidayCalenderPage";
import EmployeeLeaveRequestPage from "../pages/LeaveConfiguration/EmployeeLeaveRequestPage";
import RecordPage from "../pages/Rating/RecordPage";
import EmployeesRatingPage from "../pages/Rating/EmployeesRatingPage";
import ViewRatingDetailPage from "../pages/Rating/ViewRatingDetailPage";
import PayslipComponentsPage from "../pages/GettingStarted/PayslipComponents/PayslipComponentsPage";
import SalaryComponentPage from "../pages/GettingStarted/PayslipComponents/SalaryComponentPage";
import SequenceNumberPage from "../pages/GettingStarted/SequenceNumber/SequenceNumberPage";
import EditSalaryComponentPage from "../pages/GettingStarted/PayslipComponents/EditSalaryComponentPage";
import AddSalaryComponentPage from "../pages/GettingStarted/PayslipComponents/AddSalaryComponentPage";
import PayrollConfigurationPage from "../pages/GettingStarted/PayrollConfigurationPage/PayrollConfigurationPage";
import CreateRolePage from "../pages/GettingStarted/Role/CreateRolePage";
import RatingCriteriaPage from "../pages/Rating/RatingCriteriaPage";

const Login = lazy(() => import("../features/auth/pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard/DashboardPage"));
const GettingStarted = lazy(
  () => import("../pages/GettingStarted/GettingStartedPage")
);
const EmployeesTable = lazy(
  () => import("../features/EmployeeSetup/list/pages/EmployeesTable")
);
const SalaryComponent = lazy(
  () => import("../features/EmployeeSetup/list/pages/SalaryComponent")
);
const EmployeeDetailPage = lazy(
  () => import("../features/EmployeeSetup/list/pages/EmployeeDetailPage")
);

const CreateEmployeeForm = lazy(
  () => import("../features/EmployeeSetup/CreateEmployee/pages/CreateEmployee")
);
const UploadEmployee = lazy(
  () => import("../features/EmployeeSetup/Uploademployee/pages/Uploademployee")
);
const DisplayLoans = lazy(
  () => import("../pages/LoanAndAdvances/displayLoans")
);
const LoanDetailPage = lazy(
  () => import("../pages/LoanAndAdvances/displayLoanDetail")
);
const DisplayDSR = lazy(() => import("../pages/DSR/displayDSR"));
// const DSRDetailPage = lazy(() => import("../pages/DSR/displayDSRDetail"));

const Projects = lazy(
  () => import("../features/Projects/list/pages/ProjectList")
);
const ProjectsDetailsPage = lazy(
  () => import("../features/Projects/Details/ProjectDetailPage")
);
const AttendanceSummary = lazy(
  () => import("../features/Attendance/pages/AttendanceSummary")
);
const UploadAttendance = lazy(
  () => import("../features/Attendance/pages/UploadAttendance")
);
const PayrollList = lazy(
  ()=> import("../features/payroll/pages/PayrollList")
)

const AppRoutes = () => (
  <Suspense
    fallback={
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    }
  >
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/getting-started" element={<GettingStarted />} />
        <Route path="/employees/list" element={<EmployeesTable />} />
        <Route
          path="/employees/list/SalaryComponent"
          element={
            <SalaryComponent
              employeeCode={""}
              employeeName={""}
              selectedMonth={""}
              selectedYear={""}
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
            /> //create payslip
          }
        />
        <Route
          path="/employees/list/detail/:employeeCode/:employeeId"
          element={<EmployeeDetailPage />}
        />
        <Route path="/employees/create" element={<CreateEmployeeForm />} />
        <Route path="/employees/create" element={<CreateEmployeeForm />} />
        <Route path="/employees/upload" element={<UploadEmployee />} />

        <Route path="/department" element={<DepartmentPage />} />
        <Route path="/designation" element={<DesignationPage />} />
        <Route path="/role" element={<RolePage />} />
        <Route path="/roles/add" element={<CreateRolePage />} />
        <Route path="/working-patterns" element={<WorkingPatternsPage />} />
        <Route
          path="/organisation-setting"
          element={<OrganizationSettingsPage />}
        />
        <Route
          path="/web-checkin-setting"
          element={<WebCheckinSettingsPage />}
        />
        <Route path="/location" element={<LocationPage />} />
        <Route
          path="/holiday-configuration"
          element={<HolidayConfigurationPage />}
        />
        <Route path="/leave/setup" element={<LeaveSetupPage />} />
        <Route path="/leave/request" element={<EmployeeLeaveRequestPage />} />
        <Route path="/holiday-calendar" element={<HolidayCalendarPage />} />
        <Route path="/loanandandvance" element={<DisplayLoans />} />
        <Route
          path="/loanandandvance/list/detail/:id"
          element={<LoanDetailPage />}
        />
        <Route path="/dsr" element={<DisplayDSR />} />
        {/* <Route path="/dsr/list/detail/:id" element={<DSRDetailPage />} /> */}

        <Route path="*" element={<CommingSoon />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/detail/:id" element={<ProjectsDetailsPage />} />
        <Route path="/projects/detail/:id" element={<ProjectsDetailsPage />} />
        <Route path="/rating/record" element={<RecordPage />} />
        <Route
          path="/rating/employees rating"
          element={<EmployeesRatingPage />}
        />
        <Route path="/rating/detail/:id" element={<ViewRatingDetailPage />} />
        <Route path="/rating/criteria" element={<RatingCriteriaPage />} />
        <Route path="/payslip-components" element={<PayslipComponentsPage />} />
        <Route
          path="/employee-salary-structures/:structureId/components"
          element={<SalaryComponentPage />}
        />
        <Route
          path="/employee-salary-structures/:structureId/components/:componentId"
          element={<EditSalaryComponentPage />}
        />
        <Route
          path="/employee-salary-structures/:structureId/add-component"
          element={<AddSalaryComponentPage />}
        />
        <Route path="/sequence-number" element={<SequenceNumberPage />} />
        <Route
          path="/payroll-configuration"
          element={<PayrollConfigurationPage />}
        />
        <Route path="/payslip-components" element={<PayslipComponentsPage />} />
        <Route
          path="/employee-salary-structures/${row.id}/components"
          element={<SalaryComponentPage />}
        />
        <Route path="/sequence-number" element={<SequenceNumberPage />} />
        <Route path="/attendance/summary" element={<AttendanceSummary />} />
        <Route path="/attendance/upload" element={<UploadAttendance />} />
        <Route path="/payroll/list" element={<PayrollList />} />
        
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
