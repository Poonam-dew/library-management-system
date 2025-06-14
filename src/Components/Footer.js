// src/components/Footer.js
import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-section about">
        <h3>About</h3>
        <p>
          This Library Management System is designed to streamline book lending,
          requests, and user management for students and librarians.
        </p>
      </div>

      <div className="footer-section links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
          <li><a href="/books">View Books</a></li>
          {/* <li><a href="/contact">Contact Us</a></li> */}
        </ul>
      </div>

      <div className="footer-section contact">
        <h3>Contact</h3>
        <p>Email: library@iit.ac.in</p>
        <p>Phone: +91-12345-67890</p>
        <p>Location: Central Library, VIdya University</p>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Library Management System | All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
