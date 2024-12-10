import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CUSTOMER_BACKEND_URL } from "../constants";
import "../css/ForgotPassword.css";

const ForgotPassword = ({ onClose }) => {
  const [otpData, setOtpData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });
  
  // State to track whether OTP has been sent and for loading status
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleForgotPassword = async () => {
    setLoading(true); // Set loading to true when the button is clicked
    try {
      const url = `${CUSTOMER_BACKEND_URL}/user/send-otp`;
      const response = await axios.post(url, { email: otpData.email });

      if (response.status === 200) {
        toast.success("OTP sent to your email!");
        setOtpSent(true); // Update the state to indicate OTP has been sent
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false); // Reset loading state after the request completes
    }
  };

  const handleVerifyOtpAndUpdatePassword = async () => {
    try {
      const url = `${CUSTOMER_BACKEND_URL}/user/verify-otp-and-update-password`;
      const response = await axios.post(url, {
        email: otpData.email,
        otp: otpData.otp,
        newPassword: otpData.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setTimeout(() => {
          onClose(); // Close the modal
        }, 2000); 
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      const message = error.response.data.message || "An error occurred.";
      toast.error(message);
    } else {
      const unexpectedMessage = "An unexpected error occurred: " + error.message;
      toast.error(unexpectedMessage);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h4 className="modal-title">Reset Password</h4>

        {/* Show email input and button only */}
        {!otpSent ? (
          <>
            <input
              type="email"
              className="modal-input"
              placeholder="Enter your email"
              value={otpData.email}
              onChange={(e) => setOtpData({ ...otpData, email: e.target.value })}
              required
            />
            <button className="modal-button" onClick={handleForgotPassword} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"} {/* Show loader text */}
            </button>
          </>
        ) : (
          // Show OTP and new password fields after OTP is sent
          <>
            <input
              type="text"
              className="modal-input"
              placeholder="Enter OTP"
              value={otpData.otp}
              onChange={(e) => setOtpData({ ...otpData, otp: e.target.value })}
              required
            />
            <input
              type="password"
              className="modal-input"
              placeholder="New Password"
              value={otpData.newPassword}
              onChange={(e) => setOtpData({ ...otpData, newPassword: e.target.value })}
              required
            />
            <button className="modal-button" onClick={handleVerifyOtpAndUpdatePassword}>
              Verify OTP and Update Password
            </button>
          </>
        )}
        
        <button className="modal-button" onClick={onClose}>Cancel</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
