import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CUSTOMER_BACKEND_URL } from '../constants';
import Navbar from '../components/Navbar';
import '../css/ProfilePage.css';
import { Button, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
} from '@react-google-maps/api';
import { REACT_APP_GOOGLE_MAPS_API_KEY } from "../constants.js";

const ProfilePage = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // 'places' library is needed for autocomplete
  });

  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const autocompleteRef = useRef(null); // Reference for the Autocomplete component
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get(`${CUSTOMER_BACKEND_URL}/user/get-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        setUserData(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhoneNumber(data.phoneNumber);
        setLocation(data.location);
        setImagePreview(data.profilePic);


        // const response2 = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        //     params: {
        //       address: data.location,
        //       key: REACT_APP_GOOGLE_MAPS_API_KEY,
        //     },
        //   });

        // console.log("res 2 ====== ",response2.data.results[0].geometry.location);

      } catch (error) {
        console.error("Error fetching user profile:", error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('phoneNumber', phoneNumber);
    formData.append('location', location);

    if (profileImage) {
      formData.append('profilePic', profileImage);
    }

    try {
      const response = await axios.put(`${CUSTOMER_BACKEND_URL}/user/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${CUSTOMER_BACKEND_URL}/user/change-password`,
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data.message || 'Failed to change password.');
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.formatted_address) {
      setLocation(place.formatted_address); // Set the selected location

    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="profile-page">
        <div className="left-section">
          <h2>User Profile</h2>
          {userData && (
            <div className="profile-info">
              <img src={imagePreview} alt="Profile" className="profile-pic" />
            </div>
          )}
          <Form>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              {isLoaded && (
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={handlePlaceSelect}
                >
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Autocomplete>
              )}
            </Form.Group>
            <Form.Group controlId="profileImage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Button onClick={handleProfileUpdate} variant="warning mt-3">
              Save Changes
            </Button>
          </Form>
        </div>

        <div className="right-section">
          <h3>Update Password</h3>
          <Form>
            <Form.Group controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button onClick={handleChangePassword} variant="warning mt-3">
              Change Password
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
