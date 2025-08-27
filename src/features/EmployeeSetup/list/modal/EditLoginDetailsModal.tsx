import React, { useState, useEffect } from "react";
import type { LoginDetails } from "../../../../store/slice/loginDetailsSlice"; // Adjust path

interface EditLoginDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<LoginDetails>) => void; // Allow partial updates
  loading: boolean;
  initialData: LoginDetails | null;
}

const EditLoginDetailsModal: React.FC<EditLoginDetailsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  initialData,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginEnable, setLoginEnable] = useState(true);
  const [accLocked, setAccLocked] = useState(false);
  // --- CHANGE 1: Added error state for validation ---
  const [errors, setErrors] = useState<{ password?: string }>({});

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username);
      setPassword(""); // Password is reset on open
      setLoginEnable(initialData.loginEnable ?? true);
      setAccLocked(initialData.accLocked ?? false);
      setErrors({}); // Clear previous errors
    }
  }, [initialData]);

  // --- CHANGE 2: Added validation function ---
  const validate = () => {
    const newErrors: { password?: string } = {};
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const payload: Partial<LoginDetails> = {
        username,
        password, // Password is now always included
        loginEnable,
        accLocked,
      };
      onSubmit(payload);
    }
  };

  if (!isOpen) return null;

  // --- CHANGE 3: Updated placeholder text size ---
  const commonInputClasses = (hasError: boolean) =>
    `block w-full border-0 border-b-2 bg-transparent py-2 px-1 text-lg placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors duration-300 ${
      hasError
        ? "border-red-500 focus:border-red-600"
        : "border-gray-200 focus:border-purple-600"
    }`;

  const readOnlyInputClasses =
    "mt-1 block w-full border-0 border-b border-gray-300 bg-slate-50 py-2 px-1 sm:text-sm text-gray-500 cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300">
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <header className="relative flex justify-center items-center p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Edit Login Details
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 rounded-md p-1 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>

          <div className="flex-grow space-y-8 overflow-y-auto p-8">
            {/* Username (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                readOnly
                className={readOnlyInputClasses}
              />
            </div>
            {/* New Password */}
            <div>
              {/* --- CHANGE 4: Updated label and added error display --- */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                className={commonInputClasses(!!errors.password)}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            {/* Toggles */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm font-medium text-gray-700">
                Login Enabled
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={loginEnable}
                  onChange={() => setLoginEnable(!loginEnable)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Account Locked
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accLocked}
                  onChange={() => setAccLocked(!accLocked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          <footer className="flex flex-shrink-0 items-center justify-center gap-4 border-t border-slate-200 p-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-8 font-semibold bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-8 font-semibold text-white bg-[#741CDD] rounded-md hover:bg-[#5f3dbb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#741CDD] transition-colors shadow-sm disabled:bg-purple-300"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default EditLoginDetailsModal;
