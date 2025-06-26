import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {Admin, Cart, Orders, Product, User, Review, Wishlist } from './Schema.js'
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';


const app = express();

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const PORT = 6001;
const JWT_SECRET = 'your_jwt_secret'; // TODO: Move to environment variable in production

// Initialize admin data if it doesn't exist
async function initializeAdminData() {
    try {
        const adminExists = await Admin.findOne();
        if (!adminExists) {
            const newAdmin = new Admin({
                banner: "",
                categories: ["Men", "Women", "Unisex", "Accessories"]
            });
            await newAdmin.save();
            console.log('Initial admin data created');
        }
    } catch (error) {
        console.error('Error initializing admin data:', error);
    }
}

// Connect to MongoDB with enhanced error handling
mongoose.connect('mongodb+srv://leelayatam:18-01-2005@shop.lynvedc.mongodb.net/shopEZ', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
}).then(async () => {
    console.log('Connected to MongoDB Atlas successfully');
    
    // Initialize admin data after successful connection
    await initializeAdminData();

    // Registration endpoint with enhanced validation and error handling
    app.post('/register', async (req, res) => {
        const { username, email, usertype, password } = req.body;
        
        try {
            // Input validation
            if (!username || !email || !password) {
                return res.status(400).json({ 
                    message: 'Please provide all required fields',
                    required: ['username', 'email', 'password']
                });
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ 
                    message: 'Please provide a valid email address'
                });
            }

            // Password validation (minimum 6 characters)
            if (password.length < 6) {
                return res.status(400).json({ 
                    message: 'Password must be at least 6 characters long'
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'User with this email already exists'
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const newUser = new User({
                username,
                email,
                usertype: usertype || 'customer',
                password: hashedPassword,
                wishlist: []
            });

            // Save user to database
            const userCreated = await newUser.save();

            // Generate JWT token
            const token = jwt.sign(
                { 
                    id: userCreated._id, 
                    email: userCreated.email, 
                    usertype: userCreated.usertype 
                }, 
                JWT_SECRET, 
                { expiresIn: '7d' }
            );

            // Return success response with user data and token
            return res.status(201).json({
                message: 'Registration successful',
                user: {
                    id: userCreated._id,
                    username: userCreated.username,
                    email: userCreated.email,
                    usertype: userCreated.usertype
                },
                token
            });

        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ 
                message: 'Error occurred during registration',
                error: error.message 
            });
        }
    });

    // Login endpoint with enhanced validation and error handling
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            // Input validation
            if (!email || !password) {
                return res.status(400).json({ 
                    message: 'Please provide both email and password'
                });
            }

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ 
                    message: 'Invalid email or password'
                });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ 
                    message: 'Invalid email or password'
                });
            }

            // Generate JWT
            const token = jwt.sign(
                { 
                    id: user._id, 
                    email: user.email, 
                    usertype: user.usertype 
                }, 
                JWT_SECRET, 
                { expiresIn: '7d' }
            );

            // Return success response
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    usertype: user.usertype
                },
                token
            });

        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ 
                message: 'Error occurred during login',
                error: error.message 
            });
        }
    });

    // JWT Middleware
    function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });
            req.user = user;
            next();
        });
    }

    // Admin check middleware
    function isAdmin(req, res, next) {
        if (req.user && req.user.usertype === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Admin access required' });
        }
    }

    // fetch banner
    app.get('/fetch-banner', async(req, res)=>{
        try{
            const admin = await Admin.findOne();
            if (!admin) {
                const newAdmin = new Admin({banner: "", categories: []});
                await newAdmin.save();
                return res.json(newAdmin.banner || "");
            }
            res.json(admin.banner || "");
        }catch(err){
            console.error('Error in fetch-banner:', err);
            res.status(500).json({ 
                message: 'Error occurred while fetching banner',
                error: err.message 
            });
        }
    })


    // fetch users

    app.get('/fetch-users', authenticateToken, isAdmin, async(req, res)=>{
        try{
            const users = await User.find();
            res.json(users);

        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Error occured' });
        }
    })

     // Fetch individual product
     app.get('/fetch-product-details/:id', async(req, res)=>{
        const id = req.params.id;
        try{
            const product = await Product.findById(id);
            res.json(product);
        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })

    // fetch products
    app.get('/fetch-products', async(req, res) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 });
            // Return empty array if no products found instead of throwing an error
            res.json(products || []);
        } catch(err) {
            console.error('Error in fetch-products:', err);
            res.status(500).json({ 
                message: 'Error occurred while fetching products',
                error: err.message 
            });
        }
    });

    // fetch orders

    app.get('/fetch-orders', authenticateToken, isAdmin, async(req, res)=>{
        try{
            const orders = await Orders.find();
            res.json(orders);

        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Error occured' });
        }
    })


    // Fetch categories

    app.get('/fetch-categories', async(req, res) => {
        try {
            const admin = await Admin.findOne();
            if (!admin) {
                // Return default categories if no admin document exists
                return res.json(["Men", "Women", "Unisex", "Accessories"]);
            }
            res.json(admin.categories);
        } catch(err) {
            console.error('Error in fetch-categories:', err);
            res.status(500).json({
                message: "Error occurred while fetching categories",
                error: err.message
            });
        }
    });


    // Add new product

    app.post('/add-new-product', authenticateToken, isAdmin, async(req, res)=>{
        const {productName, productDescription, productMainImg, productCarousel, productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount} = req.body;
        try{
            if(productCategory === 'new category'){
                const admin = await Admin.findOne();
                admin.categories.push(productNewCategory);
                await admin.save();
                const newProduct = new Product({title: productName, description: productDescription, mainImg: productMainImg, carousel: productCarousel, category: productNewCategory,sizes: productSizes, gender: productGender, price: productPrice, discount: productDiscount});
                await newProduct.save();
            } else{
                const newProduct = new Product({title: productName, description: productDescription, mainImg: productMainImg, carousel: productCarousel, category: productCategory,sizes: productSizes, gender: productGender, price: productPrice, discount: productDiscount});
                await newProduct.save();
            }
            res.json({message: "product added!!"});
        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })

    // update product

    app.put('/update-product/:id', authenticateToken, isAdmin, async(req, res)=>{
        const {productName, productDescription, productMainImg, productCarousel, productSizes, productGender, productCategory, productNewCategory, productPrice, productDiscount} = req.body;
        try{
            if(productCategory === 'new category'){
                const admin = await Admin.findOne();
                admin.categories.push(productNewCategory);
                await admin.save();

                const product = await Product.findById(req.params.id);

                product.title = productName;
                product.description = productDescription;
                product.mainImg = productMainImg;
                product.carousel = productCarousel;
                product.category = productNewCategory;
                product.sizes = productSizes;
                product.gender = productGender;
                product.price = productPrice;
                product.discount = productDiscount;

                await product.save();
               
            } else{
                const product = await Product.findById(req.params.id);

                product.title = productName;
                product.description = productDescription;
                product.mainImg = productMainImg;
                product.carousel = productCarousel;
                product.category = productCategory;
                product.sizes = productSizes;
                product.gender = productGender;
                product.price = productPrice;
                product.discount = productDiscount;

                await product.save();
            }
            res.json({message: "product updated!!"});
        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })


    // Update banner

    app.post('/update-banner', authenticateToken, isAdmin, async(req, res)=>{
        const {banner} = req.body;
        try{
            const data = await Admin.find();
            if(data.length===0){
                const newData = new Admin({banner: banner, categories: []})
                await newData.save();
                res.json({message: "banner updated"});
            }else{
                const admin = await Admin.findOne();
                admin.banner = banner;
                await admin.save();
                res.json({message: "banner updated"});
            }
            
        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })


    // buy product

    app.post('/buy-product', async(req, res)=>{
        const {userId, name, email, mobile, address, pincode, title, description, mainImg, size, quantity, price, discount, paymentMethod, orderDate} = req.body;
        try{

            const newOrder = new Orders({userId, name, email, mobile, address, pincode, title, description, mainImg, size, quantity, price, discount, paymentMethod, orderDate})
            await newOrder.save();
            res.json({message: 'order placed'});

        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })


   
    // cancel order

    app.put('/cancel-order', async(req, res)=>{
        const {id} = req.body;
        try{

            const order = await Orders.findById(id);
            order.orderStatus = 'cancelled';
            await order.save();
            res.json({message: 'order cancelled'});

        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })


    // update order status

    app.put('/update-order-status', async(req, res)=>{
        const {id, updateStatus} = req.body;
        try{

            const order = await Orders.findById(id);
            order.orderStatus = updateStatus;
            await order.save();
            res.json({message: 'order status updated'});

        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })


    // fetch cart items

    app.get('/fetch-cart', authenticateToken, async(req, res) => {
        try {
            const userId = req.user.id; // Get userId from authenticated token
            const cartItems = await Cart.find({ userId })
                .populate('items.productId', 'title description mainImg price discount'); // Populate product details
            res.status(200).json(cartItems);
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ message: 'Error fetching cart items' });
        }
    });


    // add cart item

    app.post('/add-to-cart', authenticateToken, async(req, res) => {
        try {
            const userId = req.user.id; // Get userId from authenticated token
            const { productId, title, description, mainImg, size, quantity, price, discount } = req.body;

            // Find existing cart for user
            let cart = await Cart.findOne({ userId });

            if (!cart) {
                // Create new cart if doesn't exist
                cart = new Cart({
                    userId,
                    items: [],
                    totalAmount: 0
                });
            }

            // Check if product already exists in cart
            const existingItemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId && item.size === size
            );

            if (existingItemIndex > -1) {
                // Update existing item quantity
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({
                    productId,
                    title,
                    description,
                    mainImg,
                    size,
                    quantity,
                    price,
                    discount
                });
            }

            // Calculate total amount
            cart.totalAmount = cart.items.reduce((total, item) => {
                const itemPrice = item.price * (1 - (item.discount || 0) / 100);
                return total + (itemPrice * item.quantity);
            }, 0);

            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Error adding item to cart' });
        }
    });


    // increase cart quantity

    app.put('/increase-cart-quantity', authenticateToken, async(req, res) => {
        try {
            const userId = req.user.id;
            const { productId, size } = req.body;

            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId && item.size === size
            );

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            cart.items[itemIndex].quantity += 1;
            cart.totalAmount = cart.items.reduce((total, item) => {
                const itemPrice = item.price * (1 - (item.discount || 0) / 100);
                return total + (itemPrice * item.quantity);
            }, 0);

            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error increasing cart quantity:', error);
            res.status(500).json({ message: 'Error updating cart' });
        }
    });

    // decrease cart quantity

    app.put('/decrease-cart-quantity', authenticateToken, async(req, res) => {
        try {
            const userId = req.user.id;
            const { productId, size } = req.body;

            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }

            const itemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId && item.size === size
            );

            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            } else {
                cart.items.splice(itemIndex, 1);
            }

            cart.totalAmount = cart.items.reduce((total, item) => {
                const itemPrice = item.price * (1 - (item.discount || 0) / 100);
                return total + (itemPrice * item.quantity);
            }, 0);

            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            console.error('Error decreasing cart quantity:', error);
            res.status(500).json({ message: 'Error updating cart' });
        }
    });


    // remove from cart

    app.put('/remove-item', async(req, res)=>{
        const {id} = req.body;
        try{
            const item = await Cart.deleteOne({_id: id});
            res.json({message: 'item removed'});
        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    });


    // Order from cart

    app.post('/place-cart-order', authenticateToken, async(req, res) => {
        try {
            const userId = req.user.id;
            const { name, email, mobile, address, pincode, paymentMethod } = req.body;

            const cart = await Cart.findOne({ userId });
            if (!cart || cart.items.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            const order = new Orders({
                userId,
                name,
                email,
                mobile,
                address,
                pincode,
                items: cart.items,
                totalAmount: cart.totalAmount,
                paymentMethod,
                orderStatus: 'order placed'
            });

            await order.save();

            // Clear the cart
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();

            res.status(200).json({ message: 'Order placed successfully', order });
        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).json({ message: 'Error placing order' });
        }
    });

    // Multer setup for image uploads
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'client/public/uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage });

    // Product image upload endpoint
    app.post('/upload-product-image', authenticateToken, isAdmin, upload.single('image'), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    });

    // Add to wishlist
    app.post('/add-to-wishlist', authenticateToken, async (req, res) => {
        const { userId, productId } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            if (!user.wishlist) user.wishlist = [];
            if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
            await user.save();
            res.json(user.wishlist);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error adding to wishlist' });
        }
    });

    // Remove from wishlist
    app.post('/remove-from-wishlist', authenticateToken, async (req, res) => {
        const { userId, productId } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            user.wishlist = (user.wishlist || []).filter(id => id != productId);
            await user.save();
            res.json(user.wishlist);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error removing from wishlist' });
        }
    });

    // Get wishlist
    app.get('/wishlist/:userId', authenticateToken, async (req, res) => {
        try {
            const user = await User.findById(req.params.userId).populate('wishlist');
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user.wishlist || []);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching wishlist' });
        }
    });

    // Review endpoints
    // Create a new review
    app.post('/products/:productId/reviews', authenticateToken, async (req, res) => {
        try {
            const { rating, review } = req.body;
            const productId = req.params.productId;
            const userId = req.user.id;

            // Check if user has already reviewed this product
            const existingReview = await Review.findOne({ userId, productId });
            if (existingReview) {
                return res.status(400).json({ message: 'You have already reviewed this product' });
            }

            // Get user details
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Create new review
            const newReview = new Review({
                userId,
                productId,
                rating,
                review,
                username: user.username
            });

            // Save review
            const savedReview = await newReview.save();

            // Update product's review stats
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            product.reviews.push(savedReview._id);
            product.reviewCount += 1;
            
            // Calculate new average rating
            const allProductReviews = await Review.find({ productId });
            const totalRating = allProductReviews.reduce((sum, review) => sum + review.rating, 0);
            product.averageRating = totalRating / product.reviewCount;

            await product.save();

            res.status(201).json(savedReview);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while creating review' });
        }
    });

    // Get reviews for a product
    app.get('/products/:productId/reviews', async (req, res) => {
        try {
            const productId = req.params.productId;
            const reviews = await Review.find({ productId })
                .sort({ createdAt: -1 }) // Sort by newest first
                .populate('userId', 'username'); // Get user details

            res.json(reviews);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while fetching reviews' });
        }
    });

    // Update a review
    app.put('/reviews/:reviewId', authenticateToken, async (req, res) => {
        try {
            const { rating, review } = req.body;
            const reviewId = req.params.reviewId;
            const userId = req.user.id;

            // Find the review
            const existingReview = await Review.findById(reviewId);
            if (!existingReview) {
                return res.status(404).json({ message: 'Review not found' });
            }

            // Check if user owns the review
            if (existingReview.userId.toString() !== userId) {
                return res.status(403).json({ message: 'Not authorized to update this review' });
            }

            // Update review
            existingReview.rating = rating;
            existingReview.review = review;
            existingReview.updatedAt = Date.now();

            const updatedReview = await existingReview.save();

            // Update product's average rating
            const product = await Product.findById(existingReview.productId);
            const allProductReviews = await Review.find({ productId: existingReview.productId });
            const totalRating = allProductReviews.reduce((sum, review) => sum + review.rating, 0);
            product.averageRating = totalRating / product.reviewCount;
            await product.save();

            res.json(updatedReview);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while updating review' });
        }
    });

    // Delete a review
    app.delete('/reviews/:reviewId', authenticateToken, async (req, res) => {
        try {
            const reviewId = req.params.reviewId;
            const userId = req.user.id;

            // Find the review
            const review = await Review.findById(reviewId);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            // Check if user owns the review or is admin
            if (review.userId.toString() !== userId && req.user.usertype !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this review' });
            }

            // Remove review reference from product
            const product = await Product.findById(review.productId);
            product.reviews = product.reviews.filter(id => id.toString() !== reviewId);
            product.reviewCount -= 1;

            // Recalculate average rating
            if (product.reviewCount > 0) {
                const allProductReviews = await Review.find({ 
                    productId: review.productId,
                    _id: { $ne: reviewId }
                });
                const totalRating = allProductReviews.reduce((sum, review) => sum + review.rating, 0);
                product.averageRating = totalRating / product.reviewCount;
            } else {
                product.averageRating = 0;
            }

            await product.save();

            // Delete the review
            await Review.findByIdAndDelete(reviewId);

            res.json({ message: 'Review deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error occurred while deleting review' });
        }
    });

    // Product endpoints
    app.get('/products', async (req, res) => {
        try {
            const { featured, flashSale, category } = req.query;
            let query = {};

            if (featured === 'true') {
                query.featured = true;
            }

            if (flashSale === 'true') {
                query.discount = { $gt: 0 };
            }

            if (category) {
                query.category = category;
            }

            const products = await Product.find(query)
                .select('title description mainImg price discount averageRating reviewCount')
                .sort({ createdAt: -1 });

            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ message: 'Error fetching products' });
        }
    });

    app.get('/products/:id', async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
                .populate({
                    path: 'reviews',
                    populate: {
                        path: 'userId',
                        select: 'username'
                    }
                });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ message: 'Error fetching product details' });
        }
    });

    app.get('/categories', async (req, res) => {
        try {
            const admin = await Admin.findOne();
            const categories = admin.categories.map(category => ({
                name: category,
                image: `/images/categories/${category.toLowerCase()}.jpg`
            }));
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ message: 'Error fetching categories' });
        }
    });

    // Wishlist endpoints
    app.get('/api/wishlist', authenticateToken, async (req, res) => {
        try {
            let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
            if (!wishlist) {
                wishlist = await Wishlist.create({ user: req.user.id, products: [] });
            }
            res.json(wishlist.products);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            res.status(500).json({ message: 'Error fetching wishlist' });
        }
    });

    app.post('/api/wishlist', authenticateToken, async (req, res) => {
        try {
            const { productId } = req.body;
            let wishlist = await Wishlist.findOne({ user: req.user.id });
            
            if (!wishlist) {
                wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
            } else if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
            
            res.json({ message: 'Product added to wishlist' });
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            res.status(500).json({ message: 'Error adding to wishlist' });
        }
    });

    app.delete('/api/wishlist/:productId', authenticateToken, async (req, res) => {
        try {
            const wishlist = await Wishlist.findOne({ user: req.user.id });
            if (!wishlist) {
                return res.status(404).json({ message: 'Wishlist not found' });
            }
            
            wishlist.products = wishlist.products.filter(
                product => product.toString() !== req.params.productId
            );
            await wishlist.save();
            
            res.json({ message: 'Product removed from wishlist' });
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            res.status(500).json({ message: 'Error removing from wishlist' });
        }
    });

    // Start the server only after successful DB connection and initialization
    app.listen(PORT, () => {
        console.log('running @ ' + PORT);
    });

}).catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});