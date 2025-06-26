import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaThList, FaBoxOpen, FaShoppingCart, FaUser, FaClipboardList, FaMobileAlt, FaLaptop, FaTshirt, FaAppleAlt, FaFootballBall } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Sidebar.css';

const Sidebar = () => (
  <div className="sidebar bg-light border-end">
    <div className="sidebar-header p-3 mb-2 border-bottom">
      <h4 className="mb-0">Shop Menu</h4>
    </div>
    <ul className="list-unstyled sidebar-list">
      <li><Link to="/" className="sidebar-link"><FaHome /> Home</Link></li>
      <li><Link to="/all-products" className="sidebar-link"><FaBoxOpen /> All Products</Link></li>
      <li><Link to="/cart" className="sidebar-link"><FaShoppingCart /> Cart</Link></li>
      <li><Link to="/profile" className="sidebar-link"><FaUser /> Profile</Link></li>
      <li><Link to="/orders" className="sidebar-link"><FaClipboardList /> Orders</Link></li>
      <li className="sidebar-section">Categories</li>
      <li><Link to="/electronics" className="sidebar-link"><FaThList /> Electronics</Link></li>
      <li><Link to="/mobiles" className="sidebar-link"><FaMobileAlt /> Mobiles</Link></li>
      <li><Link to="/laptops" className="sidebar-link"><FaLaptop /> Laptops</Link></li>
      <li><Link to="/fashion" className="sidebar-link"><FaTshirt /> Fashion</Link></li>
      <li><Link to="/grocery" className="sidebar-link"><FaAppleAlt /> Grocery</Link></li>
      <li><Link to="/sports" className="sidebar-link"><FaFootballBall /> Sports</Link></li>
    </ul>
  </div>
);

export default Sidebar; 