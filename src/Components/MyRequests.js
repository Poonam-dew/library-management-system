import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyRequests.css';
import { useNavigate } from 'react-router-dom';

const MyRequests = () => {
  const navigate = useNavigate();
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
    <div className="my-requests-containerr">
      <div className="reqback">
          <button className='myreqback' onClick={() => navigate(-1)}>Back</button>
         
        </div>
      <h2>📚 My Book Issue Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="errors">{error}</p>
      ) : requests.length === 0 ? (
        <p>You haven’t requested any books yet.</p>
      ) : (
        <table className="requests-tables">
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
                <td  data-label="Book">{req.book?.title}</td>
                <td data-label="Author">{req.book?.author}</td>
                <td data-label="Status" className={`status ${req.status}`}>{req.status}</td>
                <td data-label="Issued On">
                  {req.issueDate
                    ? new Date(req.issueDate).toLocaleDateString()
                    : '—'}
                </td>
                <td data-label="Due Date">
                  {req.dueDate
                    ? new Date(req.dueDate).toLocaleDateString()
                    : '—'}
                </td>
                <td data-label="Message">
                  {req.status === 'approved' ? (
                    <span className="message approved2">
                      You have Issued book successfully.Please come to library and take it.And Return before due date.
                    </span>
                  ) : req.status === 'pending' ? (
                    <span className="message pending2">
                      Your request is pending. Please wait for librarian approval.
                    </span>
                  ) : (
                    <span className="message rejected2">
                      Your request has been rejected. Please contact the librarian.
                    </span>
                  )}
                </td>
                <td data-label="Requested On">
                  {req.createdAt
                    ? new Date(req.createdAt).toLocaleString()
                    : '—'}
                </td>
                <td data-label="Return Info">
  {req.returnDate ? (
    <span className="message returned2">
      Returned on {new Date(req.returnDate).toLocaleDateString()}
    </span>
  ) : req.status === 'approved' && req.dueDate && new Date(req.dueDate) < new Date() ? (
    <span className="message overdue2">
      ⛔ Return overdue! Please return immediately.
    </span>
  ) : req.status === 'approved' ? (
    <span className="message active2">
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
