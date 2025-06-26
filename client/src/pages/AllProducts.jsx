import React, { useEffect, useState } from 'react';
import Products from '../components/Products';
import Footer from '../components/Footer';
import '../styles/AllProducts.css';
import axios from 'axios';

const AllProducts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('popularity');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:6001/categories');
      setCategories(res.data);
    } catch (err) {
      setCategories([]);
    }
  };

  return (
    <div className="all-products-page">
      <div className="all-products-header">
        <h1>All Products</h1>
        <p>Browse our complete collection and find your favorites</p>
      </div>
      <div className="all-products-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat.name || cat}>{cat.name || cat}</option>
          ))}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="popularity">Popularity</option>
          <option value="low-price">Price: Low to High</option>
          <option value="high-price">Price: High to Low</option>
          <option value="discount">Discount</option>
        </select>
      </div>
      <Products category={selectedCategory} search={search} sort={sort} />
      <Footer />
    </div>
  );
};

export default AllProducts; 