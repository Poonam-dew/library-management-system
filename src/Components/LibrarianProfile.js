import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/LibrarianProfile.css';

const LibrarianProfile = () => {
  const [librarian, setLibrarian] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/librarian/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLibrarian(res.data);
      // console.log(res.data)
      setFormData(res.data);
    } catch (err) {
      setMessage('Failed to fetch profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/api/librarian/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setMessage('Update failed');
    }
  };

  if (!librarian) return <div className="profile-container">Loading...</div>;

  return (
    <div className="profile-container">
      <h2>Librarian Profile</h2>

      {message && <p className="message">{message}</p>}

   <div className="profile-details">
  <label>First Name:</label>
  {editing ? (
    <input name="firstName" value={formData.firstName || ''} onChange={handleChange} />
  ) : (
    <span>{librarian.firstName}</span>
  )}

  <label>Last Name:</label>
  {editing ? (
    <input name="lastName" value={formData.lastName || ''} onChange={handleChange} />
  ) : (
    <span>{librarian.lastName}</span>
  )}

  <label>Email:</label>
  <span>{librarian.email}</span>

  <label>Contact:</label>
  {editing ? (
    <input name="contact" value={formData.contact || ''} onChange={handleChange} />
  ) : (
    <span>{librarian.contact}</span>
  )}

  <label>Enrollment No:</label>
  {editing ? (
    <input name="enrollmentNo" value={formData.enrollmentNo || ''} onChange={handleChange} />
  ) : (
    <span>{librarian.enrollmentNo || '-'}</span>
  )}

  <label>College Year:</label>
  {editing ? (
    <input name="collegeYear" value={formData.collegeYear || ''} onChange={handleChange} />
  ) : (
    <span>{librarian.collegeYear || '-'}</span>
  )}

  <label>Branch:</label>
  {editing ? (
    <input name="branch" value={formData.branch || ''} onChange={handleChange} />
  ) : (
    <span>{librarian.branch || '-'}</span>
  )}

  <label>Role:</label>
  <span>{librarian.role}</span>

  <label>Approved:</label>
  <span>{librarian.isApproved ? 'Yes' : 'No'}</span>

  <label>Status:</label>
  <span>{librarian.isActive ? 'Active' : 'Disabled'}</span>
</div>


      <div className="profile-buttons">
        {editing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default LibrarianProfile;
