import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { feedbackAPI } from '../utils/api';
import './FeedbackCenter.css';

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

function FeedbackCenter() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAll();
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group feedback by milestone
  const feedbackByMilestone = feedback.reduce((acc, item) => {
    if (!acc[item.milestone]) {
      acc[item.milestone] = [];
    }
    acc[item.milestone].push(item);
    return acc;
  }, {});

  // Get all milestones that have feedback
  const milestonesWithFeedback = Object.keys(feedbackByMilestone).sort();

  // Get all possible milestones
  const allMilestones = Object.keys(MILESTONE_LABELS);

  if (loading) {
    return (
      <div className="feedback-loading">
        <div className="spinner"></div>
        <p>Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="feedback-center-container">
      <main className="feedback-main">
        <div className="feedback-header">
          <h2>Your Milestone Feedback</h2>
          <p>View feedback from brothers and admins for each milestone</p>
        </div>

        {feedback.length === 0 ? (
          <div className="no-feedback">
            <div className="no-feedback-icon">💬</div>
            <h3>No feedback yet</h3>
            <p>Feedback will appear here as you complete milestones and receive evaluations.</p>
          </div>
        ) : (
          <div className="feedback-content">
            <div className="milestones-sidebar">
              <h3>Milestones</h3>
              <div className="milestones-list">
                {allMilestones.map(milestone => {
                  const hasFeedback = milestonesWithFeedback.includes(milestone);
                  const feedbackCount = feedbackByMilestone[milestone]?.length || 0;
                  
                  return (
                    <button
                      key={milestone}
                      className={`milestone-item ${selectedMilestone === milestone ? 'active' : ''} ${hasFeedback ? 'has-feedback' : ''}`}
                      onClick={() => setSelectedMilestone(selectedMilestone === milestone ? null : milestone)}
                    >
                      <span className="milestone-label">{MILESTONE_LABELS[milestone]}</span>
                      {hasFeedback && (
                        <span className="feedback-badge">{feedbackCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="feedback-display">
              {selectedMilestone ? (
                <div className="milestone-feedback">
                  <h3>{MILESTONE_LABELS[selectedMilestone]}</h3>
                  {feedbackByMilestone[selectedMilestone]?.length > 0 ? (
                    <div className="feedback-list">
                      {feedbackByMilestone[selectedMilestone].map(item => (
                        <div key={item._id} className="feedback-item">
                          <div className="feedback-header-item">
                            <div className="feedback-author">
                              <strong>{item.givenByName || `${item.givenBy?.firstName} ${item.givenBy?.lastName}`}</strong>
                              <span className="feedback-date">
                                {new Date(item.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            {item.rating && (
                              <div className="feedback-rating">
                                {'⭐'.repeat(item.rating)}
                              </div>
                            )}
                          </div>
                          <div className="feedback-text">
                            {item.feedback}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-feedback-milestone">
                      <p>No feedback available for this milestone yet.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="feedback-placeholder">
                  <div className="placeholder-icon">📋</div>
                  <h3>Select a milestone to view feedback</h3>
                  <p>Choose a milestone from the sidebar to see detailed feedback</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default FeedbackCenter;

