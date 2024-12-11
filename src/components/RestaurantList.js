// src/components/RestaurantList.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 

// const restaurants = [
//   {
//       id: 1,
//       name: 'Thalaivaa',
//       rating: 4.6,
//       cuisine: 'South Indian, Desserts, Beverages',
//       offer: '35% OFF',
//       time: '30-35 mins',
//       location: 'City Light',
//       image: 'https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBpenphJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
//   },
//   {
//       id: 2,
//       name: 'Shree Tirupati Balaji Idli',
//       rating: 4.5,
//       cuisine: 'South Indian',
//       offer: '',
//       time: '20-25 mins',
//       location: 'Athwa',
//       image: 'https://plus.unsplash.com/premium_photo-1673823195780-8444a76cfde6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emElMjByZXN0YXVyYW50fGVufDB8fDB8fHww',
//   },
//   {
//       id: 3,
//       name: "Haldiram's Restaurant",
//       rating: 4.4,
//       cuisine: 'North Indian, South Indian, Biryani',
//       offer: '₹100 OFF ABOVE ₹499',
//       time: '40-45 mins',
//       location: 'Piplod',
//       image: 'https://images.unsplash.com/photo-1672596467694-65f215f9b5fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBpenphJTIwcmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
//   },
//   {
//       id: 4,
//       name: 'Tipsy Topsy',
//       rating: 4.5,
//       cuisine: 'North Indian, Thalis, Chinese, Fast Food',
//       offer: '₹125 OFF ABOVE ₹349',
//       time: '25-30 mins',
//       location: 'Nanpura',
//       image: 'https://plus.unsplash.com/premium_photo-1693156020367-d6fe9bce522a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBpenphfGVufDB8fDB8fHww',
//   },
// ];

const RestaurantList = ({ searchTerm }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("searchTerm in res list componet == ", searchTerm);

    useEffect(() => {


        const fetchSearchedResData = async () => {
            // Fetch the restaurants data
            axios
                .get(`${CUSTOMER_BACKEND_URL}/restaurants/get-all-restaurants-by-name/${searchTerm}`)
                .then((response) => {
                    if (response.data && response.data.status) {
                        setRestaurants(response.data.data); // Assuming response structure contains 'data'
                        setLoading(false);

                    } else {
                        setError(response.data.message || 'Failed to fetch categories');
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching restaurants:', error);
                    setError(error.message || 'An error occurred while fetching categories');
                    setLoading(false);
                });
        };




        const fetchAllRestaurants = async () => {
            axios
                .get(`${CUSTOMER_BACKEND_URL}/restaurants/get-all-restaurants`)
                .then((response) => {
                    if (response.data && response.data.status) {
                        setRestaurants(response.data.data); // Assuming response structure contains 'data'
                        setLoading(false);

                    } else {
                        setError(response.data.message || 'Failed to fetch categories');
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching restaurants:', error);
                    setError(error.message || 'An error occurred while fetching categories');
                    setLoading(false);
                });
        };


        if (searchTerm) {
            fetchSearchedResData();
        } else {
            fetchAllRestaurants();
        }
    }
        , [searchTerm]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="mt-3">
            <Row>
                {restaurants.map((restaurant) => (
                    <Col md={3} key={restaurant.restaurantId}>
                        <Link to={`/restaurant-details/${restaurant.restaurantId}`} style={{ textDecoration: 'none' }}>
                            <Card className="mb-4 restaurant-card">
                                <div className="image-container">
                                    {/* <Card.Img variant="top" src={restaurant.bannerImage} className="card-img-top" /> */}
                                    <Card.Img
                                        variant="top"
                                        src={restaurant.bannerImage || "data:image/png;base64,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"}
                                        className="card-img-top"
                                    />

                                    {restaurant.currentOfferDiscountRate && (
                                        <div className="offer-badge">{`${restaurant.currentOfferDiscountRate}% OFF `}</div>
                                    )}
                                </div>
                                <Card.Body>
                                    <Card.Title>{restaurant.name}</Card.Title>
                                    <Card.Text>
                                        <span className="rating-text">
                                            <FaStar className="rating-star" /> {restaurant.averageRating} • {restaurant.openingHoursWeekdays}
                                        </span><br />
                                        <span>{Array.isArray(restaurant.specialities) ? restaurant.specialities.join(", ") : "No specialities available"}</span>
                                        <br />
                                        <span>{restaurant.location}</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}

            </Row>
        </div>
    );
};

export default RestaurantList;
