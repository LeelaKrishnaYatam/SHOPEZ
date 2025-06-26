import React, { useEffect, useState } from 'react'
import '../styles/Home.css'
import HomeBanner from '../images/home-banner-2.png'
import Products from '../components/Products'
import Footer from '../components/Footer'
import FlashSale from '../components/FlashSale'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import homeBanner1 from '../images/home-banner1.png';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaShippingFast, FaLock, FaHeadset, FaUndo } from 'react-icons/fa';

// Import images
import hero1 from '../images/hero1.jpg';
import hero2 from '../images/hero2.jpg';
import newsletterBg from '../images/newsletter-bg.jpg';
import electronicsImg from '../images/categories/electronics.jpg';
import mobilesImg from '../images/categories/mobiles.jpg';
import laptopsImg from '../images/categories/laptops.jpg';
import fashionImg from '../images/categories/fashion.jpg';
import groceryImg from '../images/categories/grocery.jpg';
import sportsImg from '../images/categories/sports.jpg';

const Home = () => {

  const navigate = useNavigate();

  const [bannerImg, setBannerImg] = useState();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const galleryImages = [
    homeBanner1,
    HomeBanner,
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  ];

  const brandLogos = [
    'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Adidas_Logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/0/0e/Puma_logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/5/53/Under_armour_logo.svg',
  ];
  const testimonials = [
    { name: 'Alice', text: 'Amazing products and fast delivery!', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Bob', text: 'Great customer service and quality.', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Priya', text: 'Love the variety and deals!', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
  ];

  const categoryImages = {
    Electronics: electronicsImg,
    Mobiles: mobilesImg,
    Laptops: laptopsImg,
    Fashion: fashionImg,
    Grocery: groceryImg,
    Sports: sportsImg,
  };

  useEffect(()=>{
    fetchBanner();
    fetchProducts();
  }, [])

  const fetchBanner = async() =>{
    await axios.get('http://localhost:6001/fetch-banner').then(
      (response)=>{
        setBannerImg(response.data);
      }
    )
  }

  const fetchProducts = async () => {
    try {
      const [productsRes, categoriesRes, flashSaleRes] = await Promise.all([
        axios.get('http://localhost:6001/products?featured=true'),
        axios.get('http://localhost:6001/categories'),
        axios.get('http://localhost:6001/products?flashSale=true')
      ]);

      setFeaturedProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setFlashSaleProducts(flashSaleRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const heroSlides = [
    {
      image: hero1,
      title: 'Summer Collection 2024',
      subtitle: 'New Arrivals',
      cta: 'Shop Now'
    },
    {
      image: hero2,
      title: 'Winter Essentials',
      subtitle: 'Stay Warm in Style',
      cta: 'Explore'
    }
  ];

  // Placeholder image for development
  const placeholderImage = 'https://via.placeholder.com/300x400';

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Carousel
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={5000}
          showStatus={false}
        >
          {heroSlides.map((slide, index) => (
            <div key={index} className="hero-slide">
              <img src={slide.image} alt={slide.title} />
              <div className="hero-content">
                <h2>{slide.subtitle}</h2>
                <h1>{slide.title}</h1>
                <Link to="/products" className="cta-button">
                  {slide.cta}
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature">
          <FaShippingFast className="feature-icon" />
          <h3>Free Shipping</h3>
          <p>On orders over $50</p>
        </div>
        <div className="feature">
          <FaLock className="feature-icon" />
          <h3>Secure Payment</h3>
          <p>100% secure payment</p>
        </div>
        <div className="feature">
          <FaHeadset className="feature-icon" />
          <h3>24/7 Support</h3>
          <p>Dedicated support</p>
        </div>
        <div className="feature">
          <FaUndo className="feature-icon" />
          <h3>Easy Returns</h3>
          <p>14 day returns</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <Link 
              to={`/category/${category.name}`} 
              key={index} 
              className="category-card"
            >
              <img src={categoryImages[category.name] || placeholderImage} alt={category.name} />
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="flash-sale-section">
        <div className="section-header">
          <h2>Flash Sale</h2>
          <div className="countdown">
            {/* Add countdown timer component here */}
          </div>
        </div>
        <div className="products-grid">
          {flashSaleProducts.map((product) => (
            <Link 
              to={`/product/${product._id}`} 
              key={product._id} 
              className="product-card"
            >
              <div className="discount-badge">-{product.discount}%</div>
              <img src={product.mainImg || placeholderImage} alt={product.title} />
              <h3>{product.title}</h3>
              <div className="price">
                <span className="original-price">${product.price}</span>
                <span className="discounted-price">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <Link 
              to={`/product/${product._id}`} 
              key={product._id} 
              className="product-card"
            >
              <img src={product.mainImg || placeholderImage} alt={product.title} />
              <h3>{product.title}</h3>
              <p className="price">${product.price}</p>
              <div className="rating">
                {/* Add rating component here */}
                <span>({product.reviewCount} reviews)</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${newsletterBg})`}}>
        <div className="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest updates on new products and upcoming sales</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Brand Logos Section */}
      <div className="brand-logos" style={{display: 'flex', justifyContent: 'center', gap: '3rem', margin: '2rem 0'}}>
        {brandLogos.map((logo, idx) => (
          <img key={idx} src={logo} alt="Brand" style={{height: '40px', filter: 'grayscale(1)', opacity: 0.7}} />
        ))}
      </div>

      {/* Featured Products Carousel */}
      <div className="featured-carousel" style={{maxWidth: '900px', margin: '0 auto 2rem auto'}}>
        <h2 style={{textAlign: 'center'}}>Featured Products</h2>
        <Carousel showThumbs={false} autoPlay infiniteLoop showStatus={false}>
          {products.slice(0, 6).map(product => (
            <div key={product._id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <img src={product.mainImg} alt={product.title} style={{height: '300px', objectFit: 'cover', borderRadius: '10px'}} />
              <h3>{product.title}</h3>
              <p>Price: ${product.price}</p>
              <Link to={`/product/${product._id}`}>View Details</Link>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Image Gallery/Lookbook */}
      <div className="gallery-section" style={{padding: '2rem 0', background: '#f7f7f7'}}>
        <h2 style={{textAlign: 'center'}}>Lookbook</h2>
        <div style={{display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap'}}>
          {galleryImages.map((img, idx) => (
            <img key={idx} src={img} alt={`Gallery ${idx}`} style={{width: '220px', height: '220px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}} />
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section" style={{padding: '2rem 0'}}>
        <h2 style={{textAlign: 'center'}}>What Our Customers Say</h2>
        <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap'}}>
          {testimonials.map((t, idx) => (
            <div key={idx} style={{background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1.5rem', maxWidth: '320px', textAlign: 'center'}}>
              <img src={t.img} alt={t.name} style={{width: '60px', height: '60px', borderRadius: '50%', marginBottom: '1rem'}} />
              <p style={{fontStyle: 'italic'}}>{t.text}</p>
              <h5 style={{marginTop: '1rem'}}>{t.name}</h5>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home