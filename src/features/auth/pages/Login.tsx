
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


// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../../../services";
// import { setError, setLoading } from "../authSlice";
// import Input from "../../../components/common/Input";
// import { useNavigate } from "react-router-dom";


// const Login = () => {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [localLoading, setLocalLoading] = useState(false);
//   const error = useSelector((state) => state.auth.error);
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     dispatch(setError(null));
//     setLocalLoading(true);
//     dispatch(setLoading());
//     try {
//       await login(email, password);
//       navigate("/dashboard");
//     } catch (err) {
//       if (err instanceof Error) {
//         dispatch(setError(err.message));
//       } else {
//         dispatch(setError("An unexpected error occurred"));
//       }
//     }
//     setLocalLoading(false);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-purple-300 w-full">
//       <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
//         <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Admin Login</h2>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             if (!localLoading) handleLogin();
//           }}
//           autoComplete="off"
//         >
//           <div className="mb-5">
//             <label className="block text-sm font-medium mb-2 text-purple-700">Email</label>
//             <Input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter email"
//               required
//               disabled={localLoading}
//               className={`w-full border ${
//                 localLoading
//                   ? "bg-purple-100 cursor-not-allowed"
//                   : "focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
//               }`}
//             />
//           </div>
//           <div className="mb-5">
//             <label className="block text-sm font-medium mb-2 text-purple-700">Password</label>
//             <Input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               required
//               disabled={localLoading}
//               className={`w-full border ${
//                 localLoading
//                   ? "bg-purple-100 cursor-not-allowed"
//                   : "focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
//               }`}
//             />
//           </div>
          
//           {error && (
//             <div className="mb-4 text-red-600 text-sm font-medium text-center">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={localLoading}
//             className={`w-full py-2 px-4 rounded transition-colors duration-200 font-semibold text-white ${
//               localLoading
//                 ? "bg-purple-300 cursor-not-allowed"
//                 : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
//             }`}
//           >
//             {localLoading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"/>
//                 </svg>
//                 Logging in...
//               </span>
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

// =================
// src/features/auth/pages/Login.tsx

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../authSlice"; // <-- Import our new async thunk
// import Input from "../../../components/common/Input";
// import type  { RootState } from "../../../store/store"; // <-- Import your RootState type

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Get auth state from the Redux store
//   const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const [email, setEmail] = useState("superadmin@example.com"); // Pre-filled for convenience
//   const [password, setPassword] = useState("");

//   // This effect will run when isAuthenticated changes.
//   // If login is successful, it will navigate to the dashboard.
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/dashboard");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     // We only need to dispatch the loginUser action with the credentials
//     dispatch(loginUser({ email, password }));
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-purple-300 w-full">
//       <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
//         <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Admin Login</h2>
//         <form onSubmit={handleLogin} autoComplete="off">
//           <div className="mb-5">
//             <label className="block text-sm font-medium mb-2 text-purple-700">Email</label>
//             <Input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter email"
//               required
//               disabled={isLoading} // <-- Use isLoading from Redux
//               className={`w-full border ${
//                 isLoading
//                   ? "bg-purple-100 cursor-not-allowed"
//                   : "focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
//               }`}
//             />
//           </div>
//           <div className="mb-5">
//             <label className="block text-sm font-medium mb-2 text-purple-700">Password</label>
//             <Input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter password"
//               required
//               disabled={isLoading} // <-- Use isLoading from Redux
//               className={`w-full border ${
//                 isLoading
//                   ? "bg-purple-100 cursor-not-allowed"
//                   : "focus:border-purple-500 focus:ring-2 focus:ring-purple-400"
//               }`}
//             />
//           </div>
          
//           {error && (
//             <div className="mb-4 text-red-600 text-sm font-medium text-center">
//               {error}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading} // <-- Use isLoading from Redux
//             className={`w-full py-2 px-4 rounded transition-colors duration-200 font-semibold text-white ${
//               isLoading
//                 ? "bg-purple-300 cursor-not-allowed"
//                 : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
//             }`}
//           >
//             {isLoading ? ( // <-- Use isLoading from Redux
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"/>
//                 </svg>
//                 Logging in...
//               </span>
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;



// ============================================================



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../authSlice";
import Input from "../../../components/common/Input";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get auth state from the Redux store
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-purple-300 w-full">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Admin Login</h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-purple-700">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
              disabled={isLoading}
              className={`w-full border ${
                isLoading
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
              disabled={isLoading}
              className={`w-full border ${
                isLoading
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
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded transition-colors duration-200 font-semibold text-white ${
              isLoading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z" />
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
