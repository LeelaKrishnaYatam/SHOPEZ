import React, { useContext, useEffect, useState } from 'react'
import '../../styles/IndividualProduct.css'
import {HiOutlineArrowSmLeft} from 'react-icons/hi'
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../../context/GeneralContext';
import ReviewForm from '../../components/ReviewForm';
import ReviewList from '../../components/ReviewList';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import Rating from '../../components/Rating';

const IndividualProduct = () => {

const {id} = useParams();
const navigate = useNavigate()

const userId = localStorage.getItem('userId');

const {fetchCartCount, isAuthenticated} = useContext(GeneralContext);

const [product, setProduct] = useState(null);
const [selectedSize, setSelectedSize] = useState('');
const [quantity, setQuantity] = useState(1);
const [loading, setLoading] = useState(true);

const [productName, setProductName] = useState('');
const [productDescription, setProductDescription] = useState('');
const [productMainImg, setProductMainImg] = useState('');
const [productCarouselImg1, setProductCarouselImg1] = useState('');
const [productCarouselImg2, setProductCarouselImg2] = useState('');
const [productCarouselImg3, setProductCarouselImg3] = useState('');
const [productSizes, setProductSizes] = useState([]);
const [productPrice, setProductPrice] = useState(0);
const [productDiscount, setProductDiscount] = useState(0);
const [averageRating, setAverageRating] = useState(0);
const [reviews, setReviews] = useState([]);

useEffect(()=>{
    fetchProduct();
    fetchReviews();
},[])

const fetchProduct = async () =>{
    try {
        const response = await axios.get(`http://localhost:6001/products/${id}`);
        setProduct(response.data);
        setLoading(false);
        setProductName(response.data.title);
        setProductDescription(response.data.description);
        setProductMainImg(response.data.mainImg);
        setProductCarouselImg1(response.data.carousel[0]);
        setProductCarouselImg2(response.data.carousel[1]);
        setProductCarouselImg3(response.data.carousel[2]);
        setProductSizes(response.data.sizes);
        setProductPrice(response.data.price);
        setProductDiscount(response.data.discount);
        setAverageRating(response.data.averageRating);
    } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
    }
}

const fetchReviews = async () => {
    try {
        const response = await axios.get(`http://localhost:6001/products/${id}/reviews`);
        setReviews(response.data);
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
};

const handleReviewSubmitted = () => {
    fetchReviews();
    fetchProduct(); // To update average rating
};

const [size, setSize] = useState('');
const [name, setName] = useState('');
const [mobile, setMobile] = useState('');
const [email, setEmail] = useState('');
const [address, setAddress] = useState('');
const [pincode, setPincode] = useState('');
const [paymentMethod, setPaymentMethod] = useState('');

const buyNow = async() =>{
    await axios.post('http://localhost:6001/buy-product',{userId, name, email, mobile, address, pincode, title: productName, description: productDescription, mainImg: productMainImg, size, quantity: quantity, price: productPrice, discount: productDiscount, paymentMethod: paymentMethod, orderDate: new Date()}).then(
        (response)=>{
            alert('Order placed!!');
            navigate('/profile');
        }
    ).catch((err)=>{
        alert("Order failed!!");
    })
}

const handleAddToCart = async () => {
    if (!isAuthenticated) {
        alert('Please login to add items to cart');
        return;
    }

    if (!selectedSize) {
        alert('Please select a size');
        return;
    }

    try {
        await axios.post('http://localhost:6001/add-to-cart', {
            productId: product._id,
            title: product.title,
            description: product.description,
            mainImg: product.mainImg,
            size: selectedSize,
            quantity,
            price: product.price,
            discount: product.discount
        });
        alert('Added to cart successfully!');
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add to cart');
    }
};

const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
        alert('Please login to add items to wishlist');
        return;
    }

    try {
        await axios.post('http://localhost:6001/add-to-wishlist', {
            productId: product._id
        });
        alert('Added to wishlist successfully!');
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        alert('Failed to add to wishlist');
    }
};

if (loading) {
    return <div className="loading">Loading...</div>;
}

if (!product) {
    return <div className="error">Product not found</div>;
}

  return (
    <div className="IndividualProduct-page">
        <span onClick={()=> navigate('')}> <HiOutlineArrowSmLeft /> <p>back</p></span>

        <div className="IndividualProduct-body">
            <div className="product-grid">
                <div className="product-images">
                    <Carousel showThumbs={true} infiniteLoop={true}>
                        <div>
                            <img src={productMainImg} alt={productName} />
                        </div>
                        {product.carousel?.map((img, index) => (
                            <div key={index}>
                                <img src={img} alt={`${productName} ${index + 1}`} />
                            </div>
                        ))}
                    </Carousel>
                </div>

                <div className="product-info">
                    <h1>{productName}</h1>
                    
                    <div className="product-meta">
                        <Rating value={averageRating} text={`${reviews.length} reviews`} />
                        <span className="category">{product.category}</span>
                    </div>

                    <div className="product-price">
                        {product.discount > 0 ? (
                            <>
                                <span className="original-price">${product.price}</span>
                                <span className="discounted-price">
                                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                                </span>
                                <span className="discount-badge">-{product.discount}%</span>
                            </>
                        ) : (
                            <span className="price">${product.price}</span>
                        )}
                    </div>

                    <p className="description">{productDescription}</p>

                    <div className="size-selection">
                        <h3>Select Size</h3>
                        <div className="size-options">
                            {productSizes.map((sizeObj) => (
                                <button
                                    key={sizeObj.size}
                                    className={`size-btn ${selectedSize === sizeObj.size ? 'selected' : ''} ${sizeObj.stock === 0 ? 'out-of-stock' : ''}`}
                                    onClick={() => setSelectedSize(sizeObj.size)}
                                    disabled={sizeObj.stock === 0}
                                >
                                    {sizeObj.size}
                                    {sizeObj.stock === 0 && <span className="out-of-stock-label">Out of Stock</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="quantity-selector">
                        <h3>Quantity</h3>
                        <div className="quantity-controls">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>
                    </div>

                    <div className="product-actions">
                        <button className="add-to-cart" onClick={handleAddToCart}>
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button className="add-to-wishlist" onClick={handleAddToWishlist}>
                            <FaHeart /> Add to Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="product-reviews-section">
            <ReviewForm 
                productId={id} 
                onReviewSubmitted={handleReviewSubmitted} 
            />
            <ReviewList 
                reviews={reviews} 
                currentUserId={userId}
                onDeleteReview={handleReviewSubmitted}
            />
        </div>

        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">Checkout</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                
                <div className="checkout-address">

                    <h4>Details</h4>
                    
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput1" value={name} onChange={(e)=>setName(e.target.value)} />
                        <label htmlFor="floatingInput1">Name</label>
                    </div>

                    <section>

                        <div className="form-floating mb-3">
                            <input type='text' className="form-control" id="floatingInput3" value={mobile} onChange={(e)=>setMobile(e.target.value)} />
                            <label htmlFor="floatingInput3">Mobile</label>
                        </div>
                        <div className="form-floating mb-3 span-child-1">
                            <input type='text' className="form-control" id="floatingInput2" value={email} onChange={(e)=>setEmail(e.target.value)} />
                            <label htmlFor="floatingInput2">Email</label>
                        </div>

                    </section>


                    <section>
                        <div className="form-floating mb-3 span-child-1">
                            <input type='text' className="form-control" id="floatingInput6" value={address} onChange={(e)=>setAddress(e.target.value)} />
                            <label htmlFor="floatingInput6">Address</label>
                        </div>

                        <div className="form-floating mb-3 span-child-2">
                            <input type='text' className="form-control" id="floatingInput7" value={pincode} onChange={(e)=>setPincode(e.target.value)} />
                            <label htmlFor="floatingInput7">Pincode</label>
                        </div>
                    </section>


                </div>

                <div className="checkout-payment-method">
                    <h4>Payment method</h4>
                    <div className="form-floating mb-3">
                        <select className="form-select form-select-md mb-3" id="floatingInput8" value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)}>
                        <option value=""></option>
                        <option value="netbanking">netbanking</option>
                        <option value="card">card payments</option>
                        <option value="upi">upi</option>
                        <option value="cod">cash on delivery</option>
                        </select>
                        <label htmlFor="floatingInput8">Choose Payment method</label>
                    </div>
                </div>

                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={buyNow}>Buy now</button>
                </div>
            </div>
            </div>
        </div>



    </div>
  )
}

export default IndividualProduct