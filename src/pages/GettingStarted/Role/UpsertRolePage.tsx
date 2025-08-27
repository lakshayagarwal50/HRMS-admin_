import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { addRole, updateRole, fetchRoleById, clearSelectedRole, type RolePayload, type Role } from '../../../store/slice/roleSlice';

// --- TYPE DEFINITIONS ---
type Permission = { name: string; enabled: boolean; };
type PermissionGroup = { feature: string; permissions: Permission[]; };
interface RoleFormData {
    name: string;
    code: string;
    description: string;
    permissions: Record<string, PermissionGroup>;
}

// --- INITIAL DATA & HELPERS ---
const createPermissions = (...names: string[]): Permission[] => names.map(name => ({ name, enabled: false }));

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


// --- MAIN UPSERT ROLE PAGE COMPONENT ---
const UpsertRolePage: React.FC = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { selectedRole, selectedStatus } = useSelector((state: RootState) => state.roles);
    
    const isEditMode = !!roleId;

    const [formData, setFormData] = useState<RoleFormData>({
        name: '',
        code: '',
        description: '',
        permissions: initialPermissions,
    });

    // Effect to handle fetching data for edit mode or resetting for create mode
    useEffect(() => {
        if (isEditMode && roleId) {
            dispatch(fetchRoleById(roleId));
        } else {
            // When in create mode, ensure the form is reset to its initial blank state
            setFormData({
                name: '',
                code: '',
                description: '',
                permissions: initialPermissions,
            });
        }
        // Cleanup function to clear the selected role from Redux state when leaving the page
        return () => {
            dispatch(clearSelectedRole());
        }
    }, [dispatch, roleId, isEditMode]);

    // Effect to populate the form ONLY when the selectedRole data from Redux changes
    useEffect(() => {
        if (isEditMode && selectedRole) {
            setFormData({
                name: selectedRole.name,
                code: selectedRole.code,
                description: selectedRole.description,
                permissions: transformApiPermissionsToState(selectedRole.permissions),
            });
        }
    }, [selectedRole, isEditMode]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handlePermissionChange = useCallback((groupKey: string, permissionName: string, isEnabled: boolean) => {
        setFormData(prev => {
            const newPermissions = { ...prev.permissions };
            const group = newPermissions[groupKey];
            const permIndex = group.permissions.findIndex(p => p.name === permissionName);
            if (permIndex > -1) {
                newPermissions[groupKey].permissions[permIndex].enabled = isEnabled;
            }
            return { ...prev, permissions: newPermissions };
        });
    }, []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: RolePayload = {
            name: formData.name,
            code: formData.code,
            description: formData.description,
            status: selectedRole?.status || 'Active', // Preserve existing status or default to Active
            permissions: transformPermissionsForAPI(formData.permissions),
        };

        if (isEditMode && roleId) {
            dispatch(updateRole({ id: roleId, ...payload }));
        } else {
            dispatch(addRole(payload));
        }
        navigate('/roles');
    }, [formData, dispatch, navigate, isEditMode, roleId, selectedRole]);

    if (isEditMode && selectedStatus === 'loading') {
        return <div className="p-6 text-center">Loading Role Details...</div>;
    }

    const permissionKeysCol1 = ['myHolidays', 'holidayConfiguration', 'holidayCalendar', 'leaves', 'leaveSetup', 'myLeaves', 'teamLeaveRequests', 'employeeLeaveRequests', 'dsr', 'myDSR', 'teamDSRRequests', 'employeesDSRRequests', 'attendance', 'myAttendance', 'teamAttendanceSummary', 'employeesAttendanceSummary', 'ratings', 'ratingConfiguration', 'myMonthlyRatings', 'myPerformance', 'rateTeamMembers', 'loanAndAdvances', 'myLoanAndAdvances', 'employeesLoanAdvancesRequests', 'projects', 'myProjects', 'allProjects', 'payslips', 'myPayslips', 'employeesPayslips', 'declaration', 'myDeclaration', 'employeesDeclaration', 'reports'];
    const permissionKeysCol2 = ['myForm16', 'employeesForm16', 'employeeSetUp', 'allEmployees', 'employeesGeneralInfo', 'employeesProfessionalInfo', 'employeesBankDetails', 'employeesPFESI_PT', 'employeesPreviousJobDetails', 'employeesSalaryDistribution', 'employeesActivities', 'projectsColumn2', 'myProfile', 'myGeneralInfo', 'myProfessionalInfo', 'myBankDetails', 'myPFESI_PT', 'myPreviousJobDetails', 'payroll', 'crystalRun', 'masterConfiguration', 'workingPattern', 'department', 'designation', 'roles', 'locations', 'payslipComponents', 'organizationSettings', 'sequenceNumber', 'payrollConfiguration', 'webCheckInSettings'];

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6">
             <header className="mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Role' : 'Create Role'}</h1>
                    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
                        <Link to="/roles" className="hover:text-gray-700">Roles</Link>
                        <ChevronRight size={16} className="mx-1" />
                        <span className="font-medium text-gray-800">{isEditMode ? 'Edit' : 'Create'}</span>
                    </nav>
                </div>
            </header>
            
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                        <input type="text" id="code" name="code" value={formData.code} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
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
                    <button type="button" onClick={() => navigate('/roles')} className="px-10 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="px-10 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">{isEditMode ? 'UPDATE' : 'SUBMIT'}</button>
                </div>
            </form>
        </div>
    );
};

// --- Reusable Components (can be moved to their own files) ---
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
