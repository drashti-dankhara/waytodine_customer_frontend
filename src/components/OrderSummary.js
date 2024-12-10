import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // Import the constant
import { REACT_APP_GOOGLE_MAPS_API_KEY } from "../constants.js";

const OrderSummary = ({ quantity, itemPrice, discountPercent, discount, deliveryCharge, deliveryPercent, totalAmount, restaurantId }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [restaurantLocation, setRestaurantLocation] = useState(null);
    const [userLocationPoint, setUserLocationPoint] = useState(null);
    const [restaurantLocationPoint, setRestaurantLocationPoint] = useState(null);
    const navigate = useNavigate();


    // Function to get latitude and longitude from an address and return in POINT format
    const getCoordinates = async (address) => {
        try {

            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: REACT_APP_GOOGLE_MAPS_API_KEY,
                },
            });

            console.log("response.data == ",response.data);

            if (response.data.results.length > 0) {
                const location = response.data.results[0].geometry.location;
                return `${location.lat},${location.lng}`;
            } else {
                throw new Error('No results found for the given address.');
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            throw new Error('Failed to fetch coordinates. Please try again later.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
    
                if (!token) {
                    toast.error('Please log in to view this page.');
                    setTimeout(() => navigate("/login"), 1500);
                    return;
                }
    
                console.log("Fetching data for restaurantId:", restaurantId);
    
                // Fetch user profile location
                const userProfileResponse = await axios.get(`${CUSTOMER_BACKEND_URL}/user/get-profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (userProfileResponse.data.status) {
                    const userLocationAddress = userProfileResponse.data.data.location;
                    setUserLocation(userLocationAddress);
    
                    const userCoordinates = await getCoordinates(userLocationAddress);
                    setUserLocationPoint(userCoordinates);
                } else {
                    toast.error('Failed to fetch user profile. Please try again.');
                    return;
                }
    
                // Ensure restaurantId is valid
                if (!restaurantId) {
                    toast.error('Invalid restaurant ID. Please try again.');
                    return;
                }
    
                // Fetch restaurant details location
                const restaurantResponse = await axios.get(`${CUSTOMER_BACKEND_URL}/restaurants/get-restaurant/${restaurantId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (restaurantResponse.data.status) {
                    const restaurantLocationAddress = restaurantResponse.data.data.location;
                    setRestaurantLocation(restaurantLocationAddress);
    
                    const restaurantCoordinates = await getCoordinates(restaurantLocationAddress);
                    setRestaurantLocationPoint(restaurantCoordinates);
                } else {
                    toast.error('Failed to fetch restaurant details. Please try again.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('An error occurred while fetching data. Please try again.');
            }
        };
    
        // Fetch data only if restaurantId is available
        if (restaurantId) {
            fetchData();
        }

        console.log("userLocation updated:", userLocation);
    console.log("restaurantLocation updated:", restaurantLocation);
    console.log("userLocationPoint updated:", userLocationPoint);
    console.log("restaurantLocationPoint updated:", restaurantLocationPoint);
    }, [restaurantId]);
    

    const handlePlaceOrder = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Please log in to add items to the cart.');
                setTimeout(() => navigate("/login"), 1500);
                return;
            }

            if (!userLocation) {
                toast.error('Please add your address in the profile section.');
                return;
            }


            if (!userLocation || !restaurantLocation) {
                toast.error('Unable to fetch locations. Please try again later.');
                return;
            }

            // Prepare request data for placing the order
            const requestBody = {
                restaurantId: restaurantId,
                amount: totalAmount,
                discount: discount,
                dropoffLocation: userLocationPoint,
                pickupLocation: restaurantLocationPoint,
                dropoffCity: userLocation,
                pickupCity: restaurantLocation,

            };

            // Call API to place the order
            const response = await axios.post(`${CUSTOMER_BACKEND_URL}/order/create-order`, requestBody, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status) {
                // Redirect to payment URL
                const paymentUrl = response.data.data.payment_url;
                toast.success('Order placed successfully. Redirecting to payment...');
                setTimeout(() => {
                    window.location.href = paymentUrl;
                }, 1500);
            } else {
                toast.error('Failed to place order. Please try again.');
            }

        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('An error occurred while placing the order. Please try again.');
        }
    };
    return (
        <>
            <Card className="shadow">
                <Card.Body>
                    <div className="summary-item d-flex justify-content-between">
                        <span>Price ({quantity} items)</span>
                        <span>₹{itemPrice}</span>
                    </div>
                    <div className="summary-item d-flex justify-content-between">
                        <span>Discount ({discountPercent}%)</span>
                        <span>- ₹{discount.toFixed(2)}</span>
                    </div>
                    <div className="summary-item d-flex justify-content-between">
                        <span>Delivery charges ({deliveryPercent}%)</span>
                        <span>+ ₹{deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="summary-item d-flex justify-content-between">
                        <span>You’ll save ₹{discount.toFixed(2)} on this order 🎉</span>
                    </div>
                    <div className="total-amount d-flex justify-content-between mt-3">
                        <strong>Total Amount</strong>
                        <strong>₹{totalAmount.toFixed(2)}</strong>
                    </div>
                    <Button variant="warning" className="mt-3 w-100" onClick={handlePlaceOrder} >
                        Place Order
                    </Button>
                </Card.Body>
            </Card>



        </>
    );
};

export default OrderSummary;
