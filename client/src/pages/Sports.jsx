import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sportsImg from '../images/categories/sports.jpg';
import Products from '../components/Products';
import Footer from '../components/Footer';
import '../styles/CategoryLanding.css';

const Sports = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="category-landing sports-landing">
      <div className="category-banner" style={{backgroundImage: `url(${sportsImg})`}}>
        <div className="category-banner-content">
          <h1>Sports</h1>
          <p>Gear up for action! Sportswear, equipment, and accessories for all athletes.</p>
          <Link to="/all-products" className="shop-now-btn">Shop All Sports</Link>
        </div>
      </div>
      <div className="category-featured-section">
        <h2>Featured Sports</h2>
        {loading ? <div className="loading">Loading...</div> : <Products category="Sports" featured={true} />}
      </div>
      <Footer />
    </div>
  );
};

export default Sports; 