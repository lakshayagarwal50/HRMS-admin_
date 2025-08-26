import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../store/store"; // Adjust path
import {
  addLoginDetails,
  updateLoginDetails,
  setLoginDetails,
  type CreateLoginDetailsPayload,
  type LoginDetails as LoginDetailsType,
} from "../../../../store/slice/loginDetailsSlice"; // Adjust path
import AddLoginDetailsModal from "./AddLoginDetailsModal"; // Adjust path
import EditLoginDetailsModal from "./EditLoginDetailsModal"; // Adjust path

import { SectionHeader, EditButton } from "../common/DetailItem"; // Adjust path as needed

interface LoginDetailsProps {
  employee: any;
  // --- CHANGE 1: Removed the incorrect employeeId prop ---
}

const ResponsiveDetailItem: React.FC<{
  label: string;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="py-3 border-b border-gray-200 last:border-b-0 md:flex md:justify-between md:items-center">
    <p className="text-sm text-gray-600 mb-1 md:mb-0">{label}</p>
    <p className="text-sm font-medium text-gray-800 md:text-right">{value}</p>
  </div>
);

const LoginDetails: React.FC<LoginDetailsProps> = ({ employee }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { details, loading, error } = useSelector(
    (state: RootState) => state.loginDetails || {}
  );

  // --- CHANGE 2: Get the correct generalId from the employee object ---
  const generalId = employee?.general?.id;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    dispatch(setLoginDetails(employee?.general?.loginDetails || null));
  }, [employee, dispatch]);

  const empCode = employee?.general?.empCode;
  const handleAddSubmit = (data: CreateLoginDetailsPayload) => {
    // --- CHANGE 3: Use the correct generalId for the API call ---
    if (!generalId) {
      console.error("Cannot add login details: generalId is missing.");
      return;
    }
    dispatch(addLoginDetails({ employeeId: generalId, empCode, payload: data }))
      .unwrap()
      .then(() => setIsAddModalOpen(false))
      .catch((err) => console.error("Failed to add login details:", err));
  };

  const handleEditSubmit = (data: Partial<LoginDetailsType>) => {
    // --- CHANGE 4: Use the correct generalId for the API call ---
    if (!generalId) {
      console.error("Cannot update login details: generalId is missing.");
      return;
    }
    dispatch(
      updateLoginDetails({ employeeId: generalId, empCode, payload: data })
    )
      .unwrap()
      .then(() => setIsEditModalOpen(false))
      .catch((err) => console.error("Failed to update login details:", err));
  };

  const actionButton = details ? (
    <EditButton onClick={() => setIsEditModalOpen(true)} />
  ) : (
    <button
      onClick={() => setIsAddModalOpen(true)}
      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
    >
      + Add Login Details
    </button>
  );

  return (
    <div className="mt-6">
      <SectionHeader title="Login Details" action={actionButton} />

      {error && <p className="text-sm text-red-600 my-2">Error: {error}</p>}

      <div className="space-y-2">
        {details ? (
          <>
            <ResponsiveDetailItem label="Username" value={details.username} />
            <ResponsiveDetailItem
              label="Login Enabled"
              value={
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    details.loginEnable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {details.loginEnable ? "Enabled" : "Disabled"}
                </span>
              }
            />
            <ResponsiveDetailItem
              label="Account Locked"
              value={
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    details.accLocked
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {details.accLocked ? "Locked" : "Unlocked"}
                </span>
              }
            />
          </>
        ) : (
          <div className="text-center py-6 text-sm text-gray-500">
            No login details have been added for this employee.
          </div>
        )}
      </div>

      <AddLoginDetailsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        loading={loading === "pending"}
      />

      <EditLoginDetailsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        loading={loading === "pending"}
        initialData={details}
      />
    </div>
  );
};

export default LoginDetails;
