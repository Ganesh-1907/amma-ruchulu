import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Alert, Spinner, Form, Row, Col } from 'react-bootstrap';

const TestEmail = () => {
    const API_URL = import.meta.env.VITE_API_URL ;
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState('');
    const [recentOrders, setRecentOrders] = useState([]);
    const [formData, setFormData] = useState({
        items: [
            { name: 'Fresh Pickles Combo Pack', quantity: 2, price: 299 },
            { name: 'Special Mango Pickle', quantity: 1, price: 199 }
        ],
        address: {
            street: '123 Main Street',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001'
        },
        deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deliveryTime: '14:00',
        userEmail: ''
    });

    // Fetch recent orders
    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/orders/recent`);
                setRecentOrders(response.data.orders);
            } catch (err) {
                console.error('Error fetching recent orders:', err);
            }
        };
        fetchRecentOrders();
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const handleAddressChange = (field, value) => {
        setFormData({
            ...formData,
            address: { ...formData.address, [field]: value }
        });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { name: '', quantity: 1, price: 0 }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const testEmail = async () => {
        try {
            setLoading(true);
            setError(null);
            setResult(null);

            const response = await axios.get(`${API_URL}/api/test/test-email`);
            setResult(response.data);
        } catch (err) {
            setError(err.response?.data || { error: 'Failed to test email' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="mt-4">
            <Card.Header>
                <h4>Test Email Functionality</h4>
            </Card.Header>
            <Card.Body>
                <Form>
                    <h5>Order Items</h5>
                    {formData.items.map((item, index) => (
                        <Row key={index} className="mb-3">
                            <Col md={4}>
                                <Form.Control
                                    type="text"
                                    placeholder="Item name"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Control
                                    type="number"
                                    placeholder="Quantity"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                />
                            </Col>
                            <Col md={2}>
                                <Form.Control
                                    type="number"
                                    placeholder="Price"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', parseInt(e.target.value))}
                                />
                            </Col>
                            <Col md={2}>
                                <Button 
                                    variant="danger" 
                                    onClick={() => removeItem(index)}
                                    disabled={formData.items.length === 1}
                                >
                                    Remove
                                </Button>
                            </Col>
                        </Row>
                    ))}
                    <Button variant="secondary" onClick={addItem} className="mb-3">
                        Add Item
                    </Button>

                    <h5>Delivery Address</h5>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Street"
                                value={formData.address.street}
                                onChange={(e) => handleAddressChange('street', e.target.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={formData.address.city}
                                onChange={(e) => handleAddressChange('city', e.target.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="text"
                                placeholder="State"
                                value={formData.address.state}
                                onChange={(e) => handleAddressChange('state', e.target.value)}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={3}>
                            <Form.Control
                                type="text"
                                placeholder="PIN Code"
                                value={formData.address.pincode}
                                onChange={(e) => handleAddressChange('pincode', e.target.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="date"
                                value={formData.deliveryDate}
                                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="time"
                                value={formData.deliveryTime}
                                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="email"
                                placeholder="User Email"
                                value={formData.userEmail}
                                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                            />
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Select Order (Optional)</Form.Label>
                        <Form.Select
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        >
                            <option value="">Latest Order</option>
                            {recentOrders.map(order => (
                                <option key={order._id} value={order._id}>
                                    Order #{order._id} - {new Date(order.createdAt).toLocaleDateString()} - ₹{order.totalAmount}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Leave empty to test with the latest order
                        </Form.Text>
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        onClick={testEmail} 
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Testing Email...
                            </>
                        ) : (
                            'Test Email Sending'
                        )}
                    </Button>
                </Form>

                {error && (
                    <Alert variant="danger" className="mt-3">
                        <Alert.Heading>Error</Alert.Heading>
                        <p>{error.error}</p>
                        {error.details && (
                            <pre className="mt-2">
                                {JSON.stringify(error.details, null, 2)}
                            </pre>
                        )}
                    </Alert>
                )}

                {result && (
                    <Alert variant="success" className="mt-3">
                        <Alert.Heading>Success!</Alert.Heading>
                        <p>{result.message}</p>
                        <hr />
                        <div className="mb-0">
                            <h5>Order Details:</h5>
                            <p><strong>Order ID:</strong> {result.orderDetails.orderId}</p>
                            <p><strong>User Email:</strong> {result.orderDetails.userEmail}</p>
                            <p><strong>Total Amount:</strong> ₹{result.orderDetails.totalAmount}</p>
                            <p><strong>Items:</strong></p>
                            <ul>
                                {result.orderDetails.items.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - Quantity: {item.quantity} - Price: ₹{item.price}
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Delivery Address:</strong></p>
                            <address>
                                {result.orderDetails.address.street}<br />
                                {result.orderDetails.address.city}, {result.orderDetails.address.state}<br />
                                PIN: {result.orderDetails.address.pincode}
                            </address>
                            <p>
                                <strong>Delivery Date:</strong>{' '}
                                {new Date(result.orderDetails.deliveryDate).toLocaleDateString()}
                            </p>
                            <p><strong>Delivery Time:</strong> {result.orderDetails.deliveryTime}</p>
                        </div>
                    </Alert>
                )}
            </Card.Body>
        </Card>
    );
};

export default TestEmail; 