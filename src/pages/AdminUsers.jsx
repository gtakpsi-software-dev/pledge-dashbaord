import React, { useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import './AdminUsers.css';

function AdminUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [pendingRes, activeRes] = await Promise.all([
        authAPI.getPendingUsers(),
        authAPI.getUsers({ role: 'pledge' })
      ]);
      
      setPendingUsers(pendingRes.data.users || []);
      setActiveUsers(activeRes.data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Could not load users. Make sure you are an admin and the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await authAPI.activateUser(userId);
      // Reload users after successful activation
      loadUsers();
    } catch (err) {
      alert('Failed to activate user');
    }
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate (suspend) this account?')) return;
    try {
      await authAPI.deactivateUser(userId);
      // Reload users after successful deactivation
      loadUsers();
    } catch (err) {
      alert('Failed to deactivate user');
    }
  };

  if (loading) {
    return (
      <div className="admin-page flex-center h-screen w-full">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page dashboard-layout">
      <div className="admin-header">
        <h1>User Management</h1>
        <p>Approve new signups and manage existing accounts</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <section className="admin-section">
        <h2>Requires Action: Pending Approvals</h2>
        {pendingUsers.length === 0 ? (
          <p className="no-data">No accounts are currently pending approval.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.pledgeClass}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleActivate(user._id)} 
                        className="btn-primary btn-sm"
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section" style={{ marginTop: '3rem' }}>
        <h2>Active Pledges</h2>
        {activeUsers.length === 0 ? (
          <p className="no-data">No active pledge accounts.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.pledgeClass}</td>
                    <td>
                      <button 
                        onClick={() => handleDeactivate(user._id)} 
                        className="btn-danger btn-sm"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminUsers;
