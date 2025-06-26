import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaTrash } from 'react-icons/fa';
import '../styles/Wishlist.css';
import { GeneralContext } from '../context/GeneralContext';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GeneralContext);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('http://localhost:6001/api/wishlist', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWishlistItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`http://localhost:6001/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWishlistItems(wishlistItems.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const moveToCart = async (productId) => {
    try {
      await axios.post('http://localhost:6001/api/cart', {
        productId,
        quantity: 1
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      await removeFromWishlist(productId);
    } catch (error) {
      console.error('Error moving to cart:', error);
    }
  };

  if (loading) {
    return <div className="wishlist-loading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="wishlist-login-prompt">
        <h2>Please login to view your wishlist</h2>
        <Link to="/login" className="login-button">Login</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2>My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <FaHeart className="empty-heart-icon" />
          <p>Your wishlist is empty</p>
          <Link to="/products" className="shop-now-button">Shop Now</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-item">
              <img src={item.mainImg} alt={item.title} />
              <div className="item-details">
                <h3>{item.title}</h3>
                <p className="price">${item.price}</p>
                {item.discount > 0 && (
                  <p className="discounted-price">
                    ${(item.price * (1 - item.discount / 100)).toFixed(2)}
                  </p>
                )}
                <div className="item-actions">
                  <button 
                    onClick={() => moveToCart(item._id)}
                    className="move-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => removeFromWishlist(item._id)}
                    className="remove-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 