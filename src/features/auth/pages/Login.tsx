// src/features/auth/pages/Login.tsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../../services";
import { setError, setLoading } from "../authSlice";
import Input from "../../../components/common/Input";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleLogin = async () => {
  //   dispatch(setLoading());
  //   try {
  //     await login(email, password);
  //     navigate("/dashboard")
  //   } catch (err: any) {
  //     dispatch(setError(err.message));
  //   }
  // };

  const handleLogin = async () => {
    dispatch(setLoading());
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setError(err.message));
      } else {
        dispatch(setError("An unexpected error occurred")); // fallback for non-Error cases
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md w-96">
      <h2 className="text-2xl mb-4 text-center">Admin Login</h2>
      <div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
