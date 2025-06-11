// src/components/StudentProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StudentProfile.css';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/student/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(res.data);
        console.log(res.data)
      } catch (err) {
        setError('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>👤 Student Profile</h2>
      <div className="info-card">
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Enrollment No:</strong> {profile.enrollmentNo}</p>
        <p><strong>Contact:</strong> {profile.contact}</p>
        <p><strong>Year:</strong> {profile.collegeYear}</p>
        <p><strong>Branch:</strong> {profile.branch}</p>
      </div>

      <div className="stats-card">
        <h3>📊 Library Stats</h3>
        <ul>
          <li>Total Available Books: {profile.stats.totalBooks}</li>
          <li>Books Issued: {profile.stats.issuedBooksCount}</li>
          <li>Pending Requests: {profile.stats.pendingRequestsCount}</li>
          <li>Overdue Books: {profile.stats.overdueBooksCount}</li>
        </ul>
      </div>

      <div className="issued-section">
        <h3>📚 Currently Issued Books</h3>
        {profile.issuedBooks.length === 0 ? (
          <p>No issued books</p>
        ) : (
          <div className="book-grid">
            {profile.issuedBooks.map((book, idx) => (
              <div className="book-card" key={idx}>
                <h4>{book.title}</h4>
                <p>Author: {book.author}</p>
                <p>Issued On: {new Date(book.issuedOn).toLocaleDateString()}</p>
                <p>Due Date: {new Date(book.dueDate).toLocaleDateString()}</p>
                {new Date(book.dueDate) < new Date() && (
                  <p className="overdue">⚠️ Overdue - Please return!</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
