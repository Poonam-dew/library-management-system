// src/components/AddLibrarianForm.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddlibrarianForm.css';

const AddLibrarianForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    collegeYear: '',
    enrollmentNo: '',
    branch: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  if (formData.password !== formData.confirmPassword) {
    return setError('Passwords do not match');
  }

  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('/api/librarian/add', {
      ...formData,
      role: 'librarian',
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMessage(res.data.message || 'Librarian added successfully');

    // ✅ Reset form after success
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      contact: '',
      password: '',
      confirmPassword: '',
      collegeYear: '',
      enrollmentNo: '',
      branch: '',
    });

  } catch (err) {
    setError(err.response?.data?.message || 'Failed to add librarian');
  }
};


  return (
    <div className="add-librarian-container">
      <h2>Add New Librarian</h2>
      <form onSubmit={handleSubmit} className="add-librarian-form">
        <label>First Name</label>
        <input type="text" name="firstName" required onChange={handleChange} />

        <label>Last Name</label>
        <input type="text" name="lastName" required onChange={handleChange} />

        <label>Email</label>
        <input type="email" name="email" required onChange={handleChange} />

        <label>Contact</label>
        <input type="text" name="contact" required onChange={handleChange} />

        <label>College Year</label>
        <input type="text" name="collegeYear" onChange={handleChange} />

        <label>Enrollment No</label>
        <input type="number" name="enrollmentNo" onChange={handleChange} />

        <label>Branch</label>
        <input type="text" name="branch" onChange={handleChange} />

        <label>Password</label>
        <input type="password" name="password" required onChange={handleChange} />

        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" required onChange={handleChange} />

        <button type="submit">Add Librarian</button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AddLibrarianForm;
