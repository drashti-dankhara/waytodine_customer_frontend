import React, { useState } from 'react';
import { Modal, Button, Form, Nav } from 'react-bootstrap';

const FilterPopup = ({ show, handleClose }) => {
    const [activeOption, setActiveOption] = useState('veg'); // Tracks the active filter option
    const [veg, setVeg] = useState(false);
    const [nonVeg, setNonVeg] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState([]);
    const [cost, setCost] = useState([]);
    const [sort, setSort] = useState(''); // State for sorting option

    const handleApply = () => {
        // Handle the apply logic here
        console.log("Applied Filters", { veg, nonVeg, deliveryTime, cost, sort });
        handleClose(); // Close the modal
    };

    const handleClear = () => {
        setVeg(false);
        setNonVeg(false);
        setDeliveryTime([]);
        setCost([]);
        setSort(''); // Reset sort option
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Filter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="filter-container">
                    {/* Sidebar Navigation */}
                    <Nav className="flex-column" style={{ width: '200px', borderRight: '1px solid #ddd' }}>
                        <Nav.Link
                            onClick={() => setActiveOption('sort')}
                            active={activeOption === 'sort'}
                        >
                            Sort
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => setActiveOption('veg')}
                            active={activeOption === 'veg'}
                        >
                            Veg/Non-Veg
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => setActiveOption('deliveryTime')}
                            active={activeOption === 'deliveryTime'}
                        >
                            Delivery Time
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => setActiveOption('cost')}
                            active={activeOption === 'cost'}
                        >
                            Cost
                        </Nav.Link>

                    </Nav>

                    {/* Content Area */}
                    <div className="filter-content" style={{ paddingLeft: '20px' }}>
                        {activeOption === 'veg' && (
                            <>
                                <h5>Veg/Non-Veg</h5>
                                <Form.Check
                                    type="checkbox"
                                    label="Veg"
                                    checked={veg}
                                    onChange={() => setVeg(!veg)}
                                />
                                <Form.Check
                                    type="checkbox"
                                    label="Non-Veg"
                                    checked={nonVeg}
                                    onChange={() => setNonVeg(!nonVeg)}
                                />
                            </>
                        )}
                        {activeOption === 'deliveryTime' && (
                            <>
                                <h5>Delivery Time</h5>
                                {['< 30 mins', '30-45 mins', '45-60 mins'].map((time) => (
                                    <Form.Check
                                        key={time}
                                        type="checkbox"
                                        label={time}
                                        onChange={() => setDeliveryTime(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time])}
                                    />
                                ))}
                            </>
                        )}
                        {activeOption === 'cost' && (
                            <>
                                <h5>Cost</h5>
                                {['< 100', '100 - 200', '200 - 500', '> 500'].map((costRange) => (
                                    <Form.Check
                                        key={costRange}
                                        type="checkbox"
                                        label={costRange}
                                        onChange={() => setCost(prev => prev.includes(costRange) ? prev.filter(c => c !== costRange) : [...prev, costRange])}
                                    />
                                ))}
                            </>
                        )}
                        {activeOption === 'sort' && (
                            <>
                                <h5>Sort By</h5>
                                {['Delivery Time', 'Rating', 'Cost: Low to High', 'Cost: High to Low'].map((option) => (
                                    <Form.Check
                                        key={option}
                                        type="radio"
                                        label={option}
                                        name="sortOptions"
                                        checked={sort === option}
                                        onChange={() => setSort(option)}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClear}>Clear Filter</Button>
                <Button variant="warning" onClick={handleApply}>Apply</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default FilterPopup;
