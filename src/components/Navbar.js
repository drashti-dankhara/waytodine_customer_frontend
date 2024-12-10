import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { FaHome, FaInfoCircle, FaPhone, FaShoppingCart, FaSearchLocation, FaUser } from 'react-icons/fa';
import "../css/Navbar.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 

const CustomNavbar = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && token !== "") {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const isExpired = tokenData.exp * 1000 < Date.now();

      if (!isExpired) {
        const fetchUserProfile = async () => {
          try {
            const response = await axios.get(`${CUSTOMER_BACKEND_URL}/user/get-profile`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setUserName(`${response.data.data.firstName} ${response.data.data.lastName}`);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Optionally handle errors (e.g., clear token if profile fetch fails)
            localStorage.removeItem('token');
          }
        };

        fetchUserProfile();
      } else {
        // Token is expired, clear token from local storage
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginClick = () => {
    navigate('/login');  // Navigates to the /login page
  };

  const handleUserNameClick = () => {
    navigate('/profile'); // Navigates to the profile page
  };

  const handleYourOrders = () => {
    navigate('/your-orders'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token on logout
    setUserName(""); // Clear userName
    navigate('/'); // Redirect to home or login page
  };

  return (
    <Navbar bg="light" expand="lg" className="custom-navbar" style={{ padding: '10px 20px' }}>
      <div className="navbar-left d-flex align-items-center">
        <Navbar.Brand href="/" className="d-flex align-items-center" style={{ marginRight: '20px' }}>
          <img src="/assets/images/logo1.png" alt="WayToDine" style={{ width: '40px', marginRight: '10px' }} />
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>WayToDine</span>
        </Navbar.Brand>

        <Nav className="ml-2">
          <Nav.Link href="#" className="location-dropdown">
            Location <FaSearchLocation style={{ marginLeft: '5px' }} />
          </Nav.Link>
        </Nav>
      </div>

      <div style={{ flex: 1 }} />

      <Nav className="navbar-links">
        <Nav.Link href="/"><FaHome /> Home</Nav.Link>
        <Nav.Link href="/help"><FaInfoCircle /> Help</Nav.Link>
        <Nav.Link href="#"><FaPhone /> Contact</Nav.Link>
        <Nav.Link href="/cart"><FaShoppingCart /> Cart</Nav.Link>

        {userName ? (
          <Dropdown>
            <Dropdown.Toggle variant="link" id="user-dropdown" className="dropdown-toggle" style={{ 
                color: 'inherit', // Set text color
                textDecoration: 'none', // Remove underline
              }}>
              <FaUser /> {userName} {/* Display user name */}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item 
                onClick={handleUserNameClick} 
                style={{ backgroundColor: 'white', color: 'black' }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC107'} // Warning color on hover
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'} // Reset background on mouse leave
              >
                My Profile
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={handleYourOrders} 
                style={{ backgroundColor: 'white', color: 'black' }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC107'} // Warning color on hover
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'} // Reset background on mouse leave
              >
                Your Orders
              </Dropdown.Item>
              <Dropdown.Item 
                onClick={handleLogout} 
                style={{ backgroundColor: 'white', color: 'black' }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFC107'} // Warning color on hover
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'} // Reset background on mouse leave
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        ) : (
          <Button onClick={handleLoginClick} variant="warning">Login</Button>
        )}
      </Nav>
    </Navbar>
  );
};

export default CustomNavbar;
