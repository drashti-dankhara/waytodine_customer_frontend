import React, { useEffect, useState } from 'react';
import { Card, Image } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa'; // Importing the location icon

const RestaurantHeader = ({ restaurant }) => {
   

    return (
        <Card className="restaurant-header">
            <Image
                src={restaurant.bannerImage || "https://via.placeholder.com/500"}
                fluid
                className="restaurant-image"
            />
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2>{restaurant.name}</h2>
                        <p className="restaurant-rating">
                            <span className="star">&#9733;</span>  {restaurant.averageRating} ({restaurant.totalReviews} reviews)
                        </p>
                        <p>
                            <FaMapMarkerAlt className="location-icon" /> &nbsp;
                            {restaurant.location}, {restaurant.city}, {restaurant.country}
                        </p>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default RestaurantHeader;
