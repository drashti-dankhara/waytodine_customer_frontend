import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import FiltersForProductSearch from '../components/FiltersForProductSearch';
import ProductList from '../components/ProductList';
import RestaurantList from '../components/RestaurantList'; // Import RestaurantList

const SearchProducts = () => {
  const [selectedFilter, setSelectedFilter] = useState('dishes'); // Default filter
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({}); 

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  

  console.log("in seragcProducts component == " , searchTerm);
  console.log("activeFilters in SearchProducts == ",activeFilters);

  return (
    <div>
      <Navbar />
      <div className="container">
        <SearchBar onSearch={handleSearch} />
        <FiltersForProductSearch selectedFilter={selectedFilter} onFilterChange={setSelectedFilter}  onAdditionalFiltersChange={setActiveFilters}
          activeFilters={activeFilters}/>
        
        {/* Conditional rendering based on selected filter */}
        {selectedFilter === 'dishes' ? <ProductList searchTerm={searchTerm} activeFilters={activeFilters}/> : <RestaurantList searchTerm={searchTerm}/>}
      </div>
    </div>
  );
};

export default SearchProducts;
