import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/librarian/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch {
      setError('Failed to load users.');
    }
  };

  const toggleActive = async (userId, currentState) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/librarian/toggle-user/${userId}`, { isActive: !currentState }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('User status updated!');
      fetchUsers();
    } catch {
      setError('Update failed.');
    }
  };

  return (
    <div className="manage-container">
      <h2 className="manage-title">Manage Users</h2>
      {message && <p className="manage-message success">{message}</p>}
      {error && <p className="manage-message error">{error}</p>}
      {users.length === 0 ? (
        <p className="manage-message">No users available.</p>
      ) : (
        <table className="manage-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th>Toggle</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    className={`toggle-button ${u.isActive ? 'active' : 'inactive'}`}
                    onClick={() => toggleActive(u._id, u.isActive)}
                  >
                    {u.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
