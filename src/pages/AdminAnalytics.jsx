import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import './AdminAnalytics.css';

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterClass, setFilterClass] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, [filterClass]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsAPI.getRoster({ pledgeClass: filterClass });
      setAnalytics(res.data.analytics || []);
    } catch (err) {
      console.error('Failed to load analytics', err);
      setError('Could not load pledge roster data.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (count) => {
    if (count === 0) return 'status-danger';
    if (count < 3) return 'status-warning';
    return 'status-good';
  };

  const getTaskStatus = (count) => {
    if (count === 0) return 'status-warning';
    return 'status-good';
  };

  // Get unique pledge classes for the dropdown
  const classes = [...new Set(analytics.map(a => a.pledgeClass))].filter(Boolean);

  if (loading && analytics.length === 0) {
    return (
      <div className="flex-center w-full min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-analytics dashboard-layout">
      <div className="analytics-header">
        <h1>Master Analytics</h1>
        <p>Overview of pledge 1:1 and paddle task completions</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="analytics-controls">
        <select 
          className="class-select"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">All Pledge Classes</option>
          {classes.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button onClick={loadAnalytics} className="btn-primary btn-sm">Refresh</button>
      </div>

      <div className="analytics-card">
        {analytics.length === 0 ? (
          <div className="empty-state">No active pledges found matching filters.</div>
        ) : (
          <div className="table-responsive">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Pledge Name</th>
                  <th>Class</th>
                  <th>Networking 1:1s</th>
                  <th>Brotherhood 1:1s</th>
                  <th>Alumni 1:1s</th>
                  <th>Industry 1:1s</th>
                  <th>Paddle Tasks</th>
                  <th>Total Sent</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((pledge) => {
                  const total = pledge.stats.networking + pledge.stats.brotherhood + pledge.stats.alumni + pledge.stats.industry;
                  return (
                    <tr key={pledge._id}>
                      <td style={{ fontWeight: 500 }}>{pledge.firstName} {pledge.lastName}</td>
                      <td>{pledge.pledgeClass}</td>
                      <td>
                        <span className={getStatusClass(pledge.stats.networking)}>
                          {pledge.stats.networking}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusClass(pledge.stats.brotherhood)}>
                          {pledge.stats.brotherhood}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusClass(pledge.stats.alumni)}>
                          {pledge.stats.alumni}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusClass(pledge.stats.industry)}>
                          {pledge.stats.industry}
                        </span>
                      </td>
                      <td>
                        <span className={getTaskStatus(pledge.paddleTasks)}>
                          {pledge.paddleTasks}
                        </span>
                      </td>
                      <td style={{ fontWeight: 'bold' }}>{total}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAnalytics;
