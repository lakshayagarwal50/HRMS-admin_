import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// --- TYPE DEFINITIONS ---

// Defines the structure for a single permission setting (e.g., View, Add)
type Permission = {
    name: string;
    enabled: boolean;
};

// Defines a group of permissions for a specific feature (e.g., Holiday Calendar)
type PermissionGroup = {
    feature: string;
    permissions: Permission[];
};

// Defines the structure for the entire form state
interface RoleFormData {
    roleName: string;
    code: string;
    description: string;
    permissions: Record<string, PermissionGroup>; // Using a record for easy access by key
}

// --- INITIAL DATA ---

// Helper function to create a standard set of permissions
const createPermissions = (...names: string[]): Permission[] => 
    names.map(name => ({ name, enabled: false }));

// Initial state for all permissions, organized by category
const initialPermissions: Record<string, PermissionGroup> = {
    // Column 1
    holidays: { feature: 'Holidays', permissions: createPermissions('View') },
    holidayConfiguration: { feature: 'Holiday configuration', permissions: createPermissions('View', 'Add', 'Edit', 'Delete') },
    holidayCalendar: { feature: 'Holiday calendar', permissions: createPermissions('View', 'Add', 'Edit', 'Delete') },
    leaves: { feature: 'Leaves', permissions: [] },
    leaveSetup: { feature: 'Leave setup', permissions: createPermissions('View', 'Add', 'Edit', 'Change Status') },
    myLeaveRequest: { feature: 'My leave request', permissions: createPermissions('View', 'Add', 'Cancel') },
    teamLeaveRequest: { feature: 'Team leave requests', permissions: createPermissions('View', 'Approve/Decline') },
    employeeLeaveRequests: { feature: 'Employee leave requests', permissions: createPermissions('View', 'Add', 'Approve/Decline') },
    dsr: { feature: 'DSR', permissions: [] },
    myDSR: { feature: 'My DSR', permissions: createPermissions('View', 'Add', 'Edit') },
    teamDSR: { feature: 'Team DSR requests', permissions: createPermissions('View', 'Approve/Decline') },
    employeeDSR: { feature: 'Employee DSR requests', permissions: createPermissions('View', 'Approve/Decline') },
    attendance: { feature: 'Attendance', permissions: [] },
    myAttendance: { feature: 'My attendance', permissions: createPermissions('View', 'Add') },
    teamAttendance: { feature: 'Team attendance summary', permissions: createPermissions('View') },
    employeeAttendance: { feature: 'Employee attendance summary', permissions: createPermissions('View', 'Add', 'Edit', 'Upload') },
    ratings: { feature: 'Ratings', permissions: [] },
    ratingConfig: { feature: 'Rating configuration', permissions: createPermissions('View', 'Add', 'Edit') },
    myRatings: { feature: 'My monthly ratings', permissions: createPermissions('View', 'Add', 'Edit') },
    myPerformance: { feature: 'My performance', permissions: createPermissions('View') },
    rateTeam: { feature: 'Rate team members', permissions: createPermissions('View', 'Add', 'Edit') },
    loan: { feature: 'Loan & advances', permissions: [] },
    myLoan: { feature: 'My loan and advances', permissions: createPermissions('View', 'Add', 'Edit') },
    teamLoan: { feature: 'Team loan & advances requests', permissions: createPermissions('View', 'Approve/Decline') },
    projects: { feature: 'Projects', permissions: [] },
    myProjects: { feature: 'My projects', permissions: createPermissions('View') },
    allProjects: { feature: 'All projects', permissions: createPermissions('View', 'Edit', 'Change Status', 'Add resource', 'Release', 'Delete') },
    paySlips: { feature: 'Payslips', permissions: [] },
    myPayslips: { feature: 'My payslips', permissions: createPermissions('View') },
    generatePayslips: { feature: 'Generate payslips', permissions: createPermissions('View', 'Create', 'Process', 'Cancel', 'Release payslips') },
    declaration: { feature: 'Declaration', permissions: [] },
    myDeclaration: { feature: 'My declaration', permissions: createPermissions('View', 'Add', 'Edit') },
    employeeDeclaration: { feature: 'Employee declaration', permissions: createPermissions('View', 'Edit') },
    reports: { feature: 'Reports', permissions: createPermissions('View', 'Add', 'Edit', 'Delete', 'Download') },
    // Column 2
    form16: { feature: 'Form 16', permissions: createPermissions('Download') },
    employeeForm16: { feature: 'Employee Form 16', permissions: createPermissions('Upload', 'Download') },
    employeeSetup: { feature: 'Employee set up', permissions: [] },
    allEmployees: { feature: 'All employees', permissions: createPermissions('View', 'Add', 'Delete', 'Change Status', 'Create Payslip', 'Upload') },
    employeesGeneral: { feature: 'Employees General info', permissions: createPermissions('View', 'Add', 'Edit') },
    employeesBank: { feature: 'Employees Bank details', permissions: createPermissions('View', 'Add', 'Edit') },
    employeesPFEsi: { feature: 'Employees PF, ESI & PT', permissions: createPermissions('View', 'Add', 'Edit') },
    employeesPreviousJob: { feature: 'Employees Previous job details', permissions: createPermissions('View', 'Add', 'Edit') },
    employeesSalary: { feature: 'Employees Salary distribution', permissions: createPermissions('View', 'Edit') },
    employeesActivities: { feature: 'Employees activities', permissions: createPermissions('View') },
    payslipRelease: { feature: 'Payslip', permissions: createPermissions('View', 'Release') },
    myProfile: { feature: 'My profile', permissions: [] },
    myGeneralInfo: { feature: 'My General info', permissions: createPermissions('View', 'Edit') },
    myProfessionalInfo: { feature: 'My Professional info', permissions: createPermissions('View') },
    myBankDetails: { feature: 'My Bank details', permissions: createPermissions('View') },
    myPFEsi: { feature: 'My PF, ESI & PT', permissions: createPermissions('View') },
    myPreviousJob: { feature: 'My Previous job details', permissions: createPermissions('View') },
    payrollConfig: { feature: 'Payroll configuration', permissions: [] },
    payroll: { feature: 'Payroll', permissions: createPermissions('View', 'Add', 'Edit') },
    crystalRun: { feature: 'Crystal run', permissions: createPermissions('View', 'Add', 'Edit') },
    masterConfig: { feature: 'Master configuration', permissions: [] },
    workingPattern: { feature: 'Working pattern', permissions: createPermissions('View', 'Add', 'Edit') },
    department: { feature: 'Department', permissions: createPermissions('View', 'Add', 'Edit', 'Change Status') },
    designation: { feature: 'Designation', permissions: createPermissions('View', 'Add', 'Edit', 'Change Status') },
    roles: { feature: 'Roles', permissions: createPermissions('View', 'Add', 'Edit', 'Change Status') },
    location: { feature: 'Location', permissions: createPermissions('View', 'Add', 'Edit', 'Change Status') },
    entities: { feature: 'Entities', permissions: createPermissions('View', 'Add', 'Edit') },
    orgSettings: { feature: 'Organization settings', permissions: createPermissions('View') },
    sequenceNumber: { feature: 'Sequence number', permissions: createPermissions('View', 'Add') },
    payrollConfigMaster: { feature: 'Payroll configuration', permissions: createPermissions('View') },
    workWeek: { feature: 'Work week in settings', permissions: createPermissions('View', 'Add', 'Edit') },
    myTeam: { feature: 'My Team', permissions: createPermissions('View') },
};

// --- REUSABLE COMPONENTS ---

// A component for a single permission checkbox
const PermissionCheckbox: React.FC<{ label: string; checked: boolean; onChange: () => void; }> = ({ label, checked, onChange }) => (
    <div className="flex items-center">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
        <label className="ml-2 text-sm text-gray-700">{label}</label>
    </div>
);

// A component for a group of permissions under a feature
const PermissionRow: React.FC<{
    feature: string;
    permissions: Permission[];
    onPermissionChange: (permissionName: string, isEnabled: boolean) => void;
    isHeader?: boolean;
}> = ({ feature, permissions, onPermissionChange, isHeader = false }) => (
    <div className={`grid grid-cols-12 gap-x-4 items-center py-2 ${!isHeader ? 'border-t' : ''}`}>
        <p className={`col-span-4 font-medium ${isHeader ? 'text-gray-800' : 'text-gray-600'}`}>{feature}</p>
        <div className="col-span-8 grid grid-cols-5 gap-x-4">
            {permissions.map((perm, index) => (
                <PermissionCheckbox
                    key={index}
                    label={perm.name}
                    checked={perm.enabled}
                    onChange={() => onPermissionChange(perm.name, !perm.enabled)}
                />
            ))}
        </div>
    </div>
);


// --- MAIN CREATE ROLE PAGE COMPONENT ---
const CreateRolePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RoleFormData>({
        roleName: '',
        code: '',
        description: '',
        permissions: initialPermissions,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (groupKey: string, permissionName: string, isEnabled: boolean) => {
        setFormData(prev => {
            const newPermissions = { ...prev.permissions };
            const group = newPermissions[groupKey];
            const permIndex = group.permissions.findIndex(p => p.name === permissionName);
            if (permIndex > -1) {
                group.permissions[permIndex] = { ...group.permissions[permIndex], enabled: isEnabled };
            }
            return { ...prev, permissions: newPermissions };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitting Role:", formData);
        // Add your API submission logic here
        navigate('/roles');
    };

    const permissionKeysCol1 = ['holidays', 'holidayConfiguration', 'holidayCalendar', 'leaves', 'leaveSetup', 'myLeaveRequest', 'teamLeaveRequest', 'employeeLeaveRequests', 'dsr', 'myDSR', 'teamDSR', 'employeeDSR', 'attendance', 'myAttendance', 'teamAttendance', 'employeeAttendance', 'ratings', 'ratingConfig', 'myRatings', 'myPerformance', 'rateTeam', 'loan', 'myLoan', 'teamLoan', 'projects', 'myProjects', 'allProjects', 'paySlips', 'myPayslips', 'generatePayslips', 'declaration', 'myDeclaration', 'employeeDeclaration', 'reports'];
    const permissionKeysCol2 = ['form16', 'employeeForm16', 'employeeSetup', 'allEmployees', 'employeesGeneral', 'employeesBank', 'employeesPFEsi', 'employeesPreviousJob', 'employeesSalary', 'employeesActivities', 'payslipRelease', 'myProfile', 'myGeneralInfo', 'myProfessionalInfo', 'myBankDetails', 'myPFEsi', 'myPreviousJob', 'payrollConfig', 'payroll', 'crystalRun', 'masterConfig', 'workingPattern', 'department', 'designation', 'roles', 'location', 'entities', 'orgSettings', 'sequenceNumber', 'payrollConfigMaster', 'workWeek', 'myTeam'];

    return (
        <div className="w-full bg-gray-50 p-4 sm:p-6">
            <header className="mb-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Create Role</h1>
                    <nav aria-label="Breadcrumb" className="flex items-center text-sm text-gray-500">
                        <Link to="/dashboard" className="hover:text-gray-700">Dashboard</Link>
                        <ChevronRight size={16} className="mx-1" />
                        <Link to="/getting-started" className="hover:text-gray-700">Getting Started</Link>
                        <ChevronRight size={16} className="mx-1" />
                        <Link to="/roles" className="hover:text-gray-700">Roles</Link>
                        <ChevronRight size={16} className="mx-1" />
                        <span className="font-medium text-gray-800">Create Role</span>
                    </nav>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                        <input type="text" id="roleName" name="roleName" value={formData.roleName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
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
                        {/* Column 1 */}
                        <div>
                            {permissionKeysCol1.map(key => {
                                const group = formData.permissions[key];
                                return <PermissionRow key={key} feature={group.feature} permissions={group.permissions} onPermissionChange={(perm, enabled) => handlePermissionChange(key, perm, enabled)} isHeader={group.permissions.length === 0} />;
                            })}
                        </div>
                        {/* Column 2 */}
                        <div>
                            {permissionKeysCol2.map(key => {
                                const group = formData.permissions[key];
                                return <PermissionRow key={key} feature={group.feature} permissions={group.permissions} onPermissionChange={(perm, enabled) => handlePermissionChange(key, perm, enabled)} isHeader={group.permissions.length === 0} />;
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-start gap-4 pt-6 border-t">
                    <button type="button" onClick={() => navigate('/roles')} className="px-10 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="px-10 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">SUBMIT</button>
                </div>
            </form>
        </div>
    );
};

export default CreateRolePage;
