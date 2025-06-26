import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import mobilesImg from '../images/categories/mobiles.jpg';
import Products from '../components/Products';
import Footer from '../components/Footer';
import '../styles/CategoryLanding.css';

const Mobiles = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="category-landing mobiles-landing">
      <div className="category-banner" style={{backgroundImage: `url(${mobilesImg})`}}>
        <div className="category-banner-content">
          <h1>Mobiles</h1>
          <p>Latest smartphones, best deals, and top brands in one place!</p>
          <Link to="/all-products" className="shop-now-btn">Shop All Mobiles</Link>
        </div>
      </div>
      <div className="category-featured-section">
        <h2>Featured Mobiles</h2>
        {loading ? <div className="loading">Loading...</div> : <Products category="Mobiles" featured={true} />}
      </div>
      <Footer />
    </div>
  );
};

export default Mobiles; 