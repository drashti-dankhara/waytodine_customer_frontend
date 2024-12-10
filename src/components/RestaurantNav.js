// RestaurantNav.js
import React from 'react';
import { Nav } from 'react-bootstrap';

const RestaurantNav = ({ setActiveTab }) => {
    return (
        <Nav className="nav-pills-custom" variant="pills">
            <Nav.Item>
                <Nav.Link onClick={() => setActiveTab('category')}>Category</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link onClick={() => setActiveTab('about')}>About</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link onClick={() => setActiveTab('reviews')}>Reviews</Nav.Link>
            </Nav.Item>
        </Nav>
    );
};

export default RestaurantNav;
