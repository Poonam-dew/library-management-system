// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="hero-section">
        <h1>Welcome to the Library Management System</h1>
        <p>Explore books, request issues, and manage your library experience with ease.</p>

        <div className="buttons-container">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>

      <div className="section">
        <h2>About Us</h2>
        <p>
          Our system provides seamless management for books, users, and librarians.
          Whether you're a student or librarian, our platform offers modern tools to make
          your work efficient and enjoyable.
        </p>
      </div>

      <div className="section">
        <h2>Browse Books</h2>
        <p>
          View all available books in the library. Search by category or title.
          To issue a book, please log in first.
        </p>
        <button className="view-books-btn" onClick={() => navigate('/books')}>View All Books</button>
      </div>

      {/* <div className="footer">
        &copy; {new Date().getFullYear()} Library Management System | All rights reserved.
      </div> */}
    </div>
  );
};

export default Home;
