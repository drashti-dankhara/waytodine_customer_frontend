import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import "../css/Registration.css"; 
import { CUSTOMER_BACKEND_URL } from "../constants"; 
import ForgotPassword from "../components/ForgotPassword.js"; // Import the new component

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const url = `${CUSTOMER_BACKEND_URL}/user/login`;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(url, loginData, config);

      if (response.status === 200 && response.data.status) {
        const token = response.data.data.token;
        console.log("token === " , token);
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const message = error.response.data.message || "An error occurred.";
      setMessage(message);
      toast.error(message);
      setIsError(true);
    } else {
      const unexpectedMessage = "An unexpected error occurred: " + error.message;
      toast.error(unexpectedMessage);
      setIsError(true);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h3 className="text-center mb-4">WayToDine</h3>
        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-end mb-2">
            <a href="#" onClick={() => setShowForgotPassword(true)} className="forgot-password-link">Forgot Password?</a>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-2">
            Login
          </button>
          <div className="text-center mt-3">
            Don't have an account? 
            <a href="/register" className="signup-link"> Sign up</a>
          </div>
        </form>
      </div>

      {/* Conditionally render the Forgot Password component */}
      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}

      <ToastContainer />
    </div>
  );
};

export default Login;
