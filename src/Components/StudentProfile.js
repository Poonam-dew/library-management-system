import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StudentProfile.css';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
   const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/student/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProfile(res.data);
      setFormData(res.data); // preload form
    } catch (err) {
      setMessage('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put('/api/student/profile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Profile updated successfully!');
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setMessage('Error updating profile');
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className='main5'>
        <div className="profileback">
          <button className='profilebackbtn' onClick={() => navigate(-1)}>Back</button>
          
        </div>
          <div className="student-profile">
     
      <h2>👤 My Profile</h2>
      <div className="profile-info5">
        {editMode ? (
          <>
            <label for='name'>Name
            <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" />
            </label>
            <label for='rollno'>Enrollment no
            <input name="rollNo" value={formData.enrollmentNo || ''} onChange={handleChange} placeholder="Roll Number" />
            </label>
            <label for='contact'>Contact no
            <input name="contact" value={formData.contact || ''} onChange={handleChange} placeholder="Contact" />
            </label>
            <label for='collegeYear'>Year
            <input name="collegeYear" value={formData.collegeYear || ''} onChange={handleChange} placeholder="College Year" />
            </label>
            <label for='branch'>Branch
            <input name="branch" value={formData.branch || ''} onChange={handleChange} placeholder="Branch" />
            </label>
            <button onClick={handleSave}>💾 Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Roll No:</strong> {profile.enrollmentNo}</p>
            <p><strong>Contact:</strong> {profile.contact}</p>
            <p><strong>College Year:</strong> {profile.collegeYear}</p>
            <p><strong>Branch:</strong> {profile.branch}</p>
            <button onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
          </>
        )}
      </div>

      <div className="student-stats5">
        <h3>📊 Library Stats</h3>
        <p><strong>Total Books Available:</strong> {profile.stats?.totalBooks}</p>
        <p><strong>Books Issued:</strong> {profile.stats?.issuedBooksCount}</p>
        <p><strong>Pending Requests:</strong> {profile.stats?.pendingRequestsCount}</p>
        <p><strong>Overdue Books:</strong> {profile.stats?.overdueBooksCount}</p>
      </div>

      <div className="overdue-books5">
        <h3>⚠️ Overdue Books</h3>
        {profile.overdueBooks?.length === 0 ? (
          <p>No overdue books!</p>
        ) : (
          profile.overdueBooks.map((book, index) => (
            <div className="overdue-book-card5" key={index}>
              <h4>{book.title}</h4>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Due Date:</strong> {new Date(book.dueDate).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>

      {message && <p className="status-msg5">{message}</p>}
    </div>
    </div>
   
  );
};

export default StudentProfile;
