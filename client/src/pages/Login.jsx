import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginEmail)) {
        setError("Invalid email format");
      } else {
        setError("");
      }
      return;
    }
    try {
      const url = `${apiUrl}/api/v1/login`;
      const request = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (request.status == 405) {
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        window.open("/", "_self");
        return;
      }
      const response = await request.json();
      if (response.success) {
        setError("");
        localStorage.setItem("token", response.token);
        localStorage.setItem("fullname", response.user.fullname);
        localStorage.setItem("role", response.user.role);
        navigate("/" + response.user.role);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(response.message || "An unknown error occurred");
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md ">
        <div className="text-3xl text-center text-darkBlue font-semibold mb-6 ">
          LOGIN
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
          {error && <div className="text-red-600 text-center">{error}</div>}
          <Button
            onClick={login}
            className="w-full py-2 px-4 bg-darkBlue text-white rounded-md hover:bg-white hover:text-darkBlue hover:border-darkBlue hover:border-1 focus:outline-none focus:ring focus:border-blue-300"
            loading={loading}
            label="Login"
            raised
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
