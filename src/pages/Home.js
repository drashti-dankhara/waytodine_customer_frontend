// src/components/Home.js
import React from 'react';
import Navbar from '../components/Navbar';
import CategoryList from '../components/CategoryList';
import SearchBar from '../components/SearchBar';
import RestaurantList from '../components/RestaurantList';
import { Container } from 'react-bootstrap';
import "../css/Home.css";

const Home = () => {
  return (
    <div className="home">
      <Navbar />
      <Container>
        <h2 className="mt-4 text-center">What's on your mind?</h2>
        <CategoryList />
        <SearchBar />
        <h2 className="text-center mb-4">Restaurants near you</h2>
        <RestaurantList />
      </Container>
    </div>
  );
};

export default Home;
