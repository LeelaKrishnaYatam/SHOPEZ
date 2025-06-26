import React, { useEffect, useState } from 'react'
import '../styles/Products.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';

const Products = (props) => {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [visibleProducts, setVisibleProducts] = useState([]);
    const [filters, setFilters] = useState({ category: '', size: '', gender: '', minPrice: '', maxPrice: '', discount: '', brand: '' });
    const [sort, setSort] = useState('newest');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const electronicsDemoProducts = [
        {
            _id: 'demo1',
            title: 'Samsung Galaxy S23',
            description: 'Flagship smartphone with AMOLED display',
            mainImg: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
            price: 74999,
            discount: 10,
            category: 'Electronics',
            rating: 4.6
        },
        {
            _id: 'demo2',
            title: 'Sony WH-1000XM5',
            description: 'Industry-leading noise cancelling headphones',
            mainImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
            price: 29999,
            discount: 15,
            category: 'Electronics',
            rating: 4.7
        },
        {
            _id: 'demo3',
            title: 'Apple iPad Air',
            description: 'Lightweight and powerful tablet',
            mainImg: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-air-select-wifi-starlight-202203?wid=470&hei=556&fmt=png-alpha&.v=1645066509368',
            price: 59999,
            discount: 5,
            category: 'Electronics',
            rating: 4.5
        },
        {
            _id: 'demo4',
            title: 'Canon EOS 1500D',
            description: 'DSLR Camera with 24.1 MP CMOS sensor',
            mainImg: 'https://m.media-amazon.com/images/I/914hFeTU2-L._SL1500_.jpg',
            price: 42999,
            discount: 12,
            category: 'Electronics',
            rating: 4.4
        },
        {
            _id: 'demo6',
            title: 'boAt Airdopes 441',
            description: 'True Wireless Earbuds with IWP Technology',
            mainImg: 'https://m.media-amazon.com/images/I/61u1VALn6JL._SL1500_.jpg',
            price: 1999,
            discount: 20,
            category: 'Electronics',
            rating: 4.3
        },
        {
            _id: 'demo7',
            title: 'Mi Smart Band 6',
            description: 'Fitness band with AMOLED display',
            mainImg: 'https://m.media-amazon.com/images/I/61bK6PMOC3L._SL1500_.jpg',
            price: 3499,
            discount: 18,
            category: 'Electronics',
            rating: 4.2
        },
        {
            _id: 'demo8',
            title: 'HP DeskJet 2331',
            description: 'All-in-One Inkjet Colour Printer',
            mainImg: 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._SL1500_.jpg',
            price: 3999,
            discount: 10,
            category: 'Electronics',
            rating: 4.1
        },
        {
            _id: 'demo9',
            title: 'Fire TV Stick 4K',
            description: 'Streaming device with Alexa Voice Remote',
            mainImg: 'https://m.media-amazon.com/images/I/51CgKGfMelL._SL1000_.jpg',
            price: 4999,
            discount: 15,
            category: 'Electronics',
            rating: 4.6
        },
        {
            _id: 'demo10',
            title: 'OnePlus 11R 5G',
            description: 'Premium 5G smartphone with Snapdragon 8+ Gen 1',
            mainImg: 'https://m.media-amazon.com/images/I/71qGismu6NL._SL1500_.jpg',
            price: 39999,
            discount: 7,
            category: 'Electronics',
            rating: 4.6
        },
        {
            _id: 'demo11',
            title: 'LG 55" 4K Smart TV',
            description: 'Ultra HD LED Smart TV with AI ThinQ',
            mainImg: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
            price: 52999,
            discount: 13,
            category: 'Electronics',
            rating: 4.4
        },
        {
            _id: 'demo12',
            title: 'JBL Flip 6 Bluetooth Speaker',
            description: 'Portable waterproof speaker with deep bass',
            mainImg: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=600&q=80',
            price: 8999,
            discount: 18,
            category: 'Electronics',
            rating: 4.7
        },
        {
            _id: 'demo13',
            title: 'Logitech MX Master 3S',
            description: 'Advanced wireless mouse for productivity',
            mainImg: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._SL1500_.jpg',
            price: 7999,
            discount: 10,
            category: 'Electronics',
            rating: 4.8
        },
        {
            _id: 'demo14',
            title: 'Amazon Echo Dot (5th Gen)',
            description: 'Smart speaker with Alexa (2023 release)',
            mainImg: 'https://images.unsplash.com/photo-1512446733611-9099a758e63c?auto=format&fit=crop&w=600&q=80',
            price: 4499,
            discount: 15,
            category: 'Electronics',
            rating: 4.5
        },
        {
            _id: 'demo15',
            title: 'GoPro HERO11 Black',
            description: 'Waterproof action camera with 5.3K video',
            mainImg: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
            price: 49990,
            discount: 9,
            category: 'Electronics',
            rating: 4.6
        }
    ];

    const mobilesDemoProducts = [
        {
            _id: 'mobile1',
            title: 'Apple iPhone 14 Pro',
            description: '6.1-inch Super Retina XDR display, A16 Bionic chip',
            mainImg: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-1-202209?wid=5120&hei=2880&fmt=jpeg&qlt=80&.v=1660753619946',
            price: 129900,
            discount: 5,
            category: 'Mobiles',
            rating: 4.8
        },
        {
            _id: 'mobile2',
            title: 'Samsung Galaxy S23 Ultra',
            description: '6.8-inch QHD+ Dynamic AMOLED, 200MP camera',
            mainImg: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-5g-1.jpg',
            price: 124999,
            discount: 8,
            category: 'Mobiles',
            rating: 4.7
        },
        {
            _id: 'mobile3',
            title: 'OnePlus 11R 5G',
            description: '6.74-inch 120Hz AMOLED, Snapdragon 8+ Gen 1',
            mainImg: 'https://m.media-amazon.com/images/I/71qGismu6NL._SL1500_.jpg',
            price: 39999,
            discount: 10,
            category: 'Mobiles',
            rating: 4.6
        },
        {
            _id: 'mobile4',
            title: 'Google Pixel 7 Pro',
            description: '6.7-inch LTPO OLED, Google Tensor G2',
            mainImg: 'https://fdn2.gsmarena.com/vv/pics/google/google-pixel7-pro-1.jpg',
            price: 84999,
            discount: 12,
            category: 'Mobiles',
            rating: 4.5
        },
        {
            _id: 'mobile5',
            title: 'Xiaomi 13 Pro',
            description: '6.73-inch AMOLED, Snapdragon 8 Gen 2',
            mainImg: 'https://images.samsung.com/is/image/samsung/p6pim/in/sm-s918bzkhins/gallery/in-galaxy-s23-ultra-s918-sm-s918bzkhins-534193003?$650_519_PNG$',
            price: 79999,
            discount: 15,
            category: 'Mobiles',
            rating: 4.4
        },
        {
            _id: 'mobile6',
            title: 'Realme GT 2 Pro',
            description: '6.7-inch 2K AMOLED, Snapdragon 8 Gen 1',
            mainImg: 'https://m.media-amazon.com/images/I/61cwywLZR-L._SL1500_.jpg',
            price: 49999,
            discount: 18,
            category: 'Mobiles',
            rating: 4.3
        },
        {
            _id: 'mobile7',
            title: 'Vivo X90 Pro',
            description: '6.78-inch AMOLED, ZEISS 1-inch sensor',
            mainImg: 'https://m.media-amazon.com/images/I/61Qe0euJJZL._SL1500_.jpg',
            price: 84999,
            discount: 10,
            category: 'Mobiles',
            rating: 4.2
        },
        {
            _id: 'mobile8',
            title: 'iQOO 11 5G',
            description: '6.78-inch 2K E6 AMOLED, Snapdragon 8 Gen 2',
            mainImg: 'https://m.media-amazon.com/images/I/61IiuWQcVjL._SL1500_.jpg',
            price: 59999,
            discount: 14,
            category: 'Mobiles',
            rating: 4.1
        }
    ];

    const laptopsDemoProducts = [
        {
            _id: 'laptop1',
            title: 'Apple MacBook Pro',
            description: '13.3-inch Retina display, M2 chip',
            mainImg: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=1808&hei=1686&fmt=jpeg&qlt=90&.v=1697304211687',
            price: 129900,
            discount: 5,
            category: 'Laptops',
            rating: 4.8
        },
        {
            _id: 'laptop2',
            title: 'Dell XPS 13',
            description: '13.4-inch InfinityEdge display, 11th Gen Intel Core i7',
            mainImg: 'https://images.unsplash.com/photo-1611186871348-b7b3f0ec2b1d?auto=format&fit=crop&w=600&q=80',
            price: 109900,
            discount: 8,
            category: 'Laptops',
            rating: 4.7
        },
        {
            _id: 'laptop3',
            title: 'HP Spectre x360',
            description: '13.5-inch 360° touch screen, 12th Gen Intel Core i7',
            mainImg: 'https://m.media-amazon.com/images/I/71X4X-Q5-XL._SL1500_.jpg',
            price: 119900,
            discount: 10,
            category: 'Laptops',
            rating: 4.6
        },
        {
            _id: 'laptop4',
            title: 'Lenovo ThinkPad X1 Carbon',
            description: '14-inch FHD IPS display, 12th Gen Intel Core i7',
            mainImg: 'https://m.media-amazon.com/images/I/71X4X-Q5-XL._SL1500_.jpg',
            price: 129900,
            discount: 12,
            category: 'Laptops',
            rating: 4.5
        },
        {
            _id: 'laptop5',
            title: 'Microsoft Surface Laptop 4',
            description: '13.5-inch PixelSense display, 11th Gen Intel Core i7',
            mainImg: 'https://m.media-amazon.com/images/I/71X4X-Q5-XL._SL1500_.jpg',
            price: 119900,
            discount: 15,
            category: 'Laptops',
            rating: 4.4
        },
        {
            _id: 'laptop6',
            title: 'ASUS ZenBook 14',
            description: '14-inch Full HD display, AMD Ryzen 5 5600U',
            mainImg: 'https://m.media-amazon.com/images/I/71X4X-Q5-XL._SL1500_.jpg',
            price: 79900,
            discount: 18,
            category: 'Laptops',
            rating: 4.3
        },
        {
            _id: 'laptop7',
            title: 'Acer Swift 3',
            description: '14-inch Full HD display, AMD Ryzen 5 5500U',
            mainImg: 'https://m.media-amazon.com/images/I/71X4X-Q5-XL._SL1500_.jpg',
            price: 69900,
            discount: 20,
            category: 'Laptops',
            rating: 4.2
        },
        {
            _id: 'laptop8',
            title: 'Samsung Galaxy Book 3',
            description: '15.6-inch Full HD display, AMD Ryzen 7 5800U',
            mainImg: 'https://m.media-amazon.com/images/I/71X4X-Q5-XL._SL1500_.jpg',
            price: 109900,
            discount: 10,
            category: 'Laptops',
            rating: 4.1
        }
    ];

    const sportsDemoProducts = [
        {
            _id: 'sports1',
            title: 'SS Cricket Bat',
            description: 'Premium English Willow cricket bat for professional play',
            mainImg: 'https://www.sstoncricket.com/media/catalog/product/cache/926507dc7f93631a094422215b778fe0/s/s/ss-master-1000-english-willow-cricket-bat-1.jpg',
            price: 3499,
            discount: 15,
            category: 'Sports',
            rating: 4.7
        },
        {
            _id: 'sports2',
            title: 'Nivia Football',
            description: 'Official size-5 football for training and matches',
            mainImg: 'https://m.media-amazon.com/images/I/81QFQK5Q2lL._SL1500_.jpg',
            price: 799,
            discount: 10,
            category: 'Sports',
            rating: 4.5
        },
        {
            _id: 'sports3',
            title: 'Yonex Badminton Racket',
            description: 'Lightweight graphite racket for fast play',
            mainImg: 'https://m.media-amazon.com/images/I/61QGgU5rKGL._SL1500_.jpg',
            price: 1299,
            discount: 12,
            category: 'Sports',
            rating: 4.6
        },
        {
            _id: 'sports4',
            title: 'Cosco Volleyball',
            description: 'Durable synthetic volleyball for outdoor/indoor',
            mainImg: 'https://m.media-amazon.com/images/I/81QvQkQwKGL._SL1500_.jpg',
            price: 599,
            discount: 8,
            category: 'Sports',
            rating: 4.3
        },
        {
            _id: 'sports5',
            title: 'Adidas Yoga Mat',
            description: 'Non-slip yoga mat for home and gym workouts',
            mainImg: 'https://m.media-amazon.com/images/I/61zQ+QkQwKL._SL1500_.jpg',
            price: 999,
            discount: 18,
            category: 'Sports',
            rating: 4.4
        },
        {
            _id: 'sports6',
            title: 'SG Cricket Kit Bag',
            description: 'Spacious kit bag for all cricket gear',
            mainImg: 'https://m.media-amazon.com/images/I/81Q2QkQwKGL._SL1500_.jpg',
            price: 1499,
            discount: 14,
            category: 'Sports',
            rating: 4.5
        },
        {
            _id: 'sports7',
            title: 'Puma Running Shoes',
            description: 'Comfortable and stylish running shoes for men',
            mainImg: 'https://m.media-amazon.com/images/I/71v0gGv5gML._SL1500_.jpg',
            price: 2499,
            discount: 20,
            category: 'Sports',
            rating: 4.6
        },
        {
            _id: 'sports8',
            title: 'Li-Ning Shuttlecocks',
            description: 'Pack of 12 feather shuttlecocks for tournaments',
            mainImg: 'https://m.media-amazon.com/images/I/61Q2QkQwKGL._SL1500_.jpg',
            price: 899,
            discount: 10,
            category: 'Sports',
            rating: 4.2
        }
    ];

    const fashionDemoProducts = [
        {
            _id: 'fashion1',
            title: "Levi's Men's Slim Jeans",
            description: 'Classic blue slim-fit jeans for men',
            mainImg: 'https://m.media-amazon.com/images/I/81l3rZK4lnL._UL1500_.jpg',
            price: 2499,
            discount: 20,
            category: 'Fashion',
            rating: 4.6
        },
        {
            _id: 'fashion2',
            title: 'Nike Air Max Sneakers',
            description: 'Trendy and comfortable sneakers for all-day wear',
            mainImg: 'https://m.media-amazon.com/images/I/71sDQhCkE-L._UL1500_.jpg',
            price: 5999,
            discount: 15,
            category: 'Fashion',
            rating: 4.8
        },
        {
            _id: 'fashion3',
            title: "Allen Solly Women's Dress",
            description: 'Elegant floral print midi dress',
            mainImg: 'https://m.media-amazon.com/images/I/71w4QwQkQGL._UL1500_.jpg',
            price: 1999,
            discount: 18,
            category: 'Fashion',
            rating: 4.5
        },
        {
            _id: 'fashion4',
            title: 'Fossil Analog Watch',
            description: 'Stylish analog watch for men',
            mainImg: 'https://m.media-amazon.com/images/I/71Q2QkQwKGL._UL1500_.jpg',
            price: 7499,
            discount: 25,
            category: 'Fashion',
            rating: 4.7
        },
        {
            _id: 'fashion5',
            title: 'Ray-Ban Sunglasses',
            description: 'Classic aviator sunglasses with UV protection',
            mainImg: 'https://m.media-amazon.com/images/I/61Q2QkQwKGL._UL1500_.jpg',
            price: 3999,
            discount: 10,
            category: 'Fashion',
            rating: 4.6
        },
        {
            _id: 'fashion6',
            title: "Baggit Women's Handbag",
            description: 'Spacious and stylish handbag for women',
            mainImg: 'https://m.media-amazon.com/images/I/81Q2QkQwKGL._UL1500_.jpg',
            price: 1599,
            discount: 22,
            category: 'Fashion',
            rating: 4.4
        },
        {
            _id: 'fashion7',
            title: "U.S. Polo Assn. Men's T-Shirt",
            description: 'Cotton crew neck t-shirt for men',
            mainImg: 'https://m.media-amazon.com/images/I/71Q2QkQwKGL._UL1500_.jpg',
            price: 899,
            discount: 12,
            category: 'Fashion',
            rating: 4.3
        },
        {
            _id: 'fashion8',
            title: "Pepe Jeans Women's Jacket",
            description: 'Trendy denim jacket for women',
            mainImg: 'https://m.media-amazon.com/images/I/71Q2QkQwKGL._UL1500_.jpg',
            price: 2999,
            discount: 17,
            category: 'Fashion',
            rating: 4.5
        }
    ];

    const groceryDemoProducts = [
        {
            _id: 'grocery1',
            title: 'India Gate Basmati Rice',
            description: '5kg premium basmati rice',
            mainImg: 'https://m.media-amazon.com/images/I/81QpkIctqPL._SL1500_.jpg',
            price: 599,
            discount: 10,
            category: 'Grocery',
            rating: 4.7
        },
        {
            _id: 'grocery2',
            title: 'Fortune Sunflower Oil',
            description: '1L healthy sunflower oil',
            mainImg: 'https://m.media-amazon.com/images/I/71Q0QkQwKGL._SL1500_.jpg',
            price: 149,
            discount: 8,
            category: 'Grocery',
            rating: 4.5
        },
        {
            _id: 'grocery3',
            title: 'Tata Sampann Toor Dal',
            description: '1kg protein-rich toor dal',
            mainImg: 'https://m.media-amazon.com/images/I/81Q2QkQwKGL._SL1500_.jpg',
            price: 129,
            discount: 12,
            category: 'Grocery',
            rating: 4.6
        },
        {
            _id: 'grocery4',
            title: 'Aashirvaad Atta',
            description: '5kg whole wheat flour',
            mainImg: 'https://m.media-amazon.com/images/I/81Q2QkQwKGL._SL1500_.jpg',
            price: 249,
            discount: 15,
            category: 'Grocery',
            rating: 4.8
        },
        {
            _id: 'grocery5',
            title: 'Tata Tea Gold',
            description: '1kg premium tea leaves',
            mainImg: 'https://m.media-amazon.com/images/I/81Q2QkQwKGL._SL1500_.jpg',
            price: 399,
            discount: 10,
            category: 'Grocery',
            rating: 4.7
        },
        {
            _id: 'grocery6',
            title: 'Parle-G Biscuits',
            description: '800g family pack biscuits',
            mainImg: 'https://m.media-amazon.com/images/I/81Q2QkQwKGL._SL1500_.jpg',
            price: 99,
            discount: 5,
            category: 'Grocery',
            rating: 4.5
        },
        {
            _id: 'grocery7',
            title: 'Tata Salt',
            description: '1kg iodized salt',
            mainImg: 'https://m.media-amazon.com/images/I/81Q2QkQwKGL._SL1500_.jpg',
            price: 25,
            discount: 4,
            category: 'Grocery',
            rating: 4.6
        },
        {
            _id: 'grocery8',
            title: 'Dhampure Sugar',
            description: '1kg premium sugar',
            mainImg: 'https://m.media-amazon.com/images/I/81Q2QkQwKGL._SL1500_.jpg',
            price: 45,
            discount: 6,
            category: 'Grocery',
            rating: 4.4
        }
    ];

    // Animation: fade-in and move up
    const [cardAnimation, setCardAnimation] = useState(false);
    useEffect(() => {
        setTimeout(() => setCardAnimation(true), 100);
    }, []);

    // Add to Cart handler (demo only)
    const handleAddToCart = (product) => {
        alert(`Added ${product.title} to cart!`);
    };

    // Star rating component
    const StarRating = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <span style={{ color: '#f7b500', fontSize: '1.1rem' }}>
                {'★'.repeat(fullStars)}{halfStar ? '½' : ''}{'☆'.repeat(emptyStars)}
                <span style={{ color: '#888', fontSize: '0.95rem', marginLeft: 4 }}>({rating})</span>
            </span>
        );
    };

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {

        await axios.get('http://localhost:6001/fetch-products').then(
            (response) => {
                if (props.category === 'all') {
                    setProducts(response.data);
                    setVisibleProducts(response.data);
                    setFiltered(response.data);
                } else {
                    setProducts(response.data.filter(product => product.category === props.category));
                    setVisibleProducts(response.data.filter(product => product.category === props.category));
                    setFiltered(response.data.filter(product => product.category === props.category));
                }
            }
        )
        await axios.get('http://localhost:6001/fetch-categories').then(
            (response) => {
                setCategories(response.data);
            }
        )
    }

    const handleCategoryCheckBox = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setFilters(f => ({ ...f, category: value }));
        } else {
            setFilters(f => ({ ...f, category: f.category.filter(c => c !== value) }));
        }
    }

    const handleGenderCheckBox = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setFilters(f => ({ ...f, gender: value }));
        } else {
            setFilters(f => ({ ...f, gender: f.gender.filter(g => g !== value) }));
        }
    }

    const handleSizeCheckBox = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setFilters(f => ({ ...f, size: value }));
        } else {
            setFilters(f => ({ ...f, size: f.size.filter(s => s !== value) }));
        }
    }

    const handlePriceFilter = (e) => {
        const value = e.target.value;
        setFilters(f => ({ ...f, minPrice: value ? value : '', maxPrice: value ? value : '' }));
    }

    const handleDiscountFilter = (e) => {
        const value = e.target.value;
        setFilters(f => ({ ...f, discount: value ? value : '' }));
    }

    const handleSortFilterChange = (e) => {
        const value = e.target.value;
        setSort(value);
        if (value === 'low-price') {
            setVisibleProducts(visibleProducts.sort((a, b) => a.price - b.price))
        } else if (value === 'high-price') {
            setVisibleProducts(visibleProducts.sort((a, b) => b.price - a.price))
        } else if (value === 'discount') {
            setVisibleProducts(visibleProducts.sort((a, b) => b.discount - a.discount))
        }
    }

    useEffect(() => {
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

    return (
        <div className="products-container">
            <ToastContainer position="top-right" autoClose={1500} />
            {props.category !== 'Electronics' && props.category !== 'Mobiles' && props.category !== 'Laptops' && props.category !== 'Sports' && props.category !== 'Fashion' && props.category !== 'Grocery' && (
                <div className="products-filter">
                    <h4>Filters</h4>
                    <div className="product-filters-body">
                        {props.category === 'Mobiles' ? (
                            <>
                                <div className="filter-brands">
                                    <h6>Mobile Brands</h6>
                                    <div className="filter-brands-body sub-filter-body">
                                        {['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi', 'Realme', 'Vivo', 'iQOO'].map(brand => (
                                            <div className="form-check" key={brand}>
                                                <input className="form-check-input" type="checkbox" value={brand} id={`brand-${brand}`} checked={filters.brand === brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))} />
                                                <label className="form-check-label" htmlFor={`brand-${brand}`}>{brand}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="filter-price">
                                    <h6>Price</h6>
                                    <div className="filter-price-body sub-filter-body">
                                        <input type="number" placeholder="Min Price" value={filters.minPrice} onChange={handlePriceFilter} />
                                        <input type="number" placeholder="Max Price" value={filters.maxPrice} onChange={handlePriceFilter} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="filter-sort">
                                    <h6>Sort By</h6>
                                    <div className="filter-sort-body sub-filter-body">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio1" value="popularity" checked={sort === 'popularity'} onChange={handleSortFilterChange} />
                                            <label className="form-check-label" htmlFor="filter-sort-radio1">Popular</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio2" value="low-price" checked={sort === 'low-price'} onChange={handleSortFilterChange} />
                                            <label className="form-check-label" htmlFor="filter-sort-radio2">Price (low to high)</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio3" value="high-price" checked={sort === 'high-price'} onChange={handleSortFilterChange} />
                                            <label className="form-check-label" htmlFor="filter-sort-radio3">Price (high to low)</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="filter-sort-radio4" value="discount" checked={sort === 'discount'} onChange={handleSortFilterChange} />
                                            <label className="form-check-label" htmlFor="filter-sort-radio4">Discount</label>
                                        </div>
                                    </div>
                                </div>
                                {props.category === 'all' ? (
                                    <div className="filter-categories">
                                        <h6>Categories</h6>
                                        <div className="filter-categories-body sub-filter-body">
                                            {categories.map(category => (
                                                <div className="form-check" key={category}>
                                                    <input className="form-check-input" type="checkbox" value={category} id={'productCategory' + category} checked={filters.category === category} onChange={handleCategoryCheckBox} />
                                                    <label className="form-check-label" htmlFor={'productCategory' + category}>{category}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                <div className="filter-gender">
                                    <h6>Gender</h6>
                                    <div className="filter-gender-body sub-filter-body">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="Men" id="filter-gender-check-1" checked={filters.gender === 'Men'} onChange={handleGenderCheckBox} />
                                            <label className="form-check-label" htmlFor="filter-gender-check-1">Men</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="Women" id="filter-gender-check-2" checked={filters.gender === 'Women'} onChange={handleGenderCheckBox} />
                                            <label className="form-check-label" htmlFor="filter-gender-check-2">Women</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="Unisex" id="filter-gender-check-3" checked={filters.gender === 'Unisex'} onChange={handleGenderCheckBox} />
                                            <label className="form-check-label" htmlFor="filter-gender-check-3">Unisex</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter-size">
                                    <h6>Size</h6>
                                    <div className="filter-size-body sub-filter-body">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="S" id="filter-size-check-1" checked={filters.size === 'S'} onChange={handleSizeCheckBox} />
                                            <label className="form-check-label" htmlFor="filter-size-check-1">S</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="M" id="filter-size-check-2" checked={filters.size === 'M'} onChange={handleSizeCheckBox} />
                                            <label className="form-check-label" htmlFor="filter-size-check-2">M</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="L" id="filter-size-check-3" checked={filters.size === 'L'} onChange={handleSizeCheckBox} />
                                            <label className="form-check-label" htmlFor="filter-size-check-3">L</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="XL" id="filter-size-check-4" checked={filters.size === 'XL'} onChange={handleSizeCheckBox} />
                                            <label className="form-check-label" htmlFor="filter-size-check-4">XL</label>
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
                            </>
                        )}
                    </div>
                </div>
            )}
            <div className="products-body">
                <h3>{props.category === 'Electronics' ? 'Electronics' : props.category === 'Mobiles' ? 'Mobiles' : props.category === 'Laptops' ? 'Laptops' : props.category === 'Sports' ? 'Sports' : props.category === 'Fashion' ? 'Fashion' : props.category === 'Grocery' ? 'Grocery' : 'All Products'}</h3>
                <div className="products">
                    <div className="product-list">
                        {(props.category === 'Electronics' && filtered.length === 0
                            ? electronicsDemoProducts
                            : props.category === 'Mobiles' && filtered.length === 0
                                ? mobilesDemoProducts
                                : props.category === 'Laptops' && filtered.length === 0
                                    ? laptopsDemoProducts
                                    : props.category === 'Sports' && filtered.length === 0
                                        ? sportsDemoProducts
                                        : props.category === 'Fashion' && filtered.length === 0
                                            ? fashionDemoProducts
                                            : props.category === 'Grocery' && filtered.length === 0
                                                ? groceryDemoProducts
                                                : filtered
                        ).map((product, idx) => (
                            <div
                                className={`product-card product-card-hover${cardAnimation ? ' card-animate' : ''}`}
                                key={product._id}
                                style={{
                                    transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.5s',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    background: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 12px #e3e3e3',
                                    padding: '18px',
                                    margin: '10px',
                                    opacity: cardAnimation ? 1 : 0,
                                    transform: cardAnimation ? 'translateY(0)' : 'translateY(40px)'
                                }}
                            >
                                <div
                                    style={{
                                        width: 180,
                                        height: 180,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#f7fafd',
                                        borderRadius: 12,
                                        margin: '0 auto 10px auto',
                                        boxShadow: '0 1px 8px #eee'
                                    }}
                                >
                                    <img
                                        src={product.mainImg}
                                        alt={product.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: 12,
                                            display: 'block'
                                        }}
                                    />
                                </div>
                                <h3 style={{ margin: '12px 0 6px 0', fontWeight: 600, color: '#2d3a4a' }}>{product.title}</h3>
                                <p style={{ fontSize: '0.95rem', color: '#555', minHeight: '38px' }}>{product.description}</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '8px 0' }}>
                                    <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#1a7f37' }}>₹{product.price - Math.round((product.price * (product.discount || 0)) / 100)}</span>
                                    {product.discount ? <span style={{ textDecoration: 'line-through', color: '#e53935', fontSize: '1rem' }}>₹{product.price}</span> : null}
                                    {product.discount ? <span style={{ color: '#fff', background: '#e53935', borderRadius: '6px', padding: '2px 8px', fontSize: '0.9rem', marginLeft: '4px' }}>-{product.discount}%</span> : null}
                                </div>
                                {/* Star rating for demo products */}
                                {product.rating && <div style={{ margin: '8px 0 0 0' }}><StarRating rating={product.rating} /></div>}
                                {/* Add to Cart button */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    style={{
                                        marginTop: 14,
                                        background: 'linear-gradient(90deg, #1a7f37 60%, #4caf50 100%)',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: '10px 22px',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        boxShadow: '0 2px 8px #e3e3e3',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s, transform 0.15s',
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #388e3c 60%, #43a047 100%)'}
                                    onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #1a7f37 60%, #4caf50 100%)'}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products