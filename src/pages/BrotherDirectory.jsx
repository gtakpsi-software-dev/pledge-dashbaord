import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { brotherAPI } from '../utils/api';
import './BrotherDirectory.css';

function BrotherDirectory() {
  const { user } = useAuth();
  const [brothers, setBrothers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndustry, setActiveIndustry] = useState('All');
  const [activeType, setActiveType] = useState('All');

  useEffect(() => {
    loadBrothers();
  }, []);

  const loadBrothers = async () => {
    try {
      setLoading(true);
      const res = await brotherAPI.getAll();
      setBrothers(res.data.brothers || []);
    } catch (err) {
      setError('Could not load the brother directory.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Derive dynamic filters safely
  const industries = ['All', ...new Set(brothers.map(b => b.industry).filter(Boolean))].sort();

  // Filter application
  const filteredBrothers = brothers.filter(brother => {
    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = brother.name.toLowerCase().includes(q);
      const matchMajor = brother.major?.toLowerCase().includes(q);
      const matchLine = brother.familyLine?.toLowerCase().includes(q);
      if (!matchName && !matchMajor && !matchLine) return false;
    }

    // Type filter
    if (activeType !== 'All' && brother.type !== activeType.toLowerCase()) {
      return false;
    }

    // Industry filter
    if (activeIndustry !== 'All' && brother.industry !== activeIndustry) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex-center w-full min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="directory-container dashboard-layout">
      <div className="directory-header">
        <h1>Brother Directory</h1>
        <p>Find brothers to connect with based on your career interests</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="directory-controls">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search by name, major, or family line..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="filter-group">
          <span className="filter-label">1:1 Type:</span>
          {['All', 'Networking', 'Brotherhood'].map(type => (
            <button
              key={type}
              className={`filter-pill ${activeType === type ? 'active' : ''}`}
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-label">Industry:</span>
          {industries.map(ind => (
            <button
              key={ind}
              className={`filter-pill ${activeIndustry === ind ? 'active' : ''}`}
              onClick={() => setActiveIndustry(ind)}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      <div className="directory-grid">
        {filteredBrothers.length === 0 ? (
          <div className="empty-directory">
            <h3>No brothers found</h3>
            <p>Try adjusting your search filters.</p>
          </div>
        ) : (
          filteredBrothers.map(brother => (
            <div className="brother-card" key={brother._id}>
              <div className="brother-header">
                <div className="brother-name">{brother.name}</div>
                {brother.position && <div className="brother-position">{brother.position}</div>}
              </div>
              
              <div className="brother-details">
                {brother.industry && (
                  <div className="brother-detail">
                    <span className="detail-label">🏢 Industry:</span> {brother.industry}
                  </div>
                )}
                {brother.major && (
                  <div className="brother-detail">
                    <span className="detail-label">🎓 Major:</span> {brother.major}
                  </div>
                )}
                {brother.familyLine && (
                  <div className="brother-detail">
                    <span className="detail-label">🌳 Line:</span> {brother.familyLine}
                  </div>
                )}
                <div className="brother-detail">
                  <span className="detail-label">🏷️ Credit:</span> 
                  <span style={{ textTransform: 'capitalize', marginLeft: '4px', color: brother.type === 'networking' ? '#3182ce' : '#d69e2e', fontWeight: 600 }}>
                    {brother.type}
                  </span>
                </div>
              </div>

              <div className="brother-actions">
                <a 
                  href={`https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(brother.name)}&subject=${encodeURIComponent('AKPsi 1:1 Request - ' + (user?.fullName || 'Pledge'))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-1on1"
                >
                  Request 1:1
                </a>
                {brother.linkedInUrl && (
                  <a href={brother.linkedInUrl} target="_blank" rel="noopener noreferrer" className="btn-linkedin">
                    in
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BrotherDirectory;
