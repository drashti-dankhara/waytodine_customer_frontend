import React from 'react';
import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

const FiltersForProductSearch = ({ selectedFilter, onFilterChange, onAdditionalFiltersChange,activeFilters }) => {

  const handleFilterChange = (filterKey, filterValue) => {
    onAdditionalFiltersChange((prevFilters) => ({
      ...prevFilters,
      [filterKey]: prevFilters[filterKey] === filterValue ? 0 : filterValue, // Toggle filter value
    }));
  };

  const isActive = (filterKey, filterValue) => {
    return activeFilters[filterKey] === filterValue;
  };


  return (
    <div className="filter-bar d-flex justify-content-between mt-4">
      {/* Filter for Restaurants and Dishes */}
      <ButtonGroup>
        <Button
          variant={selectedFilter === 'restaurants' ? 'dark' : 'outline-dark'}
          onClick={() => onFilterChange('restaurants')}
        >
          Restaurants
        </Button>
        <Button
          variant={selectedFilter === 'dishes' ? 'dark' : 'outline-dark'}
          onClick={() => onFilterChange('dishes')}
        >
          Dishes
        </Button>
      </ButtonGroup>

        {/* Sorting and Filter options */}
        <div className="d-flex gap-2">
        <DropdownButton title="Sort by" variant="outline-secondary">
          <Dropdown.Item
            onClick={() => handleFilterChange('sort', 1)}
            active={isActive('sort', 1)}
          >
            Price
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => handleFilterChange('sort', 2)}
            active={isActive('sort', 2)}
          >
            Alphabetically
          </Dropdown.Item>
        </DropdownButton>
        <Button
          variant={isActive('type', 1) ? 'dark' : 'outline-secondary'}
          onClick={() => handleFilterChange('type', 1)}
        >
          Veg
        </Button>
        <Button
          variant={isActive('type', 2) ? 'dark' : 'outline-secondary'}
          onClick={() => handleFilterChange('type', 2)}
        >
          Non-Veg
        </Button>
      </div>
    </div>
  );
};

export default FiltersForProductSearch;
