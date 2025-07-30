
// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { login } from "../../../services";
// import { setError, setLoading } from "../authSlice";
// import Input from "../../../components/common/Input";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     dispatch(setLoading());
//     try {
//       await login(email, password);
//       navigate("/dashboard");
//     } catch (err) {
//       if (err instanceof Error) {
//         dispatch(setError(err.message));
//       } else {
//         dispatch(setError("An unexpected error occurred")); // fallback for non-Error cases
//       }
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded shadow-md w-96">
//       <h2 className="text-2xl mb-4 text-center">Admin Login</h2>
//       <div>
//         <div className="mb-4">
//           <label className="block text-sm mb-1">Email</label>
//           <Input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter email"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm mb-1">Password</label>
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter password"
//             required
//           />
//         </div>
//         <button
//           type="button"
//           onClick={handleLogin}
//           className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Login
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;




// =================


import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../services";
import { setError, setLoading } from "../authSlice";
import Input from "../../../components/common/Input";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const error = useSelector((state) => state.auth.error);
  const navigate = useNavigate();

  const handleLogin = async () => {
    dispatch(setError(null));
    setLocalLoading(true);
    dispatch(setLoading());
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setError(err.message));
      } else {
        dispatch(setError("An unexpected error occurred"));
      }
    }
    setLocalLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-purple-300 w-full">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Admin Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!localLoading) handleLogin();
          }}
          autoComplete="off"
        >
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-purple-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              disabled={localLoading}
              className={`w-full border ${
                localLoading
                  ? "bg-purple-100 cursor-not-allowed"
                  : "focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
              }`}
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-purple-700">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={localLoading}
              className={`w-full border ${
                localLoading
                  ? "bg-purple-100 cursor-not-allowed"
                  : "focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
              }`}
            />
          </div>
          
          {error && (
            <div className="mb-4 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={localLoading}
            className={`w-full py-2 px-4 rounded transition-colors duration-200 font-semibold text-white ${
              localLoading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            }`}
          >
            {localLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"/>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

// =================

// src/features/auth/pages/Login.tsx

// import { useState } from "react";
// import { useDispatch } from "react-redux"; // Keep useDispatch for dispatching actions
// import { login } from "../../../services";
// import { setError, setLoading } from "../authSlice"; // Keep these actions
// import Input from "../../../components/common/Input"; // This component needs to be styled well
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   // We'll add local state for loading and error to simplify,
//   // or you can continue to use Redux if you prefer.
//   // For visual consistency, managing loading/error feedback locally is quicker for this task.
//   const [localLoading, setLocalLoading] = useState(false);
//   const [localError, setLocalError] = useState<string | null>(null);


//   const handleLogin = async () => {
//     setLocalLoading(true); // Start local loading
//     setLocalError(null); // Clear previous errors
//     // You can still dispatch Redux actions if your global state needs to reflect this
//     dispatch(setLoading()); // Dispatch Redux loading action
//     dispatch(setError(null)); // Clear Redux error (optional, but good practice)

//     try {
//       await login(email, password);
//       navigate("/dashboard");
//     } catch (err) {
//       if (err instanceof Error) {
//         setLocalError(err.message); // Set local error
//         dispatch(setError(err.message)); // Also dispatch to Redux if needed globally
//       } else {
//         setLocalError("An unexpected error occurred"); // Set local fallback error
//         dispatch(setError("An unexpected error occurred")); // Also dispatch to Redux
//       }
//     } finally {
//       setLocalLoading(false); // Stop local loading
//       // No explicit Redux dispatch for stop loading, as error/success will handle it
//     }
//   };

//   return (
//     // Outer container to center the login card and add a light gray background
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 w-full">
//       {/* Login Card */}
//       <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm"> {/* Increased shadow and roundedness */}

//         {/* Logo Placeholder */}
//         <div className="flex justify-center mb-8"> {/* Increased margin */}
//           {/* Replace this with your actual PyThru logo image/SVG */}
//           <img src="/pythru log.png" alt="PyThru Logo" className="h-16" /> {/* Larger logo */}
//         </div>

//         {/* Heading */}
//         <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Login</h2> {/* Larger, bolder heading */}

//         {/* Error Message Display */}
//         {localError && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
//             <span className="block sm:inline">{localError}</span>
//           </div>
//         )}

//         {/* Email Input */}
//         <div className="mb-6"> {/* Consistent margin-bottom */}
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
//           <Input
             
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Enter your email"
//             required
//             // **Crucial for consistency: Ensure your Input component applies these styles internally**
//             // Example of what it should look like:
//             // "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//           />
//         </div>

//         {/* Password Input */}
//         <div className="mb-8"> {/* Increased margin below password for button separation */}
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//           <Input
            
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
//             required
//             // **Crucial for consistency: Ensure your Input component applies these styles internally**
//           />
//         </div>

//         {/* Login Button */}
//         <button
//           type="button"
//           onClick={handleLogin}
//           disabled={localLoading} // Disable button based on local loading state
//           className={`
//             w-full py-3 px-4 rounded-md text-white font-semibold transition duration-200 ease-in-out
//             ${localLoading
//               ? 'bg-purple-300 cursor-not-allowed' // Lighter purple when loading/disabled
//               : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50' // Primary purple for active state
//             }
//           `}
//         >
//           {localLoading ? 'Logging In...' : 'Login'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;