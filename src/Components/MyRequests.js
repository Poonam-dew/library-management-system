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
      const res = await axios.get('/api/issues/my', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
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
              <th>Issued On</th>
              <th>Due Date</th>
              <th>Message</th>
              <th>Requested On</th>
              <th>Return Info</th>

            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.book?.title}</td>
                <td>{req.book?.author}</td>
                <td className={`status ${req.status}`}>{req.status}</td>
                <td>
                  {req.issueDate
                    ? new Date(req.issueDate).toLocaleDateString()
                    : '—'}
                </td>
                <td>
                  {req.dueDate
                    ? new Date(req.dueDate).toLocaleDateString()
                    : '—'}
                </td>
                <td>
                  {req.status === 'approved' ? (
                    <span className="message approved">
                      You have Issued book successfully.Please come to library and take it.And Return before due date.
                    </span>
                  ) : req.status === 'pending' ? (
                    <span className="message pending">
                      Your request is pending. Please wait for librarian approval.
                    </span>
                  ) : (
                    <span className="message rejected">
                      Your request has been rejected. Please contact the librarian.
                    </span>
                  )}
                </td>
                <td>
                  {req.createdAt
                    ? new Date(req.createdAt).toLocaleString()
                    : '—'}
                </td>
                <td>
  {req.returnDate ? (
    <span className="message returned">
      Returned on {new Date(req.returnDate).toLocaleDateString()}
    </span>
  ) : req.status === 'approved' && req.dueDate && new Date(req.dueDate) < new Date() ? (
    <span className="message overdue">
      ⛔ Return overdue! Please return immediately.
    </span>
  ) : req.status === 'approved' ? (
    <span className="message active">
      Book issued. Return by {new Date(req.dueDate).toLocaleDateString()}
    </span>
  ) : (
    '—'
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyRequests;
