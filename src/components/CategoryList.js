import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from 'axios';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 

// const categories = [
//   { name: 'Pizzas', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGl6emF8ZW58MHx8MHx8fDA%3D' },
//   { name: 'Burgers', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGl6emF8ZW58MHx8MHx8fDA%3D' },
//   { name: 'Chinese', img: 'https://plus.unsplash.com/premium_photo-1670978265021-ef0f575de914?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bm9vZGxlcyUyMGJvd2x8ZW58MHx8MHx8fDA%3D' },
//   { name: 'Samosa', img: 'https://plus.unsplash.com/premium_photo-1695297516676-04a259917c03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2Ftb3NhfGVufDB8fDB8fHww' },
//   { name: 'Dosa', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZG9zYXxlbnwwfHwwfHx8MA%3D%3D' },
//   { name: 'Momos', img: 'https://plus.unsplash.com/premium_photo-1673769108070-580fe90b8de7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9tb3N8ZW58MHx8MHx8fDA%3D' },
//   { name: 'Shakes', img: 'https://plus.unsplash.com/premium_photo-1695035006301-26ec78a4bf9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2hha2V8ZW58MHx8MHx8fDA%3D' },
//   { name: 'Cakes', img: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D' },
//   { name: 'Momos', img: 'https://plus.unsplash.com/premium_photo-1673769108070-580fe90b8de7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9tb3N8ZW58MHx8MHx8fDA%3D' },
//   { name: 'Shakes', img: 'https://plus.unsplash.com/premium_photo-1695035006301-26ec78a4bf9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2hha2V8ZW58MHx8MHx8fDA%3D' },
//   { name: 'Cakes', img: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FrZXxlbnwwfHwwfHx8MA%3D%3D' },

// ];

const CategoryList = () => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
  };

   // Fetch categories from the API
   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${CUSTOMER_BACKEND_URL}/categories/get-all-categories`);
        if (response.data && response.data.status) {
          setCategories(response.data.data); 
        } else {
          setError(response.data.message || 'Failed to fetch categories');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }
  return (
    <div className="category-section">
    <div className="category-container">
      <div className="scroll-arrows">
        <FaArrowLeft className="scroll-arrow left" onClick={scrollLeft} size={30} />
        <FaArrowRight className="scroll-arrow right" onClick={scrollRight} size={30} />
      </div>
      <div className="categories" ref={containerRef}>
        {categories.map((category) => (
          <Link to={`/product-by-category/${category.name}`} key={category.categoryId} className="category-item">
            <img src={`${category.categoryImage}`} alt={category.name} />
            <p>{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  </div>
  );
}

export default CategoryList;
