import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LibrarianDashboard.css';

const LibrarianDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
       <h2>Librarian Dashboard</h2>
       
       
         <div className="dashboard-nav-buttons">
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={() => navigate('/')}>Home</button>
        </div>
        <div className="dashboard-buttons">
          <button onClick={() => navigate('/librarian/profile')}>My Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card1" onClick={() => navigate('/librarian/pending')}>
          <h3>Pending Student Approvals</h3>
        </div>

        <div className="dashboard-card1" onClick={() => navigate('/librarian/manage-users')}>
          <h3>Enable/Disable Users</h3>
        </div>

        <div className="dashboard-card1" onClick={() => navigate('/librarian/view-all-users')}>
          <h3>View All Users</h3>
        </div>

        <div className="dashboard-card1" onClick={() => navigate('/librarian/manage-books')}>
          <h3>Book Management</h3>
        </div>

        <div className="dashboard-card1" onClick={() => navigate('/librarian/view-all-requests')}>
          <h3>View All Issue Requests</h3>
        </div>

        <div className="dashboard-card1" onClick={() => navigate('/librarian/add-librarian')}>
          <h3>Add Librarian</h3>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;
