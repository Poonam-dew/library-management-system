import React from 'react';
import '../styles/StudentDashboardPage.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import bookcover from '../assets/no_cover_available.png';

const StudentDashboardPage = () => {
  const navigate = useNavigate();

  const [recentBooks, setRecentBooks] = useState([]);

useEffect(() => {
  const fetchRecentBooks = async () => {
    try {
      const res = await axios.get('/api/books/recent');
      setRecentBooks(res.data);
      console.log(res.data)
    } catch (err) {
      console.error("Failed to fetch recent books", err);
    }
  };

  fetchRecentBooks();
}, []);


  return (
    <div className="student-dashboard">
      {/* Animated Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-text">📚 Welcome to Your Library Portal!</h1>
      </div>

      {/* About Us Section */}
      <div className="about-us">
        <h2>About Us</h2>
        <p>
          Our digital library system empowers students to browse, request, and manage books with ease. Discover a world of knowledge right at your fingertips!
        </p>
      </div>

      {/* Clickable Cards Section */}
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => navigate('/student/stats')}>
          📊 <span>View Library Stats</span>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/student/books')}>
          📘 <span>Browse All Books</span>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/student/issued')}>
          📥 <span>Your Issued Books</span>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/student/request')}>
          📨 <span>My Requests</span>
        </div>
      </div>

      <div className="recommended-section">
  <h2>📚 Recently Added Books</h2>
  <div className="recommended-books">
    {recentBooks.length === 0 ? (
      <p>No recent books found.</p>
    ) : (
      recentBooks.map((book) => (
        <div key={book._id} className="recommended-book-card">
          <img src={book.image || bookcover }  className="book-image" alt={book.title} />
          <h4>{book.title}</h4>
          <p>Author:{book.author}</p>
        </div>
      ))
    )}
  </div>
</div>

      
    </div>
  );
};

export default StudentDashboardPage;
