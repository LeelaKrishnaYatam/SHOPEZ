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

const Home = () => {

  const navigate = useNavigate();

  const [bannerImg, setBannerImg] = useState();
  const [products, setProducts] = useState([]);

  const categories = [
    { name: 'Men', img: homeBanner1 },
    { name: 'Women', img: HomeBanner },
    { name: 'Unisex', img: homeBanner1 },
    { name: 'Accessories', img: HomeBanner },
  ];
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
      const res = await axios.get('http://localhost:6001/fetch-products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home-page">
      {/* Hero/Banner Section */}
      <div className="hero-section fade-in" style={{background: `url(${homeBanner1}) center/cover`, height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '2rem'}}>
        <span style={{background: 'rgba(0,0,0,0.4)', padding: '1rem 2rem', borderRadius: '10px'}}>Welcome to ShopEZ - Style for Everyone</span>
      </div>

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

      {/* Category Image Grid */}
      <div className="category-section" style={{padding: '2rem 0', background: '#f7f7f7'}}>
        <h2 style={{textAlign: 'center'}}>Shop by Category</h2>
        <div style={{display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap'}}>
          {categories.map(cat => (
            <div key={cat.name} className="category-card-hover" style={{textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer'}}>
              <img src={cat.img} alt={cat.name} style={{width: '180px', height: '180px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,0,0,0.1)'}} />
              <h4 style={{marginTop: '1rem'}}>{cat.name}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale/Deals Section */}
      <div className="flash-sale-section" style={{padding: '2rem 0'}}>
        <FlashSale />
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

      {/* Newsletter Signup Section */}
      <div className="newsletter-section" style={{padding: '2rem 0', background: '#f7f7f7', textAlign: 'center'}}>
        <h2>Stay in the Loop</h2>
        <p>Sign up for exclusive offers and updates!</p>
        <form style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem'}}>
          <input type="email" placeholder="Your email" style={{padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #ccc', minWidth: '260px'}} />
          <button type="submit" style={{padding: '0.5rem 1.5rem', borderRadius: '6px', background: '#222', color: '#fff', border: 'none'}}>Subscribe</button>
        </form>
      </div>

      {/* Existing product list section */}
      <div className="product-list">
        {products.map(product => (
          <div className="product-card product-card-hover" key={product._id} style={{transition: 'transform 0.2s', cursor: 'pointer'}}>
            <img src={product.mainImg} alt={product.title} style={{width: '200px', height: '200px', objectFit: 'cover'}} />
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            <Link to={`/product/${product._id}`}>View Details</Link>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export default Home