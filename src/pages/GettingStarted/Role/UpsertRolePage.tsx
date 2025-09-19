// import React, { useState, useCallback, useEffect } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { AppDispatch, RootState } from '../../../store/store';
// import { addRole, updateRole, fetchRoleById, clearSelectedRole, type RolePayload, type role } from '../../../store/slice/roleSlice';
// import toast from 'react-hot-toast';

// type Permission = { name: string; enabled: boolean; };
// type PermissionGroup = { feature: string; permissions: Permission[]; };
// interface RoleFormData {
//     name: string;
//     code: string;
//     description: string;
//     permissions: Record<string, PermissionGroup>;
// }


// const createPermissions = (...names: string[]): Permission[] => names.map(name => ({ name, enabled: false }));

// const initialPermissions: Record<string, PermissionGroup> = {
//     myHolidays: { feature: 'My Holidays', permissions: createPermissions('view') },
//     holidayConfiguration: { feature: 'Holiday Configuration', permissions: createPermissions('view', 'add', 'edit', 'delete') },
//     holidayCalendar: { feature: 'Holiday Calendar', permissions: createPermissions('view', 'add', 'edit', 'delete') },
//     leaves: { feature: 'Leaves', permissions: [] },
//     leaveSetup: { feature: 'Leave Setup', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
//     myLeaves: { feature: 'My Leaves', permissions: createPermissions('view', 'add', 'cancel') },
//     teamLeaveRequests: { feature: 'Team Leave Requests', permissions: createPermissions('view', 'approve') },
//     employeeLeaveRequests: { feature: 'Employee Leave Requests', permissions: createPermissions('view', 'add', 'approve') },
//     dsr: { feature: 'DSR', permissions: [] },
//     myDSR: { feature: 'My DSR', permissions: createPermissions('view', 'add', 'edit') },
//     teamDSRRequests: { feature: 'Team DSR Requests', permissions: createPermissions('view', 'approve') },
//     employeesDSRRequests: { feature: 'Employees DSR Requests', permissions: createPermissions('view', 'approve') },
//     attendance: { feature: 'Attendance', permissions: [] },
//     myAttendance: { feature: 'My Attendance', permissions: createPermissions('view', 'add') },
//     teamAttendanceSummary: { feature: 'Team Attendance Summary', permissions: createPermissions('view') },
//     employeesAttendanceSummary: { feature: 'Employees Attendance Summary', permissions: createPermissions('view', 'add', 'edit', 'upload') },
//     ratings: { feature: 'Ratings', permissions: [] },
//     ratingConfiguration: { feature: 'Rating Configuration', permissions: createPermissions('view', 'add', 'edit') },
//     myMonthlyRatings: { feature: 'My Monthly Ratings', permissions: createPermissions('view', 'add', 'edit') },
//     myPerformance: { feature: 'My Performance', permissions: createPermissions('view') },
//     rateTeamMembers: { feature: 'Rate Team Members', permissions: createPermissions('view', 'add', 'edit') },
//     loanAndAdvances: { feature: 'Loan & advances', permissions: [] },
//     myLoanAndAdvances: { feature: 'My Loan and Advances', permissions: createPermissions('view', 'add', 'edit') },
//     employeesLoanAdvancesRequests: { feature: 'Employees Loan & Advances Requests', permissions: createPermissions('view', 'edit', 'approve') },
//     projects: { feature: 'Projects', permissions: [] },
//     myProjects: { feature: 'My Projects', permissions: createPermissions('view') },
//     allProjects: { feature: 'All Projects', permissions: createPermissions('view', 'edit', 'changeStatus', 'addResource', 'release', 'delete') },
//     payslips: { feature: 'Payslips', permissions: [] },
//     myPayslips: { feature: 'My Payslips', permissions: createPermissions('view') },
//     employeesPayslips: { feature: 'Employees Payslips', permissions: createPermissions('view', 'create', 'process', 'cancel', 'release') },
//     declaration: { feature: 'Declaration', permissions: [] },
//     myDeclaration: { feature: 'My Declaration', permissions: createPermissions('view', 'add', 'edit') },
//     employeesDeclaration: { feature: 'Employees Declaration', permissions: createPermissions('view', 'edit') },
//     reports: { feature: 'Reports', permissions: createPermissions('view', 'add', 'edit', 'delete', 'download') },
//     myForm16: { feature: 'My Form 16', permissions: createPermissions('download') },
//     employeesForm16: { feature: 'Employees Form 16', permissions: createPermissions('upload', 'download') },
//     employeeSetUp: { feature: 'Employee set up', permissions: [] },
//     allEmployees: { feature: 'All Employees', permissions: createPermissions('view', 'add', 'delete', 'changeStatus', 'createPayslip', 'upload') },
//     employeesGeneralInfo: { feature: 'Employees General Info', permissions: createPermissions('view', 'add', 'edit') },
//     employeesProfessionalInfo: { feature: 'Employees Professional Info', permissions: createPermissions('view', 'add', 'edit') },
//     employeesBankDetails: { feature: 'Employees Bank Details', permissions: createPermissions('view', 'add', 'edit') },
//     employeesPFESI_PT: { feature: 'Employees PF, ESI & PT', permissions: createPermissions('view', 'add', 'edit') },
//     employeesPreviousJobDetails: { feature: 'Employees Previous Job Details', permissions: createPermissions('view', 'add', 'edit') },
//     employeesSalaryDistribution: { feature: 'Employees Salary Distribution', permissions: createPermissions('view', 'edit') },
//     employeesActivities: { feature: 'Employees Activities', permissions: createPermissions('view') },
//     projectsColumn2: { feature: 'Projects', permissions: createPermissions('view', 'release') },
//     myProfile: { feature: 'My profile', permissions: [] },
//     myGeneralInfo: { feature: 'My General Info', permissions: createPermissions('view', 'edit') },
//     myProfessionalInfo: { feature: 'My Professional Info', permissions: createPermissions('view') },
//     myBankDetails: { feature: 'My Bank Details', permissions: createPermissions('view') },
//     myPFESI_PT: { feature: 'My PF, ESI & PT', permissions: createPermissions('view') },
//     myPreviousJobDetails: { feature: 'My Previous Job Details', permissions: createPermissions('view', 'add', 'edit') },
//     payroll: { feature: 'Payroll', permissions: createPermissions('view', 'add', 'edit') },
//     crystalRun: { feature: 'Crystal Run', permissions: createPermissions('view', 'add', 'edit') },
//     masterConfiguration: { feature: 'Master configuration', permissions: [] },
//     workingPattern: { feature: 'Working Pattern', permissions: createPermissions('view', 'add', 'edit') },
//     department: { feature: 'Department', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
//     designation: { feature: 'Designation', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
//     roles: { feature: 'Roles', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
//     locations: { feature: 'Locations', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
//     payslipComponents: { feature: 'Payslip Components', permissions: createPermissions('view', 'add', 'edit') },
//     organizationSettings: { feature: 'Organization Settings', permissions: createPermissions('view') },
//     sequenceNumber: { feature: 'Sequence Number', permissions: createPermissions('view', 'add') },
//     payrollConfiguration: { feature: 'Payroll Configuration', permissions: createPermissions('view', 'add', 'edit') },
//     webCheckInSettings: { feature: 'Web Check-in Settings', permissions: createPermissions('view', 'add', 'edit') },
// };

// const transformPermissionsForAPI = (permissions: Record<string, PermissionGroup>) => {
//     const apiPermissions: Record<string, Record<string, boolean>> = {};
//     for (const key in permissions) {
//         const group = permissions[key];
//         if (group.permissions.length > 0) {
//             apiPermissions[group.feature] = group.permissions.reduce((acc, perm) => {
//                 acc[perm.name] = perm.enabled;
//                 return acc;
//             }, {} as Record<string, boolean>);
//         }
//     }
//     return apiPermissions;
// };

// const transformApiPermissionsToState = (apiPermissions: Record<string, Record<string, boolean>>): Record<string, PermissionGroup> => {
//     const statePermissions = JSON.parse(JSON.stringify(initialPermissions)); // Deep copy
//     for (const featureName in apiPermissions) {
//         const groupKey = Object.keys(statePermissions).find(key => statePermissions[key].feature === featureName);
//         if (groupKey) {
//             const permissionStates = apiPermissions[featureName];
//             statePermissions[groupKey].permissions.forEach((perm: Permission) => {
//                 if (permissionStates[perm.name] !== undefined) {
//                     perm.enabled = permissionStates[perm.name];
//                 }
//             });
//         }
//     }
//     return statePermissions;
// };



// const UpsertRolePage: React.FC = () => {
//     const { roleId } = useParams<{ roleId: string }>();
//     const navigate = useNavigate();
//     const dispatch = useDispatch<AppDispatch>();
    
//     const { selectedRole, selectedStatus } = useSelector((state: RootState) => state.roles);
    
//     const isEditMode = !!roleId;

//     const [formData, setFormData] = useState<RoleFormData>({
//         name: '',
//         code: '',
//         description: '',
//         permissions: initialPermissions,
//     });

    
//     useEffect(() => {
//         if (isEditMode && roleId) {
//             dispatch(fetchRoleById(roleId));
//         } else {
          
//             setFormData({
//                 name: '',
//                 code: '',
//                 description: '',
//                 permissions: initialPermissions,
//             });
//         }
        
//         return () => {
//             dispatch(clearSelectedRole());
//         }
//     }, [dispatch, roleId, isEditMode]);

    
//     useEffect(() => {
//         if (isEditMode && selectedRole) {
//             setFormData({
//                 name: selectedRole.name,
//                 code: selectedRole.code,
//                 description: selectedRole.description,
//                 permissions: transformApiPermissionsToState(selectedRole.permissions),
//             });
//         }
//     }, [selectedRole, isEditMode]);

//     const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     }, []);

//     const handlePermissionChange = useCallback((groupKey: string, permissionName: string, isEnabled: boolean) => {
//         setFormData(prev => {
//             const newPermissions = { ...prev.permissions };
//             const group = newPermissions[groupKey];
//             const permIndex = group.permissions.findIndex(p => p.name === permissionName);
//             if (permIndex > -1) {
//                 newPermissions[groupKey].permissions[permIndex].enabled = isEnabled;
//             }
//             return { ...prev, permissions: newPermissions };
//         });
//     }, []);

//  const handleSubmit = useCallback((e: React.FormEvent) => {
//     e.preventDefault();

//     const payload: RolePayload = {
//         name: formData.name,
//         code: formData.code,
//         description: formData.description,
//         status: selectedRole?.status || 'Active',
//         permissions: transformPermissionsForAPI(formData.permissions),
//     };

//     if (isEditMode && roleId) {
//         dispatch(updateRole({ id: roleId, ...payload }))
//             .then(() => {
//                 toast.success('Role updated successfully!');
//                 navigate('/role');
//             })
//             .catch(() => {
//                 toast.error('Failed to update role.');
//             });
//     } else {
//         dispatch(addRole(payload))
//             .then(() => {
//                 toast.success('Role added successfully!');
//                 navigate('/role');
//             })
//             .catch(() => {
//                 toast.error('Failed to add role.');
//             });
//     }
// }, [formData, dispatch, navigate, isEditMode, roleId, selectedRole]);


//     const permissionKeysCol1 = ['myHolidays', 'holidayConfiguration', 'holidayCalendar', 'leaves', 'leaveSetup', 'myLeaves', 'teamLeaveRequests', 'employeeLeaveRequests', 'dsr', 'myDSR', 'teamDSRRequests', 'employeesDSRRequests', 'attendance', 'myAttendance', 'teamAttendanceSummary', 'employeesAttendanceSummary', 'ratings', 'ratingConfiguration', 'myMonthlyRatings', 'myPerformance', 'rateTeamMembers', 'loanAndAdvances', 'myLoanAndAdvances', 'employeesLoanAdvancesRequests', 'projects', 'myProjects', 'allProjects', 'payslips', 'myPayslips', 'employeesPayslips', 'declaration', 'myDeclaration', 'employeesDeclaration', 'reports'];
//     const permissionKeysCol2 = ['myForm16', 'employeesForm16', 'employeeSetUp', 'allEmployees', 'employeesGeneralInfo', 'employeesProfessionalInfo', 'employeesBankDetails', 'employeesPFESI_PT', 'employeesPreviousJobDetails', 'employeesSalaryDistribution', 'employeesActivities', 'projectsColumn2', 'myProfile', 'myGeneralInfo', 'myProfessionalInfo', 'myBankDetails', 'myPFESI_PT', 'myPreviousJobDetails', 'payroll', 'crystalRun', 'masterConfiguration', 'workingPattern', 'department', 'designation', 'roles', 'locations', 'payslipComponents', 'organizationSettings', 'sequenceNumber', 'payrollConfiguration', 'webCheckInSettings'];

//     return (
//         <div className="w-full bg-gray-50 p-4 sm:p-6">
//              <header className="mb-6">
//                 <div className="flex justify-between items-center">
//                     <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Role' : 'Create Role'}</h1>
//                     <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
//                         <Link to="/role" className="hover:text-gray-700">Roles</Link>
//                         <ChevronRight size={16} className="mx-1" />
//                         <span className="font-medium text-gray-800">{isEditMode ? 'Edit' : 'Create'}</span>
//                     </nav>
//                 </div>
//             </header>
            
//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                         <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
//                         <input type="text" id="name" name="name" placeholder='eg: HR' value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
//                     </div>
//                     <div>
//                         <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Code</label>
//                         <input type="text" id="code" name="code" placeholder='eg: 1001' value={formData.code} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
//                     </div>
//                     <div className="md:col-span-2">
//                         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                         <textarea id="description" name="description" placeholder='this is description area' value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
//                     </div>
//                 </div>

//                 <div className="space-y-4">
//                     <div className="bg-purple-600 text-white p-3 rounded-md">
//                         <h3 className="font-semibold">PERMISSIONS</h3>
//                         <p className="text-xs text-purple-200">Control The Access Of App Designation By Enabling/Disabling Permissions</p>
//                     </div>

//                     <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-4">
//                         <div>
//                             {permissionKeysCol1.map(key => {
//                                 const group = formData.permissions[key];
//                                 return <PermissionRow key={key} feature={group.feature} permissions={group.permissions} onPermissionChange={(perm, enabled) => handlePermissionChange(key, perm, enabled)} />;
//                             })}
//                         </div>
//                         <div>
//                             {permissionKeysCol2.map(key => {
//                                 const group = formData.permissions[key];
//                                 return <PermissionRow key={key} feature={group.feature} permissions={group.permissions} onPermissionChange={(perm, enabled) => handlePermissionChange(key, perm, enabled)} />;
//                             })}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="flex justify-start gap-4 pt-6 border-t">
//                     <button type="button" onClick={() => navigate('/role')} className="px-10 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
//                     <button type="submit" className="px-10 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">{isEditMode ? 'UPDATE' : 'SUBMIT'}</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// const PermissionCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void; }> = ({ label, checked, onChange }) => (
//     <div className="flex items-center">
//         <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
//         <label className="ml-2 text-sm text-gray-700 capitalize">{label.replace(/([A-Z])/g, ' $1')}</label>
//     </div>
// );

// const PermissionRow: React.FC<{
//     feature: string;
//     permissions: Permission[];
//     onPermissionChange: (permissionName: string, isEnabled: boolean) => void;
// }> = ({ feature, permissions, onPermissionChange }) => {
//     if (permissions.length === 0) {
//         return <h3 className="text-md font-semibold text-gray-800 mt-4 pt-4 border-t">{feature}</h3>;
//     }
//     return (
//         <div className="grid grid-cols-12 gap-x-4 items-center py-2 border-t">
//             <p className="col-span-4 font-medium text-gray-600">{feature}</p>
//             <div className="col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-2">
//                 {permissions.map((perm) => (
//                     <PermissionCheckbox
//                         key={perm.name}
//                         label={perm.name}
//                         checked={perm.enabled}
//                         onChange={() => onPermissionChange(perm.name, !perm.enabled)}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };


// export default UpsertRolePage;

import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import type { AppDispatch, RootState } from '../../../store/store';
import { addRole, updateRole, fetchRoleById, clearSelectedRole, type RolePayload, type UpdateRolePayload } from '../../../store/slice/roleSlice';
import toast, { Toaster } from 'react-hot-toast';
// ✨ Lodash import has been removed

// Zod schema for form validation
const roleSchema = z.object({
  name: z.string().min(1, 'Role Name is required.').regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces.'),
  code: z.string().min(3, 'Code must be at least 3 digits.').max(6, 'Code cannot exceed 6 digits.').regex(/^\d+$/, 'Code must contain only digits.'),
  description: z.string().min(1, 'Description is required.'),
});

// Permission types and helper function
type Permission = { name: string; enabled: boolean; };
type PermissionGroup = { feature: string; permissions: Permission[]; };
interface RoleFormData { name: string; code: string; description: string; permissions: Record<string, PermissionGroup>; }
const createPermissions = (...names: string[]): Permission[] => names.map(name => ({ name, enabled: false }));

// Fully defined initial permissions object
const initialPermissions: Record<string, PermissionGroup> = {
    myHolidays: { feature: 'My Holidays', permissions: createPermissions('view') },
    holidayConfiguration: { feature: 'Holiday Configuration', permissions: createPermissions('view', 'add', 'edit', 'delete') },
    holidayCalendar: { feature: 'Holiday Calendar', permissions: createPermissions('view', 'add', 'edit', 'delete') },
    leaves: { feature: 'Leaves', permissions: [] },
    leaveSetup: { feature: 'Leave Setup', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
    myLeaves: { feature: 'My Leaves', permissions: createPermissions('view', 'add', 'cancel') },
    teamLeaveRequests: { feature: 'Team Leave Requests', permissions: createPermissions('view', 'approve') },
    employeeLeaveRequests: { feature: 'Employee Leave Requests', permissions: createPermissions('view', 'add', 'approve') },
    dsr: { feature: 'DSR', permissions: [] },
    myDSR: { feature: 'My DSR', permissions: createPermissions('view', 'add', 'edit') },
    teamDSRRequests: { feature: 'Team DSR Requests', permissions: createPermissions('view', 'approve') },
    employeesDSRRequests: { feature: 'Employees DSR Requests', permissions: createPermissions('view', 'approve') },
    attendance: { feature: 'Attendance', permissions: [] },
    myAttendance: { feature: 'My Attendance', permissions: createPermissions('view', 'add') },
    teamAttendanceSummary: { feature: 'Team Attendance Summary', permissions: createPermissions('view') },
    employeesAttendanceSummary: { feature: 'Employees Attendance Summary', permissions: createPermissions('view', 'add', 'edit', 'upload') },
    ratings: { feature: 'Ratings', permissions: [] },
    ratingConfiguration: { feature: 'Rating Configuration', permissions: createPermissions('view', 'add', 'edit') },
    myMonthlyRatings: { feature: 'My Monthly Ratings', permissions: createPermissions('view', 'add', 'edit') },
    myPerformance: { feature: 'My Performance', permissions: createPermissions('view') },
    rateTeamMembers: { feature: 'Rate Team Members', permissions: createPermissions('view', 'add', 'edit') },
    loanAndAdvances: { feature: 'Loan & advances', permissions: [] },
    myLoanAndAdvances: { feature: 'My Loan and Advances', permissions: createPermissions('view', 'add', 'edit') },
    employeesLoanAdvancesRequests: { feature: 'Employees Loan & Advances Requests', permissions: createPermissions('view', 'edit', 'approve') },
    projects: { feature: 'Projects', permissions: [] },
    myProjects: { feature: 'My Projects', permissions: createPermissions('view') },
    allProjects: { feature: 'All Projects', permissions: createPermissions('view', 'edit', 'changeStatus', 'addResource', 'release', 'delete') },
    payslips: { feature: 'Payslips', permissions: [] },
    myPayslips: { feature: 'My Payslips', permissions: createPermissions('view') },
    employeesPayslips: { feature: 'Employees Payslips', permissions: createPermissions('view', 'create', 'process', 'cancel', 'release') },
    declaration: { feature: 'Declaration', permissions: [] },
    myDeclaration: { feature: 'My Declaration', permissions: createPermissions('view', 'add', 'edit') },
    employeesDeclaration: { feature: 'Employees Declaration', permissions: createPermissions('view', 'edit') },
    reports: { feature: 'Reports', permissions: createPermissions('view', 'add', 'edit', 'delete', 'download') },
    myForm16: { feature: 'My Form 16', permissions: createPermissions('download') },
    employeesForm16: { feature: 'Employees Form 16', permissions: createPermissions('upload', 'download') },
    employeeSetUp: { feature: 'Employee set up', permissions: [] },
    allEmployees: { feature: 'All Employees', permissions: createPermissions('view', 'add', 'delete', 'changeStatus', 'createPayslip', 'upload') },
    employeesGeneralInfo: { feature: 'Employees General Info', permissions: createPermissions('view', 'add', 'edit') },
    employeesProfessionalInfo: { feature: 'Employees Professional Info', permissions: createPermissions('view', 'add', 'edit') },
    employeesBankDetails: { feature: 'Employees Bank Details', permissions: createPermissions('view', 'add', 'edit') },
    employeesPFESI_PT: { feature: 'Employees PF, ESI & PT', permissions: createPermissions('view', 'add', 'edit') },
    employeesPreviousJobDetails: { feature: 'Employees Previous Job Details', permissions: createPermissions('view', 'add', 'edit') },
    employeesSalaryDistribution: { feature: 'Employees Salary Distribution', permissions: createPermissions('view', 'edit') },
    employeesActivities: { feature: 'Employees Activities', permissions: createPermissions('view') },
    projectsColumn2: { feature: 'Projects', permissions: createPermissions('view', 'release') },
    myProfile: { feature: 'My profile', permissions: [] },
    myGeneralInfo: { feature: 'My General Info', permissions: createPermissions('view', 'edit') },
    myProfessionalInfo: { feature: 'My Professional Info', permissions: createPermissions('view') },
    myBankDetails: { feature: 'My Bank Details', permissions: createPermissions('view') },
    myPFESI_PT: { feature: 'My PF, ESI & PT', permissions: createPermissions('view') },
    myPreviousJobDetails: { feature: 'My Previous Job Details', permissions: createPermissions('view', 'add', 'edit') },
    payroll: { feature: 'Payroll', permissions: createPermissions('view', 'add', 'edit') },
    crystalRun: { feature: 'Crystal Run', permissions: createPermissions('view', 'add', 'edit') },
    masterConfiguration: { feature: 'Master configuration', permissions: [] },
    workingPattern: { feature: 'Working Pattern', permissions: createPermissions('view', 'add', 'edit') },
    department: { feature: 'Department', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
    designation: { feature: 'Designation', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
    roles: { feature: 'Roles', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
    locations: { feature: 'Locations', permissions: createPermissions('view', 'add', 'edit', 'changeStatus') },
    payslipComponents: { feature: 'Payslip Components', permissions: createPermissions('view', 'add', 'edit') },
    organizationSettings: { feature: 'Organization Settings', permissions: createPermissions('view') },
    sequenceNumber: { feature: 'Sequence Number', permissions: createPermissions('view', 'add') },
    payrollConfiguration: { feature: 'Payroll Configuration', permissions: createPermissions('view', 'add', 'edit') },
    webCheckInSettings: { feature: 'Web Check-in Settings', permissions: createPermissions('view', 'add', 'edit') },
};

// Data transformation functions
const transformPermissionsForAPI = (permissions: Record<string, PermissionGroup>) => {
    const apiPermissions: Record<string, Record<string, boolean>> = {};
    for (const key in permissions) {
        const group = permissions[key];
        if (group.permissions.length > 0) {
            apiPermissions[group.feature] = group.permissions.reduce((acc, perm) => {
                acc[perm.name] = perm.enabled;
                return acc;
            }, {} as Record<string, boolean>);
        }
    }
    return apiPermissions;
};

const transformApiPermissionsToState = (apiPermissions: Record<string, Record<string, boolean>>): Record<string, PermissionGroup> => {
    const statePermissions = JSON.parse(JSON.stringify(initialPermissions)); // Deep copy
    for (const featureName in apiPermissions) {
        const groupKey = Object.keys(statePermissions).find(key => statePermissions[key].feature === featureName);
        if (groupKey) {
            const permissionStates = apiPermissions[featureName];
            statePermissions[groupKey].permissions.forEach((perm: Permission) => {
                if (permissionStates[perm.name] !== undefined) {
                    perm.enabled = permissionStates[perm.name];
                }
            });
        }
    }
    return statePermissions;
};


const UpsertRolePage: React.FC = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { selectedRole } = useSelector((state: RootState) => state.roles);
    
    const isEditMode = !!roleId;

    const [formData, setFormData] = useState<RoleFormData>({ name: '', code: '', description: '', permissions: initialPermissions });
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditMode && roleId) {
            dispatch(fetchRoleById(roleId));
        } else {
            setFormData({ name: '', code: '', description: '', permissions: initialPermissions });
            setErrors({});
        }
        return () => { dispatch(clearSelectedRole()); };
    }, [dispatch, roleId, isEditMode]);

    useEffect(() => {
        if (isEditMode && selectedRole) {
            setFormData({
                name: selectedRole.name,
                code: selectedRole.code,
                description: selectedRole.description,
                permissions: transformApiPermissionsToState(selectedRole.permissions),
            });
            setErrors({});
        }
    }, [selectedRole, isEditMode]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handlePermissionChange = useCallback((groupKey: string, permissionName: string, isEnabled: boolean) => {
        setFormData(prev => {
            const newPermissions = JSON.parse(JSON.stringify(prev.permissions));
            const group = newPermissions[groupKey];
            const permIndex = group.permissions.findIndex((p: Permission) => p.name === permissionName);
            if (permIndex > -1) {
                newPermissions[groupKey].permissions[permIndex].enabled = isEnabled;
            }
            return { ...prev, permissions: newPermissions };
        });
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validationResult = roleSchema.safeParse(formData);
        if (!validationResult.success) {
            setErrors(validationResult.error.flatten().fieldErrors);
            toast.error('Please fix the errors in the form.');
            return;
        }

        setIsSubmitting(true);
        let promise;

        if (isEditMode && roleId && selectedRole) {
            const changes: Partial<RolePayload> = {};
            if (formData.name !== selectedRole.name) changes.name = formData.name;
            if (formData.code !== selectedRole.code) changes.code = formData.code;
            if (formData.description !== selectedRole.description) changes.description = formData.description;
            
            const apiPermissions = transformPermissionsForAPI(formData.permissions);

            // ✨ Using JSON.stringify for deep comparison instead of lodash
            if (JSON.stringify(apiPermissions) !== JSON.stringify(selectedRole.permissions)) {
                 changes.permissions = apiPermissions;
            }

            if (Object.keys(changes).length === 0) {
                toast.success('No changes to save.');
                setIsSubmitting(false);
                navigate('/role');
                return;
            }
            
            const payload: UpdateRolePayload = { id: roleId, ...changes };
            promise = dispatch(updateRole(payload)).unwrap();
        } else {
            const payload: RolePayload = {
                ...validationResult.data,
                status: 'Active',
                permissions: transformPermissionsForAPI(formData.permissions),
            };
            promise = dispatch(addRole(payload)).unwrap();
        }
        
        try {
            await toast.promise(promise, {
                loading: isEditMode ? 'Updating role...' : 'Adding role...',
                success: (result) => result.message || `Role ${isEditMode ? 'updated' : 'added'} successfully!`,
                error: (err) => err.message || `Failed to ${isEditMode ? 'update' : 'add'} role.`,
            });
            navigate('/role');
        } catch (error) {
            // Error toast is already handled by toast.promise
        } finally {
            setIsSubmitting(false);
        }

    }, [formData, dispatch, navigate, isEditMode, roleId, selectedRole]);

    const permissionKeysCol1 = ['myHolidays', 'holidayConfiguration', 'holidayCalendar', 'leaves', 'leaveSetup', 'myLeaves', 'teamLeaveRequests', 'employeeLeaveRequests', 'dsr', 'myDSR', 'teamDSRRequests', 'employeesDSRRequests', 'attendance', 'myAttendance', 'teamAttendanceSummary', 'employeesAttendanceSummary', 'ratings', 'ratingConfiguration', 'myMonthlyRatings', 'myPerformance', 'rateTeamMembers', 'loanAndAdvances', 'myLoanAndAdvances', 'employeesLoanAdvancesRequests', 'projects', 'myProjects', 'allProjects', 'payslips', 'myPayslips', 'employeesPayslips', 'declaration', 'myDeclaration', 'employeesDeclaration', 'reports'];
    const permissionKeysCol2 = ['myForm16', 'employeesForm16', 'employeeSetUp', 'allEmployees', 'employeesGeneralInfo', 'employeesProfessionalInfo', 'employeesBankDetails', 'employeesPFESI_PT', 'employeesPreviousJobDetails', 'employeesSalaryDistribution', 'employeesActivities', 'projectsColumn2', 'myProfile', 'myGeneralInfo', 'myProfessionalInfo', 'myBankDetails', 'myPFESI_PT', 'myPreviousJobDetails', 'payroll', 'crystalRun', 'masterConfiguration', 'workingPattern', 'department', 'designation', 'roles', 'locations', 'payslipComponents', 'organizationSettings', 'sequenceNumber', 'payrollConfiguration', 'webCheckInSettings'];

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6">
             <Toaster position="top-center" />
             <header className="mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Role' : 'Create Role'}</h1>
                    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
                        <Link to="/role" className="hover:text-gray-700">Roles</Link>
                        <ChevronRight size={16} className="mx-1" />
                        <span className="font-medium text-gray-800">{isEditMode ? 'Edit' : 'Create'}</span>
                    </nav>
                </div>
            </header>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Role Name <span className="text-red-500">*</span></label>
                        <input type="text" id="name" name="name" placeholder='eg: HR' value={formData.name} onChange={handleInputChange} disabled={isSubmitting} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"/>
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Code <span className="text-red-500">*</span></label>
                        <input type="text" id="code" name="code" placeholder='eg: 1001' value={formData.code} onChange={handleInputChange} disabled={isSubmitting} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"/>
                        {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code[0]}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                        <textarea id="description" name="description" placeholder='this is description area' value={formData.description} onChange={handleInputChange} disabled={isSubmitting} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"/>
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description[0]}</p>}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-purple-600 text-white p-3 rounded-md">
                        <h3 className="font-semibold">PERMISSIONS</h3>
                        <p className="text-xs text-purple-200">Control The Access Of App Designation By Enabling/Disabling Permissions</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-4">
                        <div>
                            {permissionKeysCol1.map(key => {
                                const group = formData.permissions[key];
                                return <PermissionRow key={key} feature={group.feature} permissions={group.permissions} onPermissionChange={(perm, enabled) => handlePermissionChange(key, perm, enabled)} />;
                            })}
                        </div>
                        <div>
                            {permissionKeysCol2.map(key => {
                                const group = formData.permissions[key];
                                return <PermissionRow key={key} feature={group.feature} permissions={group.permissions} onPermissionChange={(perm, enabled) => handlePermissionChange(key, perm, enabled)} />;
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-start gap-4 pt-6 border-t">
                    <button type="button" onClick={() => navigate('/role')} disabled={isSubmitting} className="px-10 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-10 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Saving...' : (isEditMode ? 'UPDATE' : 'SUBMIT')}</button>
                </div>
            </form>
        </div>
    );
};

const PermissionCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void; }> = ({ label, checked, onChange }) => (
    <div className="flex items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
        <label className="ml-2 text-sm text-gray-700 capitalize">{label.replace(/([A-Z])/g, ' $1')}</label>
    </div>
);

const PermissionRow: React.FC<{
    feature: string;
    permissions: Permission[];
    onPermissionChange: (permissionName: string, isEnabled: boolean) => void;
}> = ({ feature, permissions, onPermissionChange }) => {
    if (permissions.length === 0) {
        return <h3 className="text-md font-semibold text-gray-800 mt-4 pt-4 border-t">{feature}</h3>;
    }
    return (
        <div className="grid grid-cols-12 gap-x-4 items-center py-2 border-t">
            <p className="col-span-4 font-medium text-gray-600">{feature}</p>
            <div className="col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-2">
                {permissions.map((perm) => (
                    <PermissionCheckbox
                        key={perm.name}
                        label={perm.name}
                        checked={perm.enabled}
                        onChange={() => onPermissionChange(perm.name, !perm.enabled)}
                    />
                ))}
            </div>
        </div>
    );
};

export default UpsertRolePage;