import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ViewAllRequests.css';

const ViewAllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dueDates, setDueDates] = useState({});
  const [actionMessage, setActionMessage] = useState('');
const [messageType, setMessageType] = useState(''); 
const userToken = localStorage.getItem("token");
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/issues/all',{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setRequests(res.data);
     
    } catch (err) {
      console.log(err)
      setError('Failed to fetch requests');
    }
    setLoading(false);
  };


 const handleApprove = async (id) => {
  const dueDate = dueDates[id];
  if (!dueDate) {
    alert('Please select a due date before approving');
     
    return;
  }

  const userToken = localStorage.getItem("token"); // 🔑 token

  try {
    const response = await fetch(`/api/issues/${id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`, // attach token
      },
      body: JSON.stringify({ dueDate }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Request approved successfully');
      // Optionally re-fetch requests
    } else {
      alert(data.message || 'Failed to approve request');
    }
  } catch (error) {
    console.error('Approve Error:', error);
    alert('Error while approving');
  }
};

const handleReject = async (id) => {
  try {
    const res = await axios.put(`/api/issues/reject/${id}`, {}, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    setActionMessage(res.data.message);
    setMessageType('success');
    setRequests(prev =>
      prev.map(r => (r._id === id ? { ...r, status: 'rejected' } : r))
    );
  } catch (error) {
    setActionMessage(error.response?.data?.message || 'Rejection failed');
    setMessageType('error');
  }
};
const handleMarkReturned = async (id) => {
  try {
    await axios.patch(`/api/issues/${id}/return`, {}, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    alert('Book marked as returned');
    fetchRequests(); // or reload state
  } catch (err) {
    alert('Error marking book as returned');
  }
};



  return (
    <div className="requests-container">
      <h2>All Book Issue Requests</h2>
      {loading ? <p>Loading...</p> : error ? <p className="error">{error}</p> :
     <table className="requests-table">
  <thead>
    <tr>
      <th>Book Title</th>
      <th>Author</th>
      <th>Student Name</th>
      <th>Email</th>
      <th>Status</th>
      <th>Requested At</th>
      <th>Set Due Date</th>
      <th>Selected Due date</th>
      <th>Actions</th>
      <th>Returned Status</th>
    </tr>
  </thead>
  <tbody>
    {requests.map((req) => (
      <tr key={req._id}>
        <td>{req.book?.title}</td>
        <td>{req.book?.author}</td>
        <td>{req.student?.firstName} {req.student?.lastName}</td>
        <td>{req.student?.email}</td>
        <td>
          <span className={`status-label ${req.status}`}>
            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
          </span>
        </td>
        <td>{new Date(req.createdAt).toLocaleString()}</td>

        {/* 📅 Due Date Input */}
        <td>
          <label htmlFor={`due-${req._id}`} className="due-label">Due:</label><br />
          <input
            type="date"
            id={`due-${req._id}`}
            className="due-input"
            value={dueDates[req._id] || ''}
            onChange={(e) =>
              setDueDates({ ...dueDates, [req._id]: e.target.value })
            }
          />
        </td>
         <td>
                  {req.dueDate
                    ? new Date(req.dueDate).toLocaleDateString()
                    : '—'}
                </td>

        {/* ✅ Approve / ❌ Reject */}
        <td>
          {req.status === 'pending' ? (
            <>
              <button className="approve-btn" onClick={() => handleApprove(req._id)}>
                Approve
              </button>
              <button className="reject-btn" onClick={() => handleReject(req._id)}>
                Reject
              </button>
            </>
          ) : (
            <button
              className={
                req.status === 'approved' ? 'approved-btn' : 'rejected-btn'
              }
              disabled
            >
              {req.status === 'approved' ? 'Approved' : 'Rejected'}
            </button>
          )}
        </td>
        <td>
          {req.status === 'approved' && !req.returnDate && (
  <button
    className="return-btn"
    onClick={() => handleMarkReturned(req._id)}
  >
    Mark as Returned
  </button>
)}
{req.returnDate && (
  <span className="returned-label">
    ✅ Returned on {new Date(req.returnDate).toLocaleDateString()}
  </span>
)}

        </td>
      </tr>
    ))}
  </tbody>
   {/* Success/Error Message UI */}
{actionMessage && (
  <div className={`action-message ${messageType}`}>
    {actionMessage}
  </div>
)}
</table>

// {/* Success/Error Message UI */}
// {actionMessage && (
//   <div className={`action-message ${messageType}`}>
//     {actionMessage}
//   </div>
// )}


      }
      
    </div>
   
  );
};

export default ViewAllRequests;
