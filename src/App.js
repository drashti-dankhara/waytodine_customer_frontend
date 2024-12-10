import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.js';
import RestaurantDetails from './pages/RestaurantDetails.js';
// import CategoryProducts from './pages/CategoryProducts'; // Create this component
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductByCategory from './pages/ProductByCategory.js';
import SearchProducts from './pages/SearchProducts.js';
import CartPage from './pages/CartPage.js';
import MapWithSearch from './pages/MapWithSearch.js';
import Registration from './pages/Registration.js';
import Login from './pages/Login.js';
import ProfilePage from './pages/ProfilePage.js';
import HelpSupport from './pages/HelpSupport.js';
import PaymentSuccess from './pages/PaymentSuccess.js';
import OrderTracking from './pages/OrderTracking.js';
import OrdersPage from './pages/OrdersPage.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/restaurant-details/:id" element={<RestaurantDetails />} />
          <Route path="/product-by-category/:category" element={<ProductByCategory />} />
          <Route path="/search-products" element={<SearchProducts />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/map" element={<MapWithSearch />} />
          <Route path="/payment/success/:orderId"  element={<PaymentSuccess />}  />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="/your-orders" element={<OrdersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
