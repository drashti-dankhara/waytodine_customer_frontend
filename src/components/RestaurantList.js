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

const RestaurantList = ({searchTerm}) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log("searchTerm in res list componet == ",searchTerm);

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
          }} 
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
                                    <Card.Img variant="top" src={restaurant.bannerImage} className="card-img-top" />
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
                                        <span>{restaurant.specialities.join(", ")}</span>
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
