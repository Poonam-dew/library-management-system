import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentNavbar.css';

export default function StudentNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    navigate('/student-login');
  };

  return (
    <nav className="student-navbar">
      <div className="student-navbar-logo" onClick={() => navigate('/student-dashboard')}>
        📚 MyLibrary
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`student-navbar-links ${menuOpen ? 'open' : ''}`}>
        <li onClick={() => navigate('/student-dashboard')}>Dashboard</li>
        <li onClick={() => navigate('/student/request')}>My Requests</li>
        <li onClick={() => navigate('/student-profile')}>Profile</li>
        <li onClick={handleLogout} className="logout-link">Logout</li>
      </ul>
    </nav>
  );
}
