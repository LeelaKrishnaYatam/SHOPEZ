import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { GeneralContext } from '../context/GeneralContext';
import '../styles/CompareProducts.css';

const CompareProducts = () => {
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(GeneralContext);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('compareProducts') || '[]');
    if (storedProducts.length > 0) {
      fetchProductDetails(storedProducts);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProductDetails = async (productIds) => {
    try {
      const promises = productIds.map(id =>
        axios.get(`http://localhost:6001/products/${id}`)
      );
      const responses = await Promise.all(promises);
      setCompareList(responses.map(res => res.data));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setLoading(false);
    }
  };

  const removeFromCompare = (productId) => {
    const updatedList = compareList.filter(product => product._id !== productId);
    setCompareList(updatedList);
    localStorage.setItem('compareProducts', JSON.stringify(updatedList.map(p => p._id)));
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
      // Show success message
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div className="compare-loading">Loading...</div>;
  }

  if (compareList.length === 0) {
    return (
      <div className="compare-empty">
        <h2>No Products to Compare</h2>
        <p>Add products to compare them side by side</p>
        <Link to="/products" className="browse-products-btn">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="compare-container">
      <h2>Compare Products</h2>
      <div className="compare-table">
        <div className="compare-row header">
          <div className="compare-cell">Product</div>
          {compareList.map(product => (
            <div key={product._id} className="compare-cell product-header">
              <button 
                onClick={() => removeFromCompare(product._id)}
                className="remove-btn"
              >
                <FaTrash />
              </button>
              <img src={product.mainImg} alt={product.title} />
              <h3>{product.title}</h3>
              <div className="price-container">
                {product.discount > 0 ? (
                  <>
                    <span className="original-price">${product.price}</span>
                    <span className="sale-price">
                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="price">${product.price}</span>
                )}
              </div>
              <button 
                onClick={() => addToCart(product._id)}
                className="add-to-cart-btn"
              >
                <FaShoppingCart /> Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell">Brand</div>
          {compareList.map(product => (
            <div key={product._id} className="compare-cell">
              {product.brand}
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell">Category</div>
          {compareList.map(product => (
            <div key={product._id} className="compare-cell">
              {product.category}
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell">Stock</div>
          {compareList.map(product => (
            <div key={product._id} className="compare-cell">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell">Description</div>
          {compareList.map(product => (
            <div key={product._id} className="compare-cell description">
              {product.description}
            </div>
          ))}
        </div>

        <div className="compare-row">
          <div className="compare-cell">Features</div>
          {compareList.map(product => (
            <div key={product._id} className="compare-cell">
              <ul>
                {product.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareProducts; 