import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import '../css/CartPage.css';
import { CUSTOMER_BACKEND_URL } from "../constants"; // Import the constant

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [restId, setRestId] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    // Fetch cart items from the API
    axios.get(`${CUSTOMER_BACKEND_URL}/cart/get-cart-by-user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (response.data.status) {
          setItems(response.data.data);
          if (response.data.data.length > 0) {
            setRestId(response.data.data[0].restaurantId);
            setDiscountPercent(response.data.data[0].currentOfferDiscountRate);
          }
        } else {
          console.error('Failed to fetch cart items:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
  }, []);

  const deliveryPercent = 5;

  // Increment quantity for a specific item with API call
  const handleIncrement = async (id, cartId) => {
    try {
      setItems(items.map(item =>
        item.itemId === id ? { ...item, quantity: item.quantity + 1 } : item
      ));

      await axios.put(`${CUSTOMER_BACKEND_URL}/cart/update-cart`, {
        cartId: cartId,
        quantity: items.find(item => item.itemId === id).quantity + 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error updating cart item:', error);
      setItems(items.map(item =>
        item.itemId === id ? { ...item, quantity: item.quantity - 1 } : item
      ));
    }
  };

  // Decrement quantity for a specific item with API call
  const handleDecrement = async (id, cartId) => {
    const itemToUpdate = items.find(item => item.itemId === id);

    if (itemToUpdate && itemToUpdate.quantity > 1) {
      try {
        setItems(items.map(item =>
          item.itemId === id ? { ...item, quantity: item.quantity - 1 } : item
        ));

        await axios.put(`${CUSTOMER_BACKEND_URL}/cart/update-cart`, {
          cartId: cartId,
          quantity: itemToUpdate.quantity - 1
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (error) {
        console.error('Error updating cart item:', error);
        setItems(items.map(item =>
          item.itemId === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
    } else {
      console.warn('Quantity cannot be less than 1.');
    }
  };

  // Handle removing an item from the cart
  const handleRemoveItem = async (cartId) => {
    try {
      await axios.delete(`${CUSTOMER_BACKEND_URL}/cart/remove-cart-item/${cartId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setItems(items.filter(item => item.cartId !== cartId));
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  const itemPrice = items.reduce((total, item) => total + item.itemPrice * item.quantity, 0);
  const discount = (itemPrice * discountPercent) / 100;
  const deliveryCharge = (itemPrice * deliveryPercent) / 100;
  const totalAmount = itemPrice - discount + deliveryCharge;

  return (
    <div>
      <Navbar />
      <Container className="cart-page">
        <Row>
          <Col md={8}>
            <h2>Cart</h2>
            {items.length === 0 ? (
              <p>No Cart items found.</p>
            ) : (
              items.map(item => (
                <CartItem
                  key={item.itemId}
                  quantity={item.quantity}
                  handleIncrement={() => handleIncrement(item.itemId, item.cartId)}
                  handleDecrement={() => handleDecrement(item.itemId, item.cartId)}
                  handleRemove={() => handleRemoveItem(item.cartId)}
                  pricePerItem={item.itemPrice}
                  name={item.itemName}
                  description={item.description}
                  image={item.itemImage}
                />
              ))
            )}
          </Col>
          <Col md={4}>
            {items.length > 0 && (
              <>
                <h3>Order Summary</h3>
                <OrderSummary
                  quantity={items.reduce((total, item) => total + item.quantity, 0)}
                  itemPrice={itemPrice}
                  discountPercent={discountPercent}
                  discount={discount}
                  deliveryCharge={deliveryCharge}
                  deliveryPercent={deliveryPercent}
                  totalAmount={totalAmount}
                  restaurantId={restId}
                />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartPage;
