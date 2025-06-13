import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LibrarianDashboard.css';

const LibrarianDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2>Librarian Dashboard</h2>

      <div
        className="collapsible-box"
        onClick={() => navigate('/librarian/pending')}
      >
        <div className="box-header">
          <h3>Pending Student Approvals</h3>
        </div>
      </div>

      <div
        className="collapsible-box"
        onClick={() => navigate('/librarian/manage-users')}
      >
        <div className="box-header">
          <h3>Enable/Disable Users</h3>
        </div>
      </div>

      <div
        className="collapsible-box"
        onClick={() => navigate('/librarian/view-all-users')}
      >
        <div className="box-header">
          <h3>View All Users</h3>
        </div>
      </div>

      <div
        className="collapsible-box"
        onClick={() => navigate('/librarian/manage-books')}
      >
        <div className="box-header">
          <h3>Book Management</h3>
        </div>
      </div>

       <div
        className="collapsible-box"
        onClick={() => navigate('/librarian/view-all-requests')}
      >
        <div className="box-header">
          <h3>View All Issue Requests</h3>
        </div>
      </div>

       <div
        className="collapsible-box"
        onClick={() => navigate('/librarian/add-librarian')}
      >
        <div className="box-header">
          <h3>Add Librarian</h3>
        </div>
      </div>

    </div>
  );
};

export default LibrarianDashboard;
