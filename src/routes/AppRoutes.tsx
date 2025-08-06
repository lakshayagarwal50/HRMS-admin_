
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
        <Route path="/working-patterns" element={<WorkingPatternsPage />} />
        <Route path="/organisation-setting" element={<OrganizationSettingsPage />}/>
        <Route path="/web-checkin-setting" element={<WebCheckinSettingsPage/>}/>
        <Route path="/location" element={<LocationPage/>}/>
        <Route path="/holiday-configuration" element={<HolidayConfigurationPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
