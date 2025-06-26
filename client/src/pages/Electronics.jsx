import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import electronicsImg from '../images/categories/electronics.jpg';
import Products from '../components/Products';
import Footer from '../components/Footer';
import '../styles/CategoryLanding.css';

const Electronics = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch('http://localhost:6001/products?category=Electronics&featured=true');
      const data = await res.json();
      setFeatured(data);
      setLoading(false);
    } catch (err) {
      setFeatured([]);
      setLoading(false);
    }
  };

  return (
    <div className="category-landing electronics-landing">
      <div className="category-banner" style={{backgroundImage: `url(${electronicsImg})`}}>
        <div className="category-banner-content">
          <h1>Electronics</h1>
          <p>Discover the latest and greatest in tech, gadgets, and more!</p>
          <Link to="/all-products" className="shop-now-btn">Shop All Electronics</Link>
        </div>
      </div>
      <div className="category-featured-section">
        <h2>Featured Electronics</h2>
        {loading ? <div className="loading">Loading...</div> : <Products category="Electronics" featured={true} />}
      </div>
      <Footer />
    </div>
  );
};

export default Electronics; 