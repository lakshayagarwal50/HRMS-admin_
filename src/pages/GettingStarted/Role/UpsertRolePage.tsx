import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import { addRole, updateRole, fetchRoleById, clearSelectedRole, type RolePayload, } from '../../../store/slice/roleSlice';

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
    // ... (include all other permissions as before)
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

    useEffect(() => {
        if (isEditMode) {
            dispatch(fetchRoleById(roleId));
        }
        // Clear the selected role when the component unmounts
        return () => {
            dispatch(clearSelectedRole());
        }
    }, [dispatch, roleId, isEditMode]);

    // Effect to populate the form when the selectedRole data arrives
    useEffect(() => {
        if (isEditMode && selectedRole) {
            setFormData({
                name: selectedRole.name,
                code: selectedRole.code,
                description: selectedRole.description,
                permissions: transformApiPermissionsToState(selectedRole.permissions),
            });
        }
    }, [isEditMode, selectedRole]);

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
            status: 'Active', // Status is managed by a separate action
            permissions: transformPermissionsForAPI(formData.permissions),
        };

        if (isEditMode && roleId) {
            dispatch(updateRole({ id: roleId, ...payload }));
        } else {
            dispatch(addRole(payload));
        }
        navigate('/roles');
    }, [formData, dispatch, navigate, isEditMode, roleId]);

    if (isEditMode && selectedStatus === 'loading') {
        return <div className="p-6">Loading Role Details...</div>;
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
