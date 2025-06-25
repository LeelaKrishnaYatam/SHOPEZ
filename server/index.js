import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import {Admin, Cart, Orders, Product, User } from './Schema.js'
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

mongoose.connect('mongodb+srv://leelayatam:18-01-2005@shopez.uwpxwjf.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'shopEZ'
}).then(() => {
    console.log('MongoDB Connected Successfully');

    // JWT Middleware
    function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No authorization header provided' });
        }

        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(403).json({ message: 'Invalid token' });
        }
    }

    // Admin check middleware
    function isAdmin(req, res, next) {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        
        if (req.user.usertype !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        next();
    }

    // Public routes (no auth needed)
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            // Generate JWT
            const token = jwt.sign({ 
                id: user._id, 
                email: user.email, 
                usertype: user.usertype 
            }, JWT_SECRET, { 
                expiresIn: '7d' 
            });
            return res.json({ 
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    usertype: user.usertype
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    });

    app.post('/register', async (req, res) => {
        const { username, email, usertype, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username, 
                email, 
                usertype: usertype || 'customer', 
                password: hashedPassword
            });
            const userCreated = await newUser.save();
            
            // Generate JWT
            const token = jwt.sign({ 
                id: userCreated._id, 
                email: userCreated.email, 
                usertype: userCreated.usertype 
            }, JWT_SECRET, { 
                expiresIn: '7d' 
            });
            
            return res.status(201).json({ 
                token,
                user: {
                    _id: userCreated._id,
                    username: userCreated.username,
                    email: userCreated.email,
                    usertype: userCreated.usertype
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Server error' });
        }
    });

    // Protected routes
    app.get('/fetch-cart', authenticateToken, async (req, res) => {
        try {
            const userId = req.user.id;
            const cartItems = await Cart.find({ userId });
            res.json(cartItems);
        } catch (error) {
            console.error('Cart fetch error:', error);
            res.status(500).json({ message: 'Error fetching cart' });
        }
    });

    app.get('/fetch-banner', authenticateToken, async (req, res) => {
        try {
            const admin = await Admin.findOne();
            if (!admin) {
                return res.status(404).json({ message: 'Admin settings not found' });
            }
            res.json({ banner: admin.banner || '' });
        } catch (error) {
            console.error('Banner fetch error:', error);
            res.status(500).json({ message: 'Error fetching banner' });
        }
    });

    app.get('/fetch-categories', authenticateToken, async (req, res) => {
        try {
            const admin = await Admin.findOne();
            if (!admin) {
                return res.status(404).json({ message: 'Admin settings not found' });
            }
            res.json({ categories: admin.categories || [] });
        } catch (error) {
            console.error('Categories fetch error:', error);
            res.status(500).json({ message: 'Error fetching categories' });
        }
    });

    app.get('/fetch-users', authenticateToken, isAdmin, async(req, res)=>{
        try{
            const users = await User.find();
            res.json(users);

        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Error occured' });
        }
    })

    app.get('/fetch-orders', authenticateToken, isAdmin, async(req, res)=>{
        try{
            const orders = await Orders.find();
            res.json(orders);

        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Error occured' });
        }
    })

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

    app.get('/fetch-products', async(req, res)=>{
        try{
            const products = await Product.find();
            res.json(products);

        }catch(err){
            console.error(err);
            res.status(500).json({ message: 'Error occured' });
        }
    })

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

    app.get('/fetch-cart', authenticateToken, async (req, res) => {
        try {
            const userId = req.user.id;
            const cartItems = await Cart.find({ userId });
            res.json(cartItems);
        } catch (error) {
            console.error('Cart fetch error:', error);
            res.status(500).json({ message: 'Error fetching cart' });
        }
    });

    app.post('/add-to-cart', async(req, res)=>{

        const {userId, title, description, mainImg, size, quantity, price, discount} = req.body
        try{

            const item = new Cart({userId, title, description, mainImg, size, quantity, price, discount});
            await item.save();

            res.json({message: 'Added to cart'});
            
        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })

    app.put('/increase-cart-quantity', async(req, res)=>{
        const {id} = req.body;
        try{
            const item = await Cart.findById(id);
            item.quantity = parseInt(item.quantity) + 1;
            item.save();

            res.json({message: 'incremented'});
        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })

    app.put('/decrease-cart-quantity', async(req, res)=>{
        const {id} = req.body;
        try{
            const item = await Cart.findById(id);
            item.quantity = parseInt(item.quantity) - 1;
            item.save();

            res.json({message: 'decremented'});
        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })

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

    app.post('/place-cart-order', async(req, res)=>{
        const {userId, name, mobile, email, address, pincode, paymentMethod, orderDate} = req.body;
        try{

            const cartItems = await Cart.find({userId});
            cartItems.map(async (item)=>{

                const newOrder = new Orders({userId, name, email, mobile, address, pincode, title: item.title, description: item.description, mainImg: item.mainImg, size:item.size, quantity: item.quantity, price: item.price, discount: item.discount, paymentMethod, orderDate})
                await newOrder.save();
                await Cart.deleteOne({_id: item._id})
            })
            res.json({message: 'Order placed'});

        }catch(err){
            console.error(err);
            res.status(500).json({message: "Error occured"});
        }
    })

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

    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    })
}).catch((error) => {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
});