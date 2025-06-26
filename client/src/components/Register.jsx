import React, { useContext, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Register = ({setIsLogin}) => {
  const {setUsername, setEmail, setPassword, setUsertype, register} = useContext(GeneralContext);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    usertype: ''
  });

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.usertype) {
      setError('Please fill in all fields');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update context values
    switch(name) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'usertype':
        setUsertype(value);
        break;
      default:
        break;
    }

    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="authForm" onSubmit={handleRegister}>
      <h2>Register</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="text"
          name="username"
          className="form-control"
          id="floatingInput"
          placeholder="username"
          onChange={handleInputChange}
          value={formData.username}
          required
        />
        <label htmlFor="floatingInput">Username</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="email"
          name="email"
          className="form-control"
          id="floatingEmail"
          placeholder="name@example.com"
          onChange={handleInputChange}
          value={formData.email}
          required
        />
        <label htmlFor="floatingEmail">Email address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="password"
          name="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          onChange={handleInputChange}
          value={formData.password}
          required
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <select 
        className="form-select form-select-lg mb-3"
        name="usertype"
        value={formData.usertype}
        onChange={handleInputChange}
        required
      >
        <option value="">Select user type</option>
        <option value="admin">Admin</option>
        <option value="customer">Customer</option>
      </select>

      <button 
        type="submit"
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Signing up...' : 'Sign up'}
      </button>

      <p>Already registered? <span onClick={() => setIsLogin(true)} style={{ cursor: 'pointer', color: '#0d6efd' }}>Login</span></p>
    </form>
  );
};

export default Register;