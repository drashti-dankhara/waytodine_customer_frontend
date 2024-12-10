import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add navigation
import CustomNavbar from '../components/Navbar';

const HelpSupport = () => {
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate(); // Initialize navigation

  const toggleSection = (index) => {
    setActiveSection(activeSection === index ? null : index);
  };

  const handleSendRequest = () => {
    navigate('/send-inquiry'); // Navigate to the SendInquiry page
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
        <h1 className="text-warning text-center">Help & Support</h1>
        <div className="accordion" id="faqAccordion">
          {faqItems.map((item, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${activeSection === index ? '' : 'collapsed'}`}
                  type="button"
                  onClick={() => toggleSection(index)}
                >
                  {item.question}
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${activeSection === index ? 'show' : ''}`}
              >
                <div className="accordion-body">
                  {item.answer}
                  {index === 0 && (
                    <button className="btn btn-warning mt-3" onClick={handleSendRequest}>
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
  );
};

export default HelpSupport;
