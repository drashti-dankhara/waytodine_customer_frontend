import React from 'react';
import { Nav } from 'react-bootstrap';

const RestaurantCategory = ({ restaurant, onCategoryClick }) => {
    console.log("restuarnt data in res categories list : ",restaurant);

    return (
        <Nav defaultActiveKey="/category" className="flex-column menu-categories">
            {restaurant?.categories?.map((category) => (
                <Nav.Link 
                    key={category.id} 
                    onClick={() => onCategoryClick(category.id)}
                    style={{ cursor: "pointer" }}
                >
                    {category.name}
                </Nav.Link>
            ))}
        </Nav>
    );
};

export default RestaurantCategory;
