import React, { useEffect, useState } from 'react'
import '../styles/Products.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const Products = (props) => {

const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [filters, setFilters] = useState({ category: '', size: '', gender: '', minPrice: '', maxPrice: '', discount: '' });
    const [sort, setSort] = useState('newest');
    const [wishlist, setWishlist] = useState([]);
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const [showWishlist, setShowWishlist] = useState(false);

    useEffect(()=>{
        fetchData();
      }, [])
    
      const fetchData = async() =>{

        await axios.get('http://localhost:6001/fetch-products').then(
          (response)=>{
            if(props.category === 'all'){
                setProducts(response.data);
                setVisibleProducts(response.data);
                setFiltered(response.data);
            }else{
                setProducts(response.data.filter(product=> product.category === props.category));
                setVisibleProducts(response.data.filter(product=> product.category === props.category));
                setFiltered(response.data.filter(product=> product.category === props.category));
            }
          }
        )
        await axios.get('http://localhost:6001/fetch-categories').then(
          (response)=>{
            setCategories(response.data);
          }
        )
      }

      const handleCategoryCheckBox = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setFilters(f => ({ ...f, category: value }));
        }else{
            setFilters(f => ({ ...f, category: f.category.filter(c => c !== value) }));
        }
      }

      const handleGenderCheckBox = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setFilters(f => ({ ...f, gender: value }));
        }else{
            setFilters(f => ({ ...f, gender: f.gender.filter(g => g !== value) }));
        }
      }

      const handleSizeCheckBox = (e) =>{
        const value = e.target.value;
        if(e.target.checked){
            setFilters(f => ({ ...f, size: value }));
        }else{
            setFilters(f => ({ ...f, size: f.size.filter(s => s !== value) }));
        }
      }

      const handlePriceFilter = (e) =>{
        const value = e.target.value;
        setFilters(f => ({ ...f, minPrice: value ? value : '', maxPrice: value ? value : '' }));
      }

      const handleDiscountFilter = (e) =>{
        const value = e.target.value;
        setFilters(f => ({ ...f, discount: value ? value : '' }));
      }

      const handleSortFilterChange = (e) =>{
        const value = e.target.value;
        setSort(value);
        if(value === 'low-price'){
            setVisibleProducts(visibleProducts.sort((a,b)=>  a.price - b.price))
        } else if (value === 'high-price'){
            setVisibleProducts(visibleProducts.sort((a,b)=>  b.price - a.price))
        }else if (value === 'discount'){
            setVisibleProducts(visibleProducts.sort((a,b)=>  b.discount - a.discount))
        }
      }

      useEffect(()=>{
        let temp = [...products];
        if (filters.category) temp = temp.filter(p => p.category === filters.category);
        if (filters.size) temp = temp.filter(p => p.sizes && p.sizes.includes(filters.size));
        if (filters.gender) temp = temp.filter(p => p.gender === filters.gender);
        if (filters.minPrice) temp = temp.filter(p => p.price >= Number(filters.minPrice));
        if (filters.maxPrice) temp = temp.filter(p => p.price <= Number(filters.maxPrice));
        if (filters.discount) temp = temp.filter(p => p.discount >= Number(filters.discount));
        if (sort === 'price-asc') temp.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') temp.sort((a, b) => b.price - a.price);
        if (sort === 'newest') temp.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFiltered(temp);
      }, [filters, sort, products])

      useEffect(() => {
        if (user) {
          const fetchWishlist = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:6001/wishlist/${user._id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setWishlist(res.data.map(p => p._id));
          };
          fetchWishlist();
        }
      }, [user]);

      const handleWishlist = async (productId) => {
        if (!user) return alert('Login to use wishlist');
        const token = localStorage.getItem('token');
        if (wishlist.includes(productId)) {
          await axios.post('http://localhost:6001/remove-from-wishlist', { userId: user._id, productId }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setWishlist(wishlist.filter(id => id !== productId));
        } else {
          await axios.post('http://localhost:6001/add-to-wishlist', { userId: user._id, productId }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setWishlist([...wishlist, productId]);
        }
      };

      const wishlistProducts = products.filter(p => wishlist.includes(p._id));

  return (
    <div className="products-container">
        <div className="products-filter">
            <h4>Filters</h4>
            <div className="product-filters-body">

                <div className="filter-sort">
                    <h6>Sort By</h6>
                    <div className="filter-sort-body sub-filter-body">

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio1" value="popularity" checked={sort === 'popularity'} onChange={handleSortFilterChange} />
                            <label class="form-check-label" for="filter-sort-radio1" >
                                Popular
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio2" value="low-price" checked={sort === 'low-price'} onChange={handleSortFilterChange} />
                            <label class="form-check-label" for="filter-sort-radio2">
                                Price (low to high)
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio3" value="high-price" checked={sort === 'high-price'} onChange={handleSortFilterChange} />
                            <label class="form-check-label" for="filter-sort-radio3">
                                Price (high to low)
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio4" value="discount" checked={sort === 'discount'} onChange={handleSortFilterChange} />
                            <label class="form-check-label" for="filter-sort-radio4">
                                Discount
                            </label>
                        </div>

                    </div>
                </div>

                {props.category === 'all' ?
                     <div className="filter-categories">
                        <h6>Categories</h6>
                        <div className="filter-categories-body sub-filter-body">
    
                            {categories.map((category)=>{
                                return(
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value={category} id={'productCategory'+ category} checked={filters.category === category} onChange={handleCategoryCheckBox} />
                                        <label class="form-check-label" for={'productCategory'+ category}>
                                            {category}
                                        </label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                 :

                 ""
                }

                
                <div className="filter-gender">
                    <h6>Gender</h6>
                    <div className="filter-gender-body sub-filter-body">
                        
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="Men" id="filter-gender-check-1" checked={filters.gender === 'Men'} onChange={handleGenderCheckBox} />
                            <label class="form-check-label" for="filter-gender-check-1">
                                Men
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="Women" id="filter-gender-check-2" checked={filters.gender === 'Women'} onChange={handleGenderCheckBox} />
                            <label class="form-check-label" for="filter-gender-check-2">
                                Women
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="Unisex" id="filter-gender-check-3" checked={filters.gender === 'Unisex'} onChange={handleGenderCheckBox} />
                            <label class="form-check-label" for="filter-gender-check-3">
                                Unisex
                            </label>
                        </div>

                    </div>
                </div>

                <div className="filter-size">
                    <h6>Size</h6>
                    <div className="filter-size-body sub-filter-body">
                        
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="S" id="filter-size-check-1" checked={filters.size === 'S'} onChange={handleSizeCheckBox} />
                            <label class="form-check-label" for="filter-size-check-1">
                                S
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="M" id="filter-size-check-2" checked={filters.size === 'M'} onChange={handleSizeCheckBox} />
                            <label class="form-check-label" for="filter-size-check-2">
                                M
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="L" id="filter-size-check-3" checked={filters.size === 'L'} onChange={handleSizeCheckBox} />
                            <label class="form-check-label" for="filter-size-check-3">
                                L
                            </label>
                        </div>

                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="XL" id="filter-size-check-4" checked={filters.size === 'XL'} onChange={handleSizeCheckBox} />
                            <label class="form-check-label" for="filter-size-check-4">
                                XL
                            </label>
                        </div>

                    </div>
                </div>

                <div className="filter-price">
                    <h6>Price</h6>
                    <div className="filter-price-body sub-filter-body">
                        <input type="number" placeholder="Min Price" value={filters.minPrice} onChange={handlePriceFilter} />
                        <input type="number" placeholder="Max Price" value={filters.maxPrice} onChange={handlePriceFilter} />
                    </div>
                </div>

                <div className="filter-discount">
                    <h6>Discount</h6>
                    <div className="filter-discount-body sub-filter-body">
                        <input type="number" placeholder="Min Discount %" value={filters.discount} onChange={handleDiscountFilter} />
                    </div>
                </div>

            </div>
        </div>


        <div className="products-body">
            <h3>All Products</h3>
            <div className="products">

                <button onClick={() => setShowWishlist(!showWishlist)} style={{marginBottom: '1rem'}}>
                    {showWishlist ? 'Show All Products' : 'My Wishlist'}
                </button>

                <div className="product-list">
                    {(showWishlist ? wishlistProducts : filtered).map(product => (
                        <div className="product-card product-card-hover" key={product._id} style={{transition: 'transform 0.2s', cursor: 'pointer', position: 'relative'}}>
                            <span onClick={() => handleWishlist(product._id)} style={{position: 'absolute', top: 10, right: 10, fontSize: '1.5rem', color: wishlist.includes(product._id) ? '#e53935' : '#aaa', cursor: 'pointer'}}>
                                {wishlist.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
                            </span>
                            <img src={product.mainImg} alt={product.title} style={{width: '200px', height: '200px', objectFit: 'cover'}} />
                            <h3>{product.title}</h3>
                            <p>Price: ${product.price}</p>
                            <p style={{color: '#e53935'}}>{product.discount ? `-${product.discount}%` : ''}</p>
                            <p style={{fontSize: '0.9rem', color: '#888'}}>{product.gender}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    </div>
  )
}

export default Products