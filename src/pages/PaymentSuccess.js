import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CUSTOMER_BACKEND_URL, REACT_APP_GOOGLE_MAPS_API_KEY } from '../constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import { Button } from 'react-bootstrap';

function PaymentSuccess() {
    const { orderId } = useParams();
    const navigate = useNavigate();
  
    const [loading, setLoading] = useState(true);
 
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            toast.error('Please log in to add items to the cart.');
            setTimeout(() => navigate("/login"), 1500);
        }
    }, [token, navigate]);

    const updateOrderStatus = async (orderId) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${CUSTOMER_BACKEND_URL}/order/update-order-status/${orderId}?newStatus=2`,
                null,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            console.log('Order status updated successfully:', response.data);
            toast.success('Payment successful! Your order status has been updated.');
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Error updating order status.');
        } finally {
            setLoading(false);
        }
    };

    
    // Removed the fetchDriverLocation API call for using dummy data
    useEffect(() => {
        if (orderId) {
            updateOrderStatus(orderId);
        }
    }, [orderId]);

   

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Navbar />
            <h1>Payment Successful</h1>
            <p>Thank you for your payment. Your order has been processed successfully.</p>

           
           <Button variant='warning' onClick={()=>
            navigate(`/order-tracking/${orderId}`)
           }>Track your order</Button>


<ToastContainer />

        </div>
    );
}

export default PaymentSuccess;
