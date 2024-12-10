// Reviews.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../css/RestaurantDetails.css'; // Make sure to create this CSS file
import AddReviewForm from './AddReviewForm';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 
import axios from 'axios';

const Reviews = ({restaurantId}) => {

    const [reviews, setReviews] = useState([]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${CUSTOMER_BACKEND_URL}/feedback/get-all-feedback/${restaurantId}`);
            if (response.data.status) {
                setReviews(response.data.data);
            } else {
                console.error('Failed to fetch reviews:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };


    useEffect(() => {
      
        fetchReviews();
    }, [restaurantId]);

    const handleReviewAdded = (newReview) => {
        // Add the new review to the beginning of the existing reviews array
        setReviews((prevReviews) => [newReview, ...prevReviews]);
    };

    return (
        <Container className="reviews-container">
            <Row>
                <Col md={4} className="add-review-col">
                    <h5>Add a Review</h5>
                    <AddReviewForm restaurantId={restaurantId} onReviewAdded={handleReviewAdded} />
                </Col>
                <Col md={8} className="reviews-list-col">
                    <h5>User Reviews</h5>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <Card key={review.feedbackId} className="review-card">
                                <Card.Body className="review-card-body">
                                    <img
                                        src={review.customer.profilePic ? `${review.customer.profilePic}` : 'https://via.placeholder.com/50'}
                                        alt={review.customer.firstName}
                                        className="review-user-image"
                                    />
                                    <div className="review-content">
                                        <h6>{`${review.customer.firstName} ${review.customer.lastName}`}</h6>
                                        <p className="review-rating">{"★".repeat(Math.floor(review.rating))}</p>
                                        <p>{review.review}</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No reviews available.</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Reviews;
