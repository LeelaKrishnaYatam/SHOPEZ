import React, { useContext, useState } from 'react'
import { GeneralContext } from '../context/GeneralContext';

const Login = ({setIsLogin}) => {
  const {setEmail: setContextEmail, setPassword: setContextPassword, login} = useContext(GeneralContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="authForm" onSubmit={handleLogin}>
      <h2>Login</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="email" 
          className="form-control" 
          id="floatingInput" 
          placeholder="name@example.com"
          value={email}
          onChange={(e) => {
            const newEmail = e.target.value;
            setEmail(newEmail);
            setContextEmail(newEmail);
            setError('');
          }}
          required
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>

      <div className="form-floating mb-3 authFormInputs">
        <input 
          type="password" 
          className="form-control" 
          id="floatingPassword" 
          placeholder="Password"
          value={password}
          onChange={(e) => {
            const newPassword = e.target.value;
            setPassword(newPassword);
            setContextPassword(newPassword);
            setError('');
          }}
          required
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>

      <p>Not registered? <span onClick={() => setIsLogin(false)} style={{ cursor: 'pointer', color: '#0d6efd' }}>Register</span></p>
    </form>
  );
};

export default Login;