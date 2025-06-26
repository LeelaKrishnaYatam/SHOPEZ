import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import groceryImg from '../images/categories/grocery.jpg';
import Products from '../components/Products';
import Footer from '../components/Footer';
import '../styles/CategoryLanding.css';

const Grocery = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="category-landing grocery-landing">
      <div className="category-banner" style={{backgroundImage: `url(${groceryImg})`}}>
        <div className="category-banner-content">
          <h1>Grocery</h1>
          <p>Fresh groceries, daily essentials, and best deals delivered to your door!</p>
          <Link to="/all-products" className="shop-now-btn">Shop All Grocery</Link>
        </div>
      </div>
      <div className="category-featured-section">
        <h2>Featured Grocery</h2>
        {loading ? <div className="loading">Loading...</div> : <Products category="Grocery" featured={true} />}
      </div>
      <Footer />
    </div>
  );
};

export default Grocery; 