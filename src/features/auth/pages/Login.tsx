// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginUser } from "../authSlice";
// import Input from "../../../components/common/Input";
// import { useAppDispatch, useAppSelector } from "../../../store/hooks";

// const Login = () => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState(""); 

  
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/dashboard");
//     }
//   }, [isAuthenticated, navigate]);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
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
//               disabled={isLoading}
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
//               disabled={isLoading}
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
//             disabled={isLoading}
//             className={`w-full py-2 px-4 rounded transition-colors duration-200 font-semibold text-white ${
//               isLoading
//                 ? "bg-purple-300 cursor-not-allowed"
//                 : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
//             }`}
//           >
//             {isLoading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin mr-2 h-5 w-5 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z" />
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



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../authSlice";
import Input from "../../../components/common/Input";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [email, setEmail] = useState("");
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

  const handleGuestLogin = () => {
    dispatch(loginUser({ email: "guest@example.com", password: "guest@1234" }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-purple-300 w-full">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} autoComplete="off">
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2 text-purple-700">
              Email
            </label>
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
            <label className="block text-sm font-medium mb-2 text-purple-700">
              Password
            </label>
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
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Guest Login Button */}
        <button
          onClick={handleGuestLogin}
          disabled={isLoading}
          className={`mt-4 w-full py-2 px-4 rounded transition-colors duration-200 font-semibold text-purple-700 border border-purple-500 ${
            isLoading
              ? "bg-purple-100 cursor-not-allowed"
              : "hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          }`}
        >
          {isLoading ? "Please wait..." : "Login as Guest"}
        </button>
      </div>
    </div>
  );
};

export default Login;
