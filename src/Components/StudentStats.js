import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/StudentStats.css'

const StudentStats = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/issues/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // or however you store token
          },
        });
        setStats(data);
      } catch (err) {
        setError('Failed to load stats');
      }
    };
    fetchStats();
  }, []);

  if (error) return <p>{error}</p>;
  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="stats-container">
         <h1>📊 Library Overview</h1>
      <div className="stat-card">
       
        <span role="img" aria-label="books">📚</span>
        <h3>Total Books Available</h3>
        <p>{stats.totalBooks}</p>
      </div>
      <div className="stat-card">
        <span role="img" aria-label="issued">✅</span>
        <h3>Books You Have Issued</h3>
        <p>{stats.issuedBooksCount}</p>
      </div>
      <div className="stat-card">
        <span role="img" aria-label="pending">⌛</span>
        <h3>Pending Requests</h3>
        <p>{stats.pendingRequestsCount}</p>
      </div>
      <div className="stat-card">
        <span role="img" aria-label="overdue">❌</span>
        <h3>Overdue Books</h3>
        <p>{stats.overdueBooksCount}</p>
      </div>
    </div>
  );
};

export default StudentStats;
