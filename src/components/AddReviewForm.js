// AddReviewForm.js
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa'; // Import star icon
import axios from 'axios';
import { CUSTOMER_BACKEND_URL, CUSTOMER_IMAGE_URL } from "../constants"; // Import the constant 
import { ToastContainer, toast } from 'react-toastify'; // Import toast notifications
import { useNavigate } from 'react-router-dom'; 
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the toast
import Reviews from './Reviews';


const AddReviewForm = ({ restaurantId,onReviewAdded}) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const token = localStorage.getItem('token'); // Replace with your method for retrieving the Bearer Token

        if (!token) {
            setError('Authorization token is missing. Please log in.');
            toast.error("Please Login First!!");
            setTimeout(() => {
                navigate('/login');
            }, 2000); 
            return;
        }

        const requestBody = {
            restaurantId: restaurantId,
            rating: rating,
            review: review,
        };

        try {
            const response = await axios.post(`${CUSTOMER_BACKEND_URL}/feedback/add-feedback`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the Bearer Token
                },
            });

            if (response.data && response.data.status) {
                setSuccess('Review added successfully!');
                toast.success('Review added successfully!');
                setReview('');
                setRating(0); // Reset form
                if (onReviewAdded) {
                    onReviewAdded(response.data.data);
                }
            } else {
                setError(response.data.message || 'Failed to add review.');
                toast.error(response.data.message || 'Failed to add review.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while submitting the review.');
            toast.error(err.response?.data?.message || 'An error occurred while submitting the review.'); // Display error notification
        }
    };


    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="rating" className='mb-3'>
                    <Form.Label>Your Rating</Form.Label>
                    <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                style={{
                                    cursor: 'pointer',
                                    color: rating >= star ? '#FFD700' : '#e4e5e9',
                                    fontSize: '20px',
                                }}
                            >
                                <FaStar />
                            </span>
                        ))}
                    </div>
                </Form.Group>
                <Form.Group controlId="review" className='mb-3'>
                    <Form.Label>Your Review</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Write your review..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />
                </Form.Group>
                <Button variant="warning" type="submit">
                    Submit Review
                </Button>
            </Form>

             <ToastContainer />

        </div>

    );
};

export default AddReviewForm;
