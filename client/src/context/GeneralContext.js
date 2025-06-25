import React, { createContext, useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create a custom axios instance
const api = axios.create({
    baseURL: 'http://localhost:6001',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000 // Add timeout to prevent hanging requests
});

// Add a request interceptor to add the JWT token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // Clear auth data and redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userType');
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                window.location.href = '/login';
            }
            return Promise.reject(error.response);
        }
        return Promise.reject(error);
    }
);

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUsertype] = useState('');

    const [productSearch, setProductSearch] = useState('');
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Initialize cart count
        fetchCartCount();
    }, []);

    const fetchCartCount = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const response = await api.get('/fetch-cart');
                const filteredCart = response.data.filter(item => item.userId === userId);
                setCartCount(filteredCart.length);
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error('Error fetching cart count:', error);
            setCartCount(0);
        }
    };

    const handleSearch = () => {
        navigate('#products-body');
    };

    const login = async () => {
        try {
            const loginInputs = { email, password };
            const response = await api.post('/login', loginInputs);
            
            // Store auth data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user._id);
            localStorage.setItem('userType', response.data.user.usertype);
            localStorage.setItem('username', response.data.user.username);
            localStorage.setItem('email', response.data.user.email);
            
            // Update state
            setUsertype(response.data.user.usertype);
            setUsername(response.data.user.username);
            setEmail(response.data.user.email);
            
            if (response.data.user.usertype === 'customer') {
                navigate('/');
            } else if (response.data.user.usertype === 'admin') {
                navigate('/admin');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert(error.response?.data?.message || 'Login failed!');
        }
    };

    const inputs = {username, email, usertype, password};

    const register = async () => {
        try {
            const response = await api.post('/register', inputs);
            
            // Store auth data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user._id);
            localStorage.setItem('userType', response.data.user.usertype);
            localStorage.setItem('username', response.data.user.username);
            localStorage.setItem('email', response.data.user.email);
            
            // Update state
            setUsertype(response.data.user.usertype);
            setUsername(response.data.user.username);
            setEmail(response.data.user.email);

            if (response.data.user.usertype === 'customer') {
                navigate('/');
            } else if (response.data.user.usertype === 'admin') {
                navigate('/admin');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.response?.data?.message || 'Registration failed!');
        }
    };

    const logout = async () => {
        try {
            // Clear auth data
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userType');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            
            // Reset state
            setUsertype('');
            setUsername('');
            setEmail('');
            setCartCount(0);
            
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            navigate('/login');
        }
    };

    return (
        <GeneralContext.Provider 
            value={{
                username, 
                setUsername, 
                email, 
                setEmail, 
                password, 
                setPassword, 
                usertype, 
                setUsertype,
                productSearch,
                setProductSearch,
                cartCount,
                setCartCount,
                handleSearch,
                login,
                register,
                logout
            }}
        >
            {children}
        </GeneralContext.Provider>
    );
};

export default GeneralContextProvider;