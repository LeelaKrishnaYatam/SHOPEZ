import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTag, FaFire, FaClock } from 'react-icons/fa';
import CountdownTimer from '../components/CountdownTimer';
import '../styles/Deals.css';

const Deals = () => {
  const [deals, setDeals] = useState({
    flashSale: [],
    clearance: [],
    seasonal: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const [flashSaleRes, clearanceRes, seasonalRes] = await Promise.all([
        axios.get('http://localhost:6001/products?flashSale=true'),
        axios.get('http://localhost:6001/products?discount_gte=50'),
        axios.get('http://localhost:6001/products?seasonal=true')
      ]);

      setDeals({
        flashSale: flashSaleRes.data,
        clearance: clearanceRes.data,
        seasonal: seasonalRes.data
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setLoading(false);
    }
  };

  const calculateTimeLeft = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    return end - now;
  };

  if (loading) {
    return <div className="deals-loading">Loading...</div>;
  }

  return (
    <div className="deals-container">
      <div className="deals-header">
        <h1>Special Deals & Offers</h1>
        <p>Discover amazing discounts and limited-time offers</p>
      </div>

      {/* Flash Sale Section */}
      <section className="deals-section flash-sale">
        <div className="section-header">
          <h2><FaFire /> Flash Sale</h2>
          <div className="timer-container">
            <FaClock />
            <CountdownTimer endTime={new Date().setHours(new Date().getHours() + 24)} />
          </div>
        </div>
        <div className="products-grid">
          {deals.flashSale.map(product => (
            <Link 
              to={`/product/${product._id}`} 
              key={product._id} 
              className="product-card"
            >
              <div className="discount-badge">-{product.discount}%</div>
              <img src={product.mainImg} alt={product.title} />
              <div className="product-info">
                <h3>{product.title}</h3>
                <div className="price-container">
                  <span className="original-price">${product.price}</span>
                  <span className="sale-price">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                </div>
                <div className="stock-info">
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${(product.stock / product.initialStock) * 100}%` }}
                    ></div>
                  </div>
                  <span>{product.stock} items left</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Clearance Section */}
      <section className="deals-section clearance">
        <div className="section-header">
          <h2><FaTag /> Clearance Sale</h2>
          <p>Up to 70% off on selected items</p>
        </div>
        <div className="products-grid">
          {deals.clearance.map(product => (
            <Link 
              to={`/product/${product._id}`} 
              key={product._id} 
              className="product-card"
            >
              <div className="discount-badge">-{product.discount}%</div>
              <img src={product.mainImg} alt={product.title} />
              <div className="product-info">
                <h3>{product.title}</h3>
                <div className="price-container">
                  <span className="original-price">${product.price}</span>
                  <span className="sale-price">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Seasonal Deals Section */}
      <section className="deals-section seasonal">
        <div className="section-header">
          <h2>Seasonal Offers</h2>
          <p>Special deals for the season</p>
        </div>
        <div className="products-grid">
          {deals.seasonal.map(product => (
            <Link 
              to={`/product/${product._id}`} 
              key={product._id} 
              className="product-card"
            >
              <div className="discount-badge">-{product.discount}%</div>
              <img src={product.mainImg} alt={product.title} />
              <div className="product-info">
                <h3>{product.title}</h3>
                <div className="price-container">
                  <span className="original-price">${product.price}</span>
                  <span className="sale-price">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="deals-newsletter">
        <div className="newsletter-content">
          <h2>Get Exclusive Deals</h2>
          <p>Subscribe to our newsletter and never miss out on special offers</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Deals; 