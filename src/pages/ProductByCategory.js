import React, { useState } from 'react';
import { Button, Container,Dropdown,DropdownButton } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaFilter } from 'react-icons/fa';
import FilterPopup from '../components/FilterPopup'; // Import the FilterPopup component
import "../css/ProductByCategory.css";
import RestaurantList from '../components/RestaurantList';


const ProductByCategory = () => {
    const { category } = useParams();
    const [showFilter, setShowFilter] = useState(false);
    const [sortOption, setSortOption] = useState(''); // State for sort option

    const handleSortSelect = (option) => {
        setSortOption(option); // Set the selected sort option
        console.log("Selected sort option:", option); // Log the selected sort option
    };

    return (
        <div className="productByCategory">
            <Navbar />
            <Container>
                <h1 className="mt-4">{category}</h1>
                <p>Deliciously soft and healthy Idlis for an ideal breakfast.</p>

                <div className="d-flex justify-content-start align-items-center mb-3">
                        <Button variant="outline-secondary" className="me-2" onClick={() => setShowFilter(true)}>
                            Filter <FaFilter />
                        </Button>
                        <DropdownButton
                            variant="outline-secondary"
                            title={`Sort By: ${sortOption || "Select"}`}
                            id="sort-dropdown"
                            className="me-2"
                        >
                             <Dropdown.Item onClick={() => handleSortSelect('Default')}>Default</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortSelect('Delivery Time')}>Delivery Time</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortSelect('Rating')}>Rating</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortSelect('Cost: Low to High')}>Cost: Low to High</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSortSelect('Cost: High to Low')}>Cost: High to Low</Dropdown.Item>
                        </DropdownButton>
                        <Button variant="outline-secondary" className="me-2">Pure Veg</Button>
                        <Button variant="outline-secondary" className="me-2">Less than 30 mins</Button>
                        <Button variant="outline-secondary" className="me-2">Less than Rs. 300</Button>
                        <Button variant="outline-secondary">Rs.300 - Rs.600</Button>
                </div>

                <h2>Restaurants to explore</h2>

                <RestaurantList />

            </Container>

            {/* Filter Modal */}
            <FilterPopup show={showFilter} handleClose={() => setShowFilter(false)} />
        </div>
    );
};

export default ProductByCategory;
