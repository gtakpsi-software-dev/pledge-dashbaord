import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { feedbackAPI } from '../utils/api';
import './AdminFeedback.css';

const MILESTONE_LABELS = {
  'week1-1on1': 'Week 1 - 1:1s',
  'week2-1on1': 'Week 2 - 1:1s',
  'week3-1on1': 'Week 3 - 1:1s',
  'week4-1on1': 'Week 4 - 1:1s',
  'week5-1on1': 'Week 5 - 1:1s',
  'week6-1on1': 'Week 6 - 1:1s',
  'week7-1on1': 'Week 7 - 1:1s',
  'week8-1on1': 'Week 8 - 1:1s',
  'week9-1on1': 'Week 9 - 1:1s',
  'week10-1on1': 'Week 10 - 1:1s',
  'week11-1on1': 'Week 11 - 1:1s',
  'week12-1on1': 'Week 12 - 1:1s',
  'first-vote': 'First Vote',
  'dei-presentations': 'DEI Presentations',
  'midterm': 'Midterm',
  'personal-brand-presentation': 'Personal Brand Presentation',
  'court-of-honor-presentation': 'Court of Honor Presentation'
};

const MILESTONE_OPTIONS = Object.entries(MILESTONE_LABELS).map(([value, label]) => ({
  value,
  label
}));

function AdminFeedback() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    pledgeId: '',
    milestone: '',
    feedback: '',
    rating: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [feedbackRes, pledgesRes] = await Promise.all([
        feedbackAPI.getAllForAdmin(),
        feedbackAPI.getPledges()
      ]);
      
      setFeedback(feedbackRes.data.feedback);
      setPledges(pledgesRes.data.pledges);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        rating: formData.rating ? parseInt(formData.rating) : undefined
      };
      await feedbackAPI.create(submitData);
      setShowAddModal(false);
      setFormData({
        pledgeId: '',
        milestone: '',
        feedback: '',
        rating: ''
      });
      await loadData();
    } catch (error) {
      console.error('Error creating feedback:', error);
      alert('Error creating feedback: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await feedbackAPI.delete(id);
        setFeedback(prev => prev.filter(f => f._id !== id));
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Error deleting feedback');
      }
    }
  };

  // Group feedback by pledge
  const feedbackByPledge = feedback.reduce((acc, item) => {
    const pledgeId = item.pledgeId?._id || item.pledgeId;
    if (!acc[pledgeId]) {
      acc[pledgeId] = [];
    }
    acc[pledgeId].push(item);
    return acc;
  }, {});

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-feedback-container">
      <div className="admin-feedback-main">
        <div className="admin-header">
          <h2>All Pledge Feedback</h2>
          <button onClick={() => setShowAddModal(true)} className="btn-add">
            + Add Feedback
          </button>
        </div>

        <div className="feedback-grid">
          {pledges.map(pledge => {
            const pledgeFeedback = feedback.filter(f => {
              const pledgeId = f.pledgeId?._id || f.pledgeId;
              return pledgeId === pledge._id;
            });
            
            return (
              <div key={pledge._id} className="pledge-feedback-card">
                <div className="pledge-header">
                  <h3>{pledge.firstName} {pledge.lastName}</h3>
                  <span className="pledge-class">{pledge.pledgeClass}</span>
                </div>
                
                <div className="pledge-feedback-list">
                  {pledgeFeedback.length > 0 ? (
                    pledgeFeedback.map(item => (
                      <div key={item._id} className="admin-feedback-item">
                        <div className="feedback-info">
                          <div className="feedback-milestone">
                            <strong>{MILESTONE_LABELS[item.milestone] || item.milestone}</strong>
                            {item.rating && (
                              <span className="feedback-rating">
                                {'⭐'.repeat(item.rating)}
                              </span>
                            )}
                          </div>
                          <p className="feedback-text">{item.feedback}</p>
                          <div className="feedback-meta">
                            <span className="feedback-author">
                              By: {item.givenByName || `${item.givenBy?.firstName} ${item.givenBy?.lastName}`}
                            </span>
                            <span className="feedback-date">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDelete(item._id)} 
                          className="btn-delete-small"
                          title="Delete feedback"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="no-feedback-text">No feedback yet</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {pledges.length === 0 && (
          <div className="no-data">
            <p>No pledges found.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Feedback</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Pledge</label>
                <select
                  value={formData.pledgeId}
                  onChange={(e) => setFormData({...formData, pledgeId: e.target.value})}
                  required
                >
                  <option value="">Select a pledge</option>
                  {pledges.map(pledge => (
                    <option key={pledge._id} value={pledge._id}>
                      {pledge.firstName} {pledge.lastName} ({pledge.pledgeClass})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Milestone</label>
                <select
                  value={formData.milestone}
                  onChange={(e) => setFormData({...formData, milestone: e.target.value})}
                  required
                >
                  <option value="">Select a milestone</option>
                  {MILESTONE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Feedback</label>
                <textarea
                  value={formData.feedback}
                  onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                  required
                  placeholder="Enter feedback for this milestone..."
                  rows="5"
                />
              </div>

              <div className="form-group">
                <label>Rating (optional)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                >
                  <option value="">No rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFeedback;

