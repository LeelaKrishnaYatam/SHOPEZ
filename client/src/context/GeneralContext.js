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
                window.location.href = '/auth';
            }
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export const GeneralContext = createContext();

const GeneralContextProvider = ({children}) => {
    const navigate = useNavigate();

    // Auth state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usertype, setUsertype] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // App state
    const [productSearch, setProductSearch] = useState('');
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Check for existing auth
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
            setIsAuthenticated(true);
            setUsername(localStorage.getItem('username') || '');
            setEmail(localStorage.getItem('email') || '');
            setUsertype(localStorage.getItem('userType') || '');
            fetchCartCount();
        }
    }, []);

    const fetchCartCount = async () => {
        try {
            const response = await api.get('/fetch-cart');
            // Update to handle the new cart structure
            const cart = response.data[0]; // Get the first (and only) cart for the user
            setCartCount(cart ? cart.items.length : 0);
        } catch (error) {
            if (error.response?.status !== 401) { // Ignore 401 errors as they're handled by interceptor
                console.error('Error fetching cart count:', error);
            }
            setCartCount(0);
        }
    };

    const handleSearch = () => {
        navigate('#products-body');
    };

    const login = async () => {
        if (!email || !password) {
            throw new Error('Please provide both email and password');
        }

        try {
            const response = await api.post('/login', { email, password });
            
            // Store auth data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user.id);
            localStorage.setItem('userType', response.data.user.usertype);
            localStorage.setItem('username', response.data.user.username);
            localStorage.setItem('email', response.data.user.email);
            
            // Update state
            setIsAuthenticated(true);
            setUsertype(response.data.user.usertype);
            setUsername(response.data.user.username);
            setEmail(response.data.user.email);
            
            // Redirect based on user type
            if (response.data.user.usertype === 'customer') {
                navigate('/');
            } else if (response.data.user.usertype === 'admin') {
                navigate('/admin');
            }

            // Reset password
            setPassword('');
            
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async () => {
        if (!username || !email || !password || !usertype) {
            throw new Error('Please fill in all required fields');
        }

        try {
            const response = await api.post('/register', {
                username,
                email,
                password,
                usertype
            });
            
            // Store auth data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user.id);
            localStorage.setItem('userType', response.data.user.usertype);
            localStorage.setItem('username', response.data.user.username);
            localStorage.setItem('email', response.data.user.email);
            
            // Update state
            setIsAuthenticated(true);
            
            // Redirect based on user type
            if (response.data.user.usertype === 'customer') {
                navigate('/');
            } else if (response.data.user.usertype === 'admin') {
                navigate('/admin');
            }

            // Reset password
            setPassword('');
            
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        
        // Reset state
        setIsAuthenticated(false);
        setUsertype('');
        setUsername('');
        setEmail('');
        setPassword('');
        setCartCount(0);
        
        // Redirect to login
        navigate('/auth');
    };

    return (
        <GeneralContext.Provider 
            value={{
                // Auth state
                username,
                setUsername,
                email,
                setEmail,
                password,
                setPassword,
                usertype,
                setUsertype,
                isAuthenticated,
                
                // App state
                productSearch,
                setProductSearch,
                cartCount,
                setCartCount,
                
                // Methods
                handleSearch,
                login,
                register,
                logout,
                fetchCartCount
            }}
        >
            {children}
        </GeneralContext.Provider>
    );
};

export default GeneralContextProvider;