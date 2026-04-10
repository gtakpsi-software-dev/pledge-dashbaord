import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="app-navbar">
      <Link to="/home" className="nav-brand" style={{ textDecoration: 'none' }}>
        <div className="greek-letters-small">ΑΚΨ</div>
        <h1>Pledge Dashboard</h1>
      </Link>
      
      <div className="nav-links">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/directory" className="nav-link">Directory</Link>
        <Link to="/resources" className="nav-link">Resources</Link>
        
        {user?.role === 'admin' && (
          <div className="admin-dropdown-container">
            <span className="admin-dropdown-trigger">Admin Tools ▼</span>
            <div className="admin-dropdown-menu">
              <Link to="/admin/analytics" className="admin-dropdown-item">Analytics</Link>
              <Link to="/admin/users" className="admin-dropdown-item">Users</Link>
              <Link to="/admin/requirements" className="admin-dropdown-item">Requirements</Link>
              <Link to="/admin/todos" className="admin-dropdown-item">Todos</Link>
              <Link to="/admin/feedback" className="admin-dropdown-item">Feedback</Link>
            </div>
          </div>
        )}
        
        <div className="user-info">
          <span className="user-name">{user?.firstName} {user?.lastName}</span>
          <span className="user-class">{user?.pledgeClass || user?.role}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
