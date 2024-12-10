import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCard from '../components/ProductCard';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant 
import axios from 'axios';

const ProductList = ({ searchTerm, activeFilters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("searchTerm in productList === ", searchTerm);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();

        // Add search term to query params if present
        if (searchTerm) queryParams.append('searchString', searchTerm);

        // Add active filters (sort and type) to query params if present
        if (activeFilters.sort !== undefined) queryParams.append('sort', activeFilters.sort);
        if (activeFilters.type !== undefined) queryParams.append('filter', activeFilters.type);

        // Fetch data using the unified API
        const response = await axios.get(`${CUSTOMER_BACKEND_URL}/items/get-items-sorted-filtered?${queryParams.toString()}`);
        
        console.log("API response:", response.data);

        if (response.data && response.data.status) {
          setProducts(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message || 'An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, activeFilters]);

  return (
    <div className="product-list mt-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <Row>
          {products.map((product, index) => (
            <Col key={index} md={3} className="d-flex">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default ProductList;
