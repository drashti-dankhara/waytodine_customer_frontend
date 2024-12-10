import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa'; // Importing a plus icon
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const MenuItem = ({ title, price, image, description,restaurantId ,itemId}) => {


    const navigate = useNavigate();
    const restaurantid = Number(restaurantId);


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
    
                    if (existingRestaurantId !== restaurantid) {
                        // Prompt user with options
                        if (window.confirm("There are already items from another restaurant in the cart. Would you like to refresh your cart?")) {
                            // User chose to refresh the cart
                            await axios.delete(`${CUSTOMER_BACKEND_URL}/cart/remove-all-cart-item`, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
    
                            // Proceed with adding the product to the cart
                            await addToCart(restaurantid,itemId, token);
                        }
                        return;
                    }
                }
            }
    
            // If no conflicting items or cart is empty, proceed to add the item
            await addToCart(restaurantid,itemId, token);
        } catch (error) {
            console.error("Error fetching cart details:", error);
            toast.error("Unable to fetch cart details. Please try again.");
        }
    };
    


    // Separate function for adding the item to the cart
    const addToCart = async (restaurantid,itemId, token) => {
        try {
            const requestBody = {
                restaurantId: restaurantid,
                itemId: itemId,
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
        <Card className="menu-item">
            <div className="menu-item-content">
                <img className="menu-item-image" src={image} alt={title} />
                <Card.Body className="menu-item-details">
                    <Card.Title>{title}</Card.Title>
                    <Card.Text className="menu-item-price">${price}</Card.Text>
                    <Card.Text className="menu-item-description">{description}</Card.Text>
                    <Button variant="outline-success" className="add-to-cart-btn" onClick={handleAddToCart}>
                        <FaPlus /> Add to Cart
                    </Button>
                </Card.Body>
            </div>
            <ToastContainer />
        </Card>
    );
};

export default MenuItem;
