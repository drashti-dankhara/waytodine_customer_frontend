import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../components/Navbar';
import '../css/OrdersPage.css'; // Import additional CSS for styling
import { CUSTOMER_BACKEND_URL } from '../constants';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  // State for orders
  const [pastOrders, setPastOrders] = useState({});
  const [currentOrders, setCurrentOrders] = useState({});
  const [selectedTab, setSelectedTab] = useState('current');

  const authToken = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
      if (!authToken) {
          toast.error('Please log in to track your order.');
      }
  }, [authToken]);

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Fetch past orders from the API
  const fetchPastOrders = async () => {
    try {
      const response = await axios.get(`${CUSTOMER_BACKEND_URL}/cart/get-delivered-carts`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response.data.status) {
        const groupedOrders = groupOrdersById(response.data.data);
        setPastOrders(groupedOrders);
      }
    } catch (error) {
      console.error('Error fetching past orders:', error);
    }
  };

  // Fetch current orders from the API
  const fetchCurrentOrders = async () => {
    try {
      const response = await axios.get(`${CUSTOMER_BACKEND_URL}/cart/get-current-orders`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (response.data.status) {
        const groupedOrders = groupOrdersById(response.data.data);
        setCurrentOrders(groupedOrders);
      }
    } catch (error) {
      console.error('Error fetching current orders:', error);
    }
  };

  // Helper function to group orders by orderId
  const groupOrdersById = (orders) => {
    return orders.reduce((acc, order) => {
      if (!acc[order.orderId]) {
        acc[order.orderId] = {
          ...order,
          orderedItems: []
        };
      }
      acc[order.orderId].orderedItems.push(...order.orderedItems);
      return acc;
    }, {});
  };

  // Use effect to fetch orders on component mount
  useEffect(() => {
    fetchPastOrders();
    fetchCurrentOrders();
  }, []);

  // Function to handle tracking button click
  const handleTrackOrder = (orderId) => {
    // Navigate to a tracking page or show tracking details
    console.log(`Tracking order ID: ${orderId}`);
    // You could use React Router for navigation:
    // history.push(`/track-order/${orderId}`);
  };

  return (
    <>
      <CustomNavbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-center mb-4">
          <button
            className={`btn ${selectedTab === 'past' ? 'btn-warning' : 'btn-outline-warning'} me-2`}
            onClick={() => handleTabChange('past')}
          >
            Past Orders
          </button>
          <button
            className={`btn ${selectedTab === 'current' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => handleTabChange('current')}
          >
            Current Orders
          </button>
        </div>

        <div className="row">
          {selectedTab === 'past' ? (
            Object.values(pastOrders).map((order) => (
              <div className="col-12 mb-4" key={order.cartId}>
                <div className="order-card">
                  <h5 className="order-date">Order Date: {new Date(order.orderCreatedAt).toLocaleDateString()}</h5>
                  <div className="order-items">
                    {order.orderedItems.map((item, index) => (
                      <div className="order-item d-flex mb-2" key={index}>
                        <div className="order-item-image">
                          <img src={item.itemImage} alt={item.itemName} className="img-fluid" />
                        </div>
                        <div className="order-item-details ms-3">
                          <h6>{item.itemName}</h6>
                          <p>Price: ${item.itemPrice}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            Object.values(currentOrders).map((order) => (
              <div className="col-12 mb-4" key={order.cartId}>
                <div className="order-card">
                  <h5 className="order-date">Order Date: {new Date(order.orderCreatedAt).toLocaleDateString()}</h5>
                  <div className="order-items">
                    {order.orderedItems.map((item, index) => (
                      <div className="order-item d-flex mb-2" key={index}>
                        <div className="order-item-image">
                          <img src={item.itemImage} alt={item.itemName} className="img-fluid" />
                        </div>
                        <div className="order-item-details ms-3">
                          <h6>{item.itemName}</h6>
                          <p>Price: ${item.itemPrice}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* <button
                    className="btn btn-primary mt-3"
                    onClick={() => handleTrackOrder(order.orderId)}
                  >
                    Track My Order
                  </button> */}
                  <Button variant='warning' onClick={()=>
            navigate(`/order-tracking/${order.orderId}`)
           }>Track my order</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default OrdersPage;
