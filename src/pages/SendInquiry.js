import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import {
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api';
import { CUSTOMER_BACKEND_URL, REACT_APP_GOOGLE_MAPS_API_KEY } from "../constants";
import { useNavigate } from 'react-router-dom';

const SendInquiry = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const navigate = useNavigate(); // Initialize the navigation hook
  const autocompleteRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [restaurantDocument, setRestaurantDocument] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRestaurantDocument(file);
    }
  };

  const handleInquirySubmit = async (event) => {
    console.log("here")
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('location', location);
    formData.append('city', city);
    formData.append('country', country);

    if (restaurantDocument) {
      formData.append('restaurantDocument', restaurantDocument);
    }

    try {
      const response = await axios.post(`${CUSTOMER_BACKEND_URL}/restaurants/send-inquiry`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/help'); // Redirect to Help page after success
        }, 2000); // Add a delay so the toast message can be seen
      } else {
        toast.error(response.data.message);
      } 
    } catch (error) {
      console.error('Error submitting the inquiry:', error);
      toast.error('Error submitting the inquiry');
    }
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.formatted_address) {
      setLocation(place.formatted_address);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-warning text-center">Send Inquiry</h1>
      <form>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3" style={{ position: 'relative' }}>
              <label className="form-label">Location</label>
              {isLoaded && (
                <Autocomplete
                  onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                  onPlaceChanged={handlePlaceSelect}
                >
                  <input
                    type="text"
                    className="form-control"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </Autocomplete>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Restaurant Document</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
                required
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-warning" onClick={handleInquirySubmit}>
          Submit Inquiry
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SendInquiry;
