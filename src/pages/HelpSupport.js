import React, { useState } from 'react';
import CustomNavbar from '../components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // Import the constant
import axios from 'axios';

const HelpSupport = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [showModal, setShowModal] = useState(false);

   // State for each input field
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [location, setLocation] = useState('');
   const [city, setCity] = useState('');
   const [country, setCountry] = useState('');
   const [restaurantDocument, setRestaurantDocument] = useState(null);

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  const handleSendRequest = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        setRestaurantDocument(file);
    }
};

  const handleInquirySubmit = async (event) => {
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


      const response = await axios.post(`${CUSTOMER_BACKEND_URL}/restaurants/send-inquiry`,formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // Important for FormData
        }
    });

    console.log("in help support === ", response.data)
    
      if (response.data.status) {
        toast.success(response.data.message);
        setShowModal(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting the inquiry:', error);
      toast.error('Error submitting the inquiry:', error);    }
  };  
  

  const faqItems = [
    {
      question: "I want to partner my restaurant with Swiggy",
      answer:
        "To partner with Swiggy, you can visit our Partner Onboarding page and fill out the required form. A Swiggy representative will contact you to guide you through the process.",
    },
    {
      question: "I want to start the delivery service, so how can I do it?",
      answer:
        "Starting delivery service with Swiggy is easy. Reach out to our support team, and they’ll assist you in getting started, including setting up your menu and delivery options.",
    },
    {
      question: "What are the mandatory documents needed to list my restaurant on Swiggy?",
      answer:
        "The mandatory documents include a copy of your FSSAI License, GST registration, and a bank account proof for payment settlements.",
    },
    {
      question: "After I submit all documents, how long will it take for my restaurant to go live on Swiggy?",
      answer:
        "Once all documents are verified, it typically takes 5-7 business days for your restaurant to go live on Swiggy.",
    },
    {
      question: "What is this one-time Onboarding fee? Do I have to pay for it while registering?",
      answer:
        "The one-time onboarding fee is charged to cover setup costs. Yes, you need to pay it during the registration process.",
    },
  ];

  return (
    <div>
      <CustomNavbar />
      <div className="container my-5">
        <div className="text-center mb-4">
          <h1 className="text-warning">Help & Support</h1>
          <p className="text-muted">Let's take a step ahead and help you better.</p>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h2 className="text-warning mb-3">FAQ</h2>
            <div className="accordion" id="faqAccordion">
              {faqItems.map((item, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className={`accordion-button ${
                        activeSection === index ? '' : 'collapsed'
                      }`}
                      type="button"
                      onClick={() => toggleSection(index)}
                    >
                      {item.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className={`accordion-collapse collapse ${
                      activeSection === index ? 'show' : ''
                    }`}
                  >
                    <div className="accordion-body">
                      {item.answer}
                      {index === 0 && (
                        <button
                          className="btn btn-outline-warning mt-3"
                          onClick={handleSendRequest}
                        >
                          Send Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1050,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="modal-dialog" style={{ zIndex: 1060 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Partner Inquiry</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
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
                      <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                        />
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
                    Send Inquiry
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default HelpSupport;
