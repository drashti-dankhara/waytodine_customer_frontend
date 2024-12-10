import React, { useEffect, useState } from 'react';
import CustomNavbar from '../components/Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import "../css/RestaurantDetails.css";
import RestaurantHeader from '../components/RestaurantHeader';
import RestaurantNav from '../components/RestaurantNav';
import RestaurantCategory from '../components/RestaurantCategory';
import MenuItem from '../components/MenuItem';
import AboutRestaurant from '../components/AboutRestaurant';
import Reviews from '../components/Reviews';
import { useParams } from 'react-router-dom'; 
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 
import axios from 'axios';


const RestaurantDetails = () => {

    const { id: restaurantId } = useParams();

    const [restaurant, setRestaurant] = useState(null); // State to store restaurant data
    const [menuItems, setMenuItems] = useState([]);

    const [loading, setLoading] = useState(true); // State to handle loading state
    const [error, setError] = useState(null); // State to handle errors

    const [activeCategory, setActiveCategory] = useState(null);
    const [activeTab, setActiveTab] = useState('category');



    useEffect(() => {
        const fetchRestaurantDetails = async () => {
            try {
                const response = await axios.get(`${CUSTOMER_BACKEND_URL}/restaurants/get-restaurant/${restaurantId}`);
                if (response.data && response.data.status) {
                    setRestaurant(response.data.data);
                } else {
                    throw new Error("Failed to fetch restaurant details");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantDetails();
    }, [restaurantId]);

    useEffect(() => {
        const fetchInitialMenuItems = async () => {
            try {
                const response = await axios.get(
                    `${CUSTOMER_BACKEND_URL}/items/get-items-restaurant/${restaurantId}`
                );
                if (response.data && response.data.status) {
                    setMenuItems(response.data.data);
                } else {
                    throw new Error("Failed to fetch initial menu items");
                }
            } catch (err) {
                setError(err.message);
            }
        };

        if (!activeCategory) {
            fetchInitialMenuItems();
        }
    }, [restaurantId, activeCategory]);

    const fetchMenuItems = async (categoryId) => {
        try {
            const response = await axios.get(
                `${CUSTOMER_BACKEND_URL}/items/get-items-restaurant-category/${restaurantId}/${categoryId}`
            );
            if (response.data && response.data.status) {
                setMenuItems(response.data.data);
            } else {
                throw new Error("Failed to fetch menu items");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    console.log('Restaurant data in res details page :', restaurant);

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        fetchMenuItems(categoryId);
    };
   
    const renderContent = () => {
        switch (activeTab) {
            case 'category':
                return <RestaurantCategory restaurant={restaurant} onCategoryClick={handleCategoryClick} />;
            default:
                return <RestaurantCategory restaurant={restaurant} onCategoryClick={handleCategoryClick} />;
        }
    };

    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="restaurantDetails">
            <CustomNavbar />
            <Container>
                {/* Restaurant Header */}
                <Row className="mt-4">
                    <Col>
                        <RestaurantHeader restaurant={restaurant}/>
                    </Col>
                </Row>

                {/* Navigation */}
                <Row className="mt-4">
                    <RestaurantNav setActiveTab={setActiveTab} />
                </Row>

                <Row className="mt-4">
                    {activeTab === 'category' ? (
                        <>
                            <Col md={3}>
                                {renderContent()}
                            </Col>
                            <Col md={9}>
                                <Row>
                                    {menuItems.map((item, index) => (
                                        <Col md={6} key={index}>
                                            <MenuItem
                                                itemId={item.itemId}
                                                title={item.name}
                                                price={item.price}
                                                image={item.itemImage}
                                                description={item.description}
                                                restaurantId={restaurantId}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Col>
                        </>
                    ) : (
                        <Col md={12}>
                            {activeTab === 'about' && <AboutRestaurant restaurant={restaurant} />}
                            {activeTab === 'reviews' && <Reviews restaurantId={restaurant.restaurantId} />}
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default RestaurantDetails