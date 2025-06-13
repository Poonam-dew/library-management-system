import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ViewAllUsers.css';

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/librarian/all-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      setError('Failed to fetch users');
    }
  };

  const filteredUsers = roleFilter === 'all'
    ? users
    : users.filter((u) => u.role === roleFilter);

  return (
    <div className="view-all-container">
      <h2 className="view-all-title">All Registered Users</h2>

      <div className="view-all-filters">
        <label>Filter by Role:</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="student">Students</option>
          <option value="librarian">Librarians</option>
        </select>
      </div>

      {error && <p className="view-all-error">{error}</p>}

      {filteredUsers.length === 0 ? (
        <p className="view-all-message">No users found.</p>
      ) : (
        <table className="view-all-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Year</th>
              <th>Branch</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id}>
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.collegeYear || '-'}</td>
                <td>{u.branch || '-'}</td>
                <td>{u.isActive ? 'Active' : 'Disabled'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAllUsers;
