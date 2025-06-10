import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyRequests.css';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get('/api/issues/my',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }); // This route should return student's own requests
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch your requests');
      setLoading(false);
    }
  };

  return (
    <div className="my-requests-container">
      <h2>📚 My Book Issue Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : requests.length === 0 ? (
        <p>You haven’t requested any books yet.</p>
      ) : (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Author</th>
              <th>Status</th>
              <th>Message</th>
              <th>Requested On</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td>{req.book?.title}</td>
                <td>{req.book?.author}</td>
                <td>{req.status}</td>
                <td>{req.message || '—'}</td>
                <td>{req.createdAt ? new Date(req.createdAt).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyRequests;
