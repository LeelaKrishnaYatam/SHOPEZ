import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import fashionImg from '../images/categories/fashion.jpg';
import Products from '../components/Products';
import Footer from '../components/Footer';
import '../styles/CategoryLanding.css';

const Fashion = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="category-landing fashion-landing">
      <div className="category-banner" style={{backgroundImage: `url(${fashionImg})`}}>
        <div className="category-banner-content">
          <h1>Fashion</h1>
          <p>Trendy styles, top brands, and the latest collections for everyone!</p>
          <Link to="/all-products" className="shop-now-btn">Shop All Fashion</Link>
        </div>
      </div>
      <div className="category-featured-section">
        <h2>Featured Fashion</h2>
        {loading ? <div className="loading">Loading...</div> : <Products category="Fashion" featured={true} />}
      </div>
      <Footer />
    </div>
  );
};

export default Fashion; 