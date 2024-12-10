import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import for redirection
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS
import "../css/Registration.css";
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 

const Registration = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate(); // Initialize navigate for redirection
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${CUSTOMER_BACKEND_URL}/user/register`;
      console.log("Backend URL:", url);
      // return;
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(url, formData, config);

      if (response.status === 200 && response.data.status) {
        setMessage(response.data.message);
        setIsError(false);

        const token = response.data.data.token;
        console.log("Registration token:", token);

        localStorage.setItem("token", token);

        toast.success("Registration successful!");

        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessage(error.response.data.message);
          toast.error(error.response.data.message); // Show error toast
        } else {
          const errorMessage = "An error occurred: " + error.response.statusText;
          setMessage(errorMessage);
          toast.error(errorMessage); // Show error toast
        }
        setIsError(true);
      } else if (error.request) {
        const networkMessage = "No response received. Please check your network connection.";
        setMessage(networkMessage);
        toast.error(networkMessage); // Show network error toast
        setIsError(true);
      } else {
        const unexpectedMessage = "An unexpected error occurred: " + error.message;
        setMessage(unexpectedMessage);
        toast.error(unexpectedMessage); // Show unexpected error toast
        setIsError(true);
      }
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h3 className="text-center mb-4">WayToDine</h3>
        <form onSubmit={handleSubmit}>
          {message && (
            <div className={`alert ${isError ? "alert-danger" : "alert-success"}`} role="alert">
              {message}
            </div>
          )}
          <div className="form-group mb-3">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-control"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3">
            Register
          </button>
          <div className="text-center mt-3">
            Already have an account?
            <a href="/login" className="signup-link"> Sign in</a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Registration;
