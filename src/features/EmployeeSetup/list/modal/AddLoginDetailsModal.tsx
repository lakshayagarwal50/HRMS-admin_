import React, { useState } from "react";
import toast from "react-hot-toast";
import type { CreateLoginDetailsPayload } from "../../../../store/slice/loginDetailsSlice";

interface AddLoginDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLoginDetailsPayload) => void;
  loading: boolean;
}

const AddLoginDetailsModal: React.FC<AddLoginDetailsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginEnable, setLoginEnable] = useState(true);
  const [accLocked, setAccLocked] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // First, check if the username is empty
    if (!username.trim()) {
      newErrors.username = "Username is required.";
      // Then, check if it's a valid email format
    } else if (!emailRegex.test(username)) {
      newErrors.username = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ username, password, loginEnable, accLocked });
    } else {
      toast.error("Please fill out all required fields.", {
        className: "bg-orange-50 text-orange-800",
      });
    }
  };

  if (!isOpen) return null;

  const commonInputClasses = (hasError: boolean) =>
    `block w-full border-0 border-b-2 bg-transparent py-2 px-1 text-lg placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors duration-300 ${
      hasError
        ? "border-red-500 focus:border-red-600"
        : "border-gray-200 focus:border-purple-600"
    }`;

  return (
    <div className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300">
      <div className="fixed top-0 right-0 h-full w-full max-w-2xl transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <header className="relative flex justify-center items-center p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              Add Login Details
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={commonInputClasses(!!errors.username)}
              />
              {errors.username && (
                <p className="text-xs text-red-500 mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={commonInputClasses(!!errors.password)}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

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
              {loading ? "Submitting..." : "Submit"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddLoginDetailsModal;
