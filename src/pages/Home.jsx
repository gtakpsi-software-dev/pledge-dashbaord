import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  oneOnOneAPI,
  weeklyRequirementsAPI,
  todoAPI,
} from '../utils/api';
import './Home.css';

function Home() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [allRequirements, setAllRequirements] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [statsRes, currentRes, allRes, todosRes] = await Promise.all([
        oneOnOneAPI.getStats(),
        weeklyRequirementsAPI.getCurrent(),
        weeklyRequirementsAPI.getAll(),
        todoAPI.getAll(),
      ]);

      setStats(statsRes.data.stats);
      setCurrentWeek(currentRes.data.requirement);
      setAllRequirements(allRes.data.requirements || []);
      setTodos(todosRes.data.todos || []);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Semester totals from weekly requirements
  const semesterTotals = allRequirements.reduce(
    (acc, week) => ({
      networking: acc.networking + (week.requirements?.networking || 0),
      brotherhood: acc.brotherhood + (week.requirements?.brotherhood || 0),
      alumni: acc.alumni + (week.requirements?.alumni || 0),
      industry: acc.industry + (week.requirements?.industry || 0),
    }),
    { networking: 0, brotherhood: 0, alumni: 0, industry: 0 }
  );

  const totalRequired =
    semesterTotals.networking +
    semesterTotals.brotherhood +
    semesterTotals.alumni +
    semesterTotals.industry;

  const totalCompleted = stats
    ? stats.networking.completed +
      stats.brotherhood.completed +
      stats.alumni.completed +
      stats.industry.completed
    : 0;

  const progressPercent =
    totalRequired > 0 ? Math.round((totalCompleted / totalRequired) * 100) : 0;

  const now = new Date();
  const twoWeeksFromNow = new Date(now);
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  // Overdue todos (past due, not completed)
  const overdueTodos = todos
    .filter((t) => !t.completed && t.dueDate)
    .filter((t) => new Date(t.dueDate) < now)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Upcoming todos (due in next 14 days, not completed)
  const upcomingTodos = todos
    .filter((t) => !t.completed && t.dueDate)
    .filter((t) => {
      const due = new Date(t.dueDate);
      return due >= now && due <= twoWeeksFromNow;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Thank-you reminders: completed 1:1s without thank-you sent
  const thankYouNeeded = stats
    ? Math.max(
        0,
        (stats.networking.completed - stats.networking.thankYouSent) +
          (stats.brotherhood.completed - stats.brotherhood.thankYouSent) +
          (stats.alumni.completed - stats.alumni.thankYouSent) +
          (stats.industry.completed - stats.industry.thankYouSent)
      )
    : 0;

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Loading your overview...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-brand">
          <div className="greek-letters-small">ΑΚΨ</div>
          <h1>Pledge Dashboard</h1>
        </div>
        <div className="nav-user">
          <Link to="/dashboard" className="nav-link">
            Full Dashboard
          </Link>
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/todos" className="btn-admin-link">
                Manage Todos
              </Link>
              <Link to="/admin/feedback" className="btn-admin-link">
                Manage Feedback
              </Link>
            </>
          )}
          <span className="user-name">{user?.fullName}</span>
          <span className="user-class">{user?.pledgeClass || user?.role}</span>
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <main className="home-main">
        {/* Hero / Welcome */}
        <section className="home-hero">
          <h2>
            Welcome back, {user?.firstName}!
          </h2>
          <p className="hero-subtitle">
            {user?.pledgeClass} • Here&apos;s your pledging overview
          </p>
        </section>

        {/* Thank-you reminder */}
        {thankYouNeeded > 0 && (
          <section className="home-section thank-you-section">
            <div className="thank-you-card">
              <span className="thank-you-icon">✉️</span>
              <div className="thank-you-content">
                <h4>Thank-you notes pending</h4>
                <p>
                  You have {thankYouNeeded} completed 1:1{thankYouNeeded === 1 ? '' : 's'} that
                  {thankYouNeeded === 1 ? ' hasn\'t' : " haven't"} had a thank-you note sent yet.
                </p>
                <Link to="/one-on-one-tracker" className="thank-you-link">
                  Send thank-you notes →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Progress Summary */}
        <section className="home-section progress-section">
          <h3>Your Progress</h3>
          <div className="progress-card">
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="progress-stats">
              <span className="progress-percent">{progressPercent}%</span>
              <span className="progress-detail">
                {totalCompleted} of {totalRequired} total 1:1s completed this
                semester
              </span>
            </div>
            <div className="progress-breakdown">
              <div className="breakdown-item">
                <span className="breakdown-label">Networking</span>
                <span className="breakdown-value">
                  {stats?.networking.completed ?? 0} / {semesterTotals.networking}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Brotherhood</span>
                <span className="breakdown-value">
                  {stats?.brotherhood.completed ?? 0} /{' '}
                  {semesterTotals.brotherhood}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Alumni</span>
                <span className="breakdown-value">
                  {stats?.alumni.completed ?? 0} / {semesterTotals.alumni}
                </span>
              </div>
              <div className="breakdown-item">
                <span className="breakdown-label">Industry</span>
                <span className="breakdown-value">
                  {stats?.industry.completed ?? 0} / {semesterTotals.industry}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Current Week Snapshot */}
        {currentWeek && (
          <section className="home-section current-week-section">
            <h3>This Week</h3>
            <div className="current-week-card">
              <p className="week-dates">
                {new Date(currentWeek.weekStartDate).toLocaleDateString(
                  'en-US',
                  { month: 'short', day: 'numeric' }
                )}{' '}
                –{' '}
                {new Date(currentWeek.weekEndDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <div className="week-requirements">
                {currentWeek.requirements?.networking > 0 && (
                  <span className="week-req">
                    {currentWeek.requirements.networking} networking
                  </span>
                )}
                {currentWeek.requirements?.brotherhood > 0 && (
                  <span className="week-req">
                    {currentWeek.requirements.brotherhood} brotherhood
                  </span>
                )}
                {currentWeek.requirements?.alumni > 0 && (
                  <span className="week-req">
                    {currentWeek.requirements.alumni} alumni
                  </span>
                )}
                {currentWeek.requirements?.industry > 0 && (
                  <span className="week-req">
                    {currentWeek.requirements.industry} industry
                  </span>
                )}
                {currentWeek.requirements?.paddleTasks > 0 && (
                  <span className="week-req">
                    {currentWeek.requirements.paddleTasks} paddle task(s)
                  </span>
                )}
                {!currentWeek.requirements?.networking &&
                  !currentWeek.requirements?.brotherhood &&
                  !currentWeek.requirements?.alumni &&
                  !currentWeek.requirements?.industry &&
                  !currentWeek.requirements?.paddleTasks && (
                    <span className="week-req empty">No requirements this week</span>
                  )}
              </div>
              <Link to="/one-on-one-tracker" className="week-link">
                Track 1:1s →
              </Link>
            </div>
          </section>
        )}

        {/* Overdue & Upcoming Commitments */}
        <section className="home-section upcoming-section">
          <h3>Upcoming Commitments</h3>
          <div className="upcoming-card">
            {overdueTodos.length > 0 && (
              <>
                <div className="overdue-header">Overdue</div>
                <ul className="upcoming-list overdue-list">
                  {overdueTodos.map((todo) => (
                    <li key={todo._id} className="upcoming-item overdue-item">
                      <div className="upcoming-item-main">
                        <span className="upcoming-title">{todo.title}</span>
                        <span className="upcoming-due overdue-due">
                          Was due {new Date(todo.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {todo.description && (
                        <p className="upcoming-desc">{todo.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {upcomingTodos.length === 0 && overdueTodos.length === 0 ? (
              <p className="no-upcoming">
                No upcoming tasks in the next 2 weeks. Check the full dashboard
                for more.
              </p>
            ) : upcomingTodos.length > 0 ? (
              <>
                {overdueTodos.length > 0 && <div className="upcoming-header">Upcoming</div>}
                <ul className="upcoming-list">
                  {upcomingTodos.map((todo) => (
                    <li key={todo._id} className={`upcoming-item priority-${todo.priority}`}>
                      <div className="upcoming-item-main">
                        <span className="upcoming-title">{todo.title}</span>
                        <span className="upcoming-due">
                          {new Date(todo.dueDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {todo.description && (
                        <p className="upcoming-desc">{todo.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <Link to="/dashboard" className="upcoming-link">
              View all tasks →
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="home-section quick-actions-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <Link to="/one-on-one-tracker" className="home-action-card">
              <div className="action-icon">📋</div>
              <h4>1:1 Tracker</h4>
              <p>Log and track your networking, brotherhood, alumni & industry 1:1s</p>
            </Link>
            <Link to="/dashboard" className="home-action-card">
              <div className="action-icon">📅</div>
              <h4>Full Dashboard</h4>
              <p>Calendar, todos, and detailed progress</p>
            </Link>
            <Link to="/feedback-center" className="home-action-card">
              <div className="action-icon">💬</div>
              <h4>Feedback Center</h4>
              <p>View milestone and weekly feedback</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
