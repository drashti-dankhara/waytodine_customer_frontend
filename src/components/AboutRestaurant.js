import React from 'react';
import { Card } from 'react-bootstrap';
import { FaClock, FaUtensils, FaInfoCircle } from 'react-icons/fa'; // Importing relevant icons
import { MdContactPhone } from "react-icons/md";


const AboutRestaurant = ({ restaurant }) => {
    console.log('Restaurant data in about page :', restaurant);

    if (!restaurant) {
        return <p>Loading restaurant details...</p>;
    }
    return (
        <div className="about-restaurant">
            <p className="about-text">
                {restaurant.description}
            </p>
            <div className="about-details">
                <Card className="about-item">
                    <Card.Body>
                        <FaClock className="about-icon" />
                        <h5>Opening Hours</h5>
                        <p>Monday - Friday: {restaurant.openingHoursWeekdays}</p>
                        <p>Saturday - Sunday: {restaurant.openingHoursWeekends}</p>
                    </Card.Body>
                </Card>
                <Card className="about-item">
                    <Card.Body>
                        <FaUtensils className="about-icon" />
                        <h5>Specialties</h5>
                        {
                            restaurant.specialities.map((speciality, index) => (
                                <p key={index}>{speciality}</p>
                            ))
                        }
                    </Card.Body>
                </Card>
                <Card className="about-item">
                    <Card.Body>
                        <FaInfoCircle className="about-icon" />
                        <h5>Our Mission</h5>
                        <p>{restaurant.mission}</p>
                    </Card.Body>
                </Card>

                <Card className="about-item">
                    <Card.Body>
                        <MdContactPhone className="about-icon" />
                        <h5>Contact Us</h5>
                        <p>Phone Number : {restaurant.phoneNumber}</p>
                        <p>Email : {restaurant.email}</p>
                        <p>Address : {restaurant.location} , {restaurant.city} , {restaurant.country}</p>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default AboutRestaurant;
