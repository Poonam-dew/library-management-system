import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/Login.css';

const Login = () => {
    useEffect(() => {
  setFormData({ email: '', password: '', role: 'student' });
}, []);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student', // Default role
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = () => {
    setFormData({
      ...formData,
      role: formData.role === 'student' ? 'librarian' : 'student',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        email: formData.email,
        password: formData.password,
      });

      const { role, name } = res.data.user;

      if (formData.role === 'librarian' && formData.email !== 'librarian@library.com') {
        setMessage('Only test librarian account allowed');
        return;
      }

      setMessage('Login successful ✅');

      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/librarian-dashboard');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login as {formData.role === 'student' ? 'Student' : 'Librarian'}</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          autoComplete="off" 
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          autoComplete="new-password"
          required
        />
        <button type="submit">Login</button>

        <button type="button" onClick={handleRoleToggle} className="role-toggle">
          Switch to {formData.role === 'student' ? 'Librarian' : 'Student'}
        </button>

        <p className="message">{message}</p>
         <h2><p style={{ fontSize: '0.9rem', color: '#666' }}>
  🔑 Test Librarian → Email: <b>librarian@library.com</b> | Password: <b>your-password</b>
</p>
</h2>
        <div className="login-links">
          <Link to="/register">Don't have an account? Register</Link>
          <br />
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
