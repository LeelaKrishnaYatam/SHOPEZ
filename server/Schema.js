import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    usertype: {type: String, enum: ['customer', 'admin'], default: 'customer'},
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'products' }]
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
    banner: {type: String},
    categories: [{type: String}]
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    username: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    mainImg: {type: String, required: true},
    carousel: [{type: String}],
    sizes: [{
        size: {type: String, required: true},
        stock: {type: Number, required: true, default: 0}
    }],
    category: {type: String, required: true},
    gender: {type: String, required: true, enum: ['Men', 'Women', 'Unisex']},
    price: {type: Number, required: true},
    discount: {type: Number, default: 0},
    featured: {type: Boolean, default: false},
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reviews' }],
    tags: [{type: String}],
    brand: {
        type: String,
        required: true
    },
    material: {type: String},
    care: {type: String},
    shipping: {
        weight: {type: Number},
        dimensions: {
            length: {type: Number},
            width: {type: Number},
            height: {type: Number}
        }
    },
    features: [{
        type: String
    }],
    initialStock: {
        type: Number,
        required: true
    },
    flashSale: {
        type: Boolean,
        default: false
    },
    flashSaleEndTime: {
        type: Date
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
    return this.price * (1 - this.discount / 100);
});

// Virtual for stock status
productSchema.virtual('inStock').get(function() {
    return this.sizes.some(size => size.stock > 0);
});

// Virtual for total stock
productSchema.virtual('totalStock').get(function() {
    return this.sizes.reduce((total, size) => total + size.stock, 0);
});

// Virtual for calculating stock percentage
productSchema.virtual('stockPercentage').get(function() {
    return (this.sizes.reduce((total, size) => total + size.stock, 0) / this.initialStock) * 100;
});

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    mobile: {type: String, required: true},
    address: {type: String, required: true},
    pincode: {type: String, required: true},
    items: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true},
        title: {type: String, required: true},
        description: {type: String},
        mainImg: {type: String},
        size: {type: String, required: true},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        discount: {type: Number, default: 0}
    }],
    totalAmount: {type: Number, required: true},
    paymentMethod: {type: String, required: true, enum: ['COD', 'Online']},
    orderStatus: {type: String, default: 'order placed', enum: [
        'order placed',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
    ]},
    deliveryDate: {type: Date}
}, { timestamps: true });

const cartSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
    items: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true},
        title: {type: String, required: true},
        description: {type: String},
        mainImg: {type: String},
        size: {type: String, required: true},
        quantity: {type: Number, required: true},
        price: {type: Number, required: true},
        discount: {type: Number, default: 0}
    }],
    totalAmount: {type: Number, required: true, default: 0}
}, { timestamps: true });

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = mongoose.model('users', userSchema);
export const Admin = mongoose.model('admin', adminSchema);
export const Product = mongoose.model('products', productSchema);
export const Orders = mongoose.model('orders', orderSchema);
export const Cart = mongoose.model('cart', cartSchema);
export const Review = mongoose.model('reviews', reviewSchema);
export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
