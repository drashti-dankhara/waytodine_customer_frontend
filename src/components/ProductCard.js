import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaLeaf, FaArrowRight } from 'react-icons/fa';
import { GiChickenOven } from "react-icons/gi";
import '../css/productCard.css'; // Importing the CSS file
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const ProductCard = ({ product }) => {

    const navigate = useNavigate(); // Hook for navigation
    console.log("product in product card == " , product);

    // const handleAddToCart = async () => {
    //     const token = localStorage.getItem('token');

    //     if (!token) {
    //         toast.error('Please log in to add items to the cart.');
    //         setTimeout(() => navigate("/login"), 1500);
    //         return; 
    //     }

    //     try {
    //         const requestBody = {
    //             restaurantId: product.restaurant.restaurantId,
    //             itemId: product.itemId,
    //             quantity: 1 
    //         };

    //         const response = await axios.post(`${CUSTOMER_BACKEND_URL}/cart/add-to-cart`, requestBody, {
    //             headers: {
    //                 'Authorization': `Bearer ${token}` 
    //             }
    //         });

    //         if (response.data.status) {
    //             toast.success(response.data.message);
    //             setTimeout(() => navigate("/cart"), 1500);
    //         } else {
    //             if (response.status === 409) { // Check for conflict status code
    //                 toast.error(response.data.message); // Display the response message for 409 status
    //             } else {
    //                 toast.error(response.data.message);
    //             }
    //         }
    //     } catch (error) {
    //         if (error.response && error.response.status === 409) {
    //             toast.error(error.response.data.message); // Display the message from error response for 409 status
    //         } else {
    //             toast.error(`Error adding item to cart: ${error}`);
    //         }        }
    // };


    const handleAddToCart = async () => {
        const token = localStorage.getItem('token');
    
        if (!token) {
            toast.error('Please log in to add items to the cart.');
            setTimeout(() => navigate("/login"), 1500);
            return;
        }
    
        try {
            // Step 1: Fetch the user's cart details
            const getCartResponse = await axios.get(`${CUSTOMER_BACKEND_URL}/cart/get-cart-by-user`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (getCartResponse.data.status) {
                const cartItems = getCartResponse.data.data;
    
                if (cartItems.length > 0) {
                    const existingRestaurantId = cartItems[0].restaurantId;
    
                    // Step 2: Check if the product's restaurantId matches the existing cart's restaurantId
                    if (existingRestaurantId !== product.restaurant.restaurantId) {
                        // Prompt user with options
                        if (window.confirm("There are already items from another restaurant in the cart. Would you like to refresh your cart?")) {
                            // User chose to refresh the cart
                            await axios.delete(`${CUSTOMER_BACKEND_URL}/cart/remove-all-cart-item`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
    
                            // Proceed with adding the product to the cart
                            await addToCart(product, token);
                        }
                        return;
                    }
                }
            }
    
            // If no conflicting items or cart is empty, proceed to add the item
            await addToCart(product, token);
        } catch (error) {
            console.error("Error fetching cart details:", error);
            toast.error("Unable to fetch cart details. Please try again.");
        }
    };
    
    // Separate function for adding the item to the cart
    const addToCart = async (product, token) => {
        try {
            const requestBody = {
                restaurantId: product.restaurant.restaurantId,
                itemId: product.itemId,
                quantity: 1,
            };
    
            const response = await axios.post(`${CUSTOMER_BACKEND_URL}/cart/add-to-cart`, requestBody, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.data.status) {
                toast.success(response.data.message);
                setTimeout(() => navigate("/cart"), 1500);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding item to cart:", error);
            toast.error("Unable to add item to the cart. Please try again.");
        }
    };
    

    return (
        <Card className="product-card">
            {/* First Row: Restaurant Name and Small Details */}
            <Card.Body className="product-card-body">
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                    <strong>{product.restaurant.name}</strong> - {product.restaurant.location}
                    <Link 
                        to={`/restaurant-details/${product.itemId}`} // Redirect to the restaurant details page with product.id
                        style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                        <FaArrowRight style={{ position:'absolute', fontSize: '13px', right:'10px' }} />
                    </Link>
                </div>
              
                <div style={{ fontSize: '14px', color: '#6c757d' }}>
                    {product.rating} ⭐ | {product.restaurant.restaurantDetails.openingHoursWeekdays}
                </div>
            </Card.Body>

            <hr className="product-card-divider" />

            {/* Second Row: Product Details and Image */}
            <Row className="g-0 mx-2">
                <Col md={8} className="d-flex flex-column justify-content-center align-items-start p-3">
                    <div className="d-flex align-items-start flex-column">
                        {product.isVeg === 1 ? (
                            <FaLeaf style={{ color: 'green', marginRight: '5px' }} />
                        ) : (
                            <GiChickenOven style={{ color: 'red', marginRight: '5px' }} />
                        )}
                        <Card.Title className="product-card-name">{product.name}</Card.Title>
                    </div>
                    <Card.Text>
                        <strong>₹{product.price}</strong>
                    </Card.Text>
                    <Button
                        variant="outline-secondary"
                        className="product-details-button d-flex align-items-center"
                    >
                        More Details
                        <FaArrowRight style={{ marginLeft: '5px', fontSize: '10px' }} />
                    </Button>
                </Col>
                <Col md={4} className="d-flex flex-column justify-content-center align-items-center">
                    <Card.Img variant="top" src={product.itemImage} className="product-image" />
                    <Button variant="outline-success" className='product-add-button' onClick={handleAddToCart}>
                    + Add
                    </Button>
                </Col>
            </Row>
            <ToastContainer />
        </Card>
    );
};

export default ProductCard;
