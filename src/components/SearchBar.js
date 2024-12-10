// src/components/SearchBar.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleClick = () => {
  
    navigate('/search-products');
  };

  const handleButtonClick = () => {
    if (onSearch) {
      onSearch(searchTerm); // Only call if onSearch is provided
    }
    navigate('/search-products');
  };
  
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="search-bar mt-4">
      <Form className="d-flex justify-content-center">
        <Form.Control
          type="search"
          placeholder="Search for Chicken Biryani"
          className="w-50"
          value={searchTerm}
          onChange={handleChange}
          onClick={handleClick}
        />
        <Button variant="warning" className="ms-2" onClick={handleButtonClick}>Search</Button>
      </Form>
    </div>
  );
};

export default SearchBar;
