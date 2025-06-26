import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import laptopsImg from '../images/categories/laptops.jpg';
import Products from '../components/Products';
import Footer from '../components/Footer';
import '../styles/CategoryLanding.css';

const Laptops = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="category-landing laptops-landing">
      <div className="category-banner" style={{backgroundImage: `url(${laptopsImg})`}}>
        <div className="category-banner-content">
          <h1>Laptops</h1>
          <p>Find the perfect laptop for work, play, or study. Top brands, best prices!</p>
          <Link to="/all-products" className="shop-now-btn">Shop All Laptops</Link>
        </div>
      </div>
      <div className="category-featured-section">
        <h2>Featured Laptops</h2>
        {loading ? <div className="loading">Loading...</div> : <Products category="Laptops" featured={true} />}
      </div>
      <Footer />
    </div>
  );
};

export default Laptops; 