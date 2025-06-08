import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/PendingApprovals.css';

const PendingApprovals = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingStudents();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/librarian/pending-students', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPendingStudents(res.data);
    } catch (err) {
      console.log(err)
      setError('Failed to load pending students.');
    } finally {
      setLoading(false);
    }
  };

  const approveStudent = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/librarian/approve-student/${studentId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Student approved!');
      fetchPendingStudents();
    } catch {
      setError('Approval failed.');
    }
  };

  return (
    <div className="pending-container">
      <h2 className="pending-title">Pending Student Approvals</h2>
      {loading && <p className="pending-message">Loading...</p>}
      {message && <p className="pending-message success">{message}</p>}
      {error && <p className="pending-message error">{error}</p>}
      
      {pendingStudents.length === 0 ? (
        <p className="pending-message">No pending students.</p>
      ) : (
        <table className="pending-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>College Year</th>
              <th>Branch</th>
              <th>Contact</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {pendingStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.firstName} {student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.collegeYear}</td>
                <td>{student.branch}</td>
                <td>{student.contactNo}</td>
                <td>
                  <button onClick={() => approveStudent(student._id)}>Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingApprovals;
