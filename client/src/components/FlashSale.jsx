import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import CountdownTimer from './CountdownTimer';
import '../styles/FlashSale.css';

const FlashSale = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [endTime] = useState(() => {
    // Set end time to 24 hours from now
    const end = new Date();
    end.setHours(end.getHours() + 24);
    return end;
  });

  useEffect(() => {
    fetchFlashSaleProducts();
  }, []);

  const fetchFlashSaleProducts = async () => {
    try {
      const response = await axios.get('http://localhost:6001/products?flashSale=true');
      setFlashSaleProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching flash sale products:', error);
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      await axios.post('http://localhost:6001/api/wishlist', {
        productId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Show success message or update UI
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post('http://localhost:6001/api/cart', {
        productId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Show success message or update UI
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div className="flash-sale-loading">Loading...</div>;
  }

  return (
    <div className="flash-sale-container">
      <div className="flash-sale-header">
        <h2>Flash Sale</h2>
        <div className="timer-container">
          <span>Ends in:</span>
          <CountdownTimer endTime={endTime} />
        </div>
      </div>

      <div className="flash-sale-grid">
        {flashSaleProducts.map((product) => (
          <div key={product._id} className="flash-sale-card">
            <div className="discount-badge">-{product.discount}%</div>
            <Link to={`/product/${product._id}`} className="product-link">
              <img src={product.mainImg} alt={product.title} />
            </Link>
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
              <div className="card-actions">
                <button 
                  onClick={() => addToCart(product._id)}
                  className="add-to-cart-btn"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button 
                  onClick={() => addToWishlist(product._id)}
                  className="wishlist-btn"
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;