import React from 'react';
import { Row, Col, Button, Image, Card } from 'react-bootstrap';

const CartItem = ({ quantity, handleIncrement, handleDecrement,handleRemove, pricePerItem, name, description, image }) => {
    return (
        <Card className="cart-item mb-3">
            <Row className="align-items-center">
                <Col md={2} className="d-flex justify-content-center">
                    <Image
                        src={image}
                        alt={name}
                        className="cart-item-image"
                        fluid
                    />
                </Col>

                <Col md={10}>
                    <h3>{name}</h3>
                    <p>{description}</p>
                    <div className="cart-item-controls d-flex justify-content-between align-items-center">
                        <div className="cart-item-quantity">
                            <Button variant="outline-warning" onClick={handleDecrement}>
                                -
                            </Button>
                            <span className="mx-2">{quantity}</span>
                            <Button variant="outline-warning" onClick={handleIncrement}>
                                +
                            </Button>
                        </div>
                        <Button variant="outline-danger" onClick={handleRemove} className='me-3'>Remove</Button>
                    </div>
                    <div className="cart-item-price">
                        ₹{pricePerItem * quantity} ({pricePerItem} × {quantity})
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default CartItem;
