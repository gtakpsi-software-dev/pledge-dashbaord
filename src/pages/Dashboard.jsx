import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { oneOnOneAPI, todoAPI } from '../utils/api';
import CalendarSection from '../components/CalendarSection';
import './Dashboard.css';

// Error boundary component to catch CalendarSection errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Calendar Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="calendar-section" style={{ padding: '2rem', background: '#fee', borderRadius: '8px', margin: '2rem 0' }}>
          <h3 style={{ color: '#c00' }}>⚠️ Calendar temporarily unavailable</h3>
          <p>The calendar feature encountered an error. Please refresh the page or contact support if this persists.</p>
          <pre style={{ fontSize: '0.75rem', overflow: 'auto' }}>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function Dashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, todosResponse] = await Promise.all([
        oneOnOneAPI.getStats(),
        todoAPI.getAll()
      ]);

      setStats(statsResponse.data.stats);
      setTodos(todosResponse.data.todos);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (todoId, completed) => {
    try {
      await todoAPI.update(todoId, { completed });
      setTodos(prev => prev.map(todo =>
        todo._id === todoId ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };


  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <div className="greek-letters-small">ΑΚΨ</div>
          <h1>Pledge Dashboard</h1>
        </div>
        <div className="nav-user">
          <Link to="/home" className="dashboard-nav-link">
            Home
          </Link>
          <Link to="/resources" className="dashboard-nav-link">
            Resources
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
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome back, {user?.firstName}!</h2>
          <p>Track your progress and complete your pledging requirements</p>
        </div>

        <ErrorBoundary>
          <CalendarSection />
        </ErrorBoundary>

        {todos.length > 0 && (
          <div className="todos-section">
            <h3>Your To-Do List</h3>
            <div className="todos-list">
              {todos.filter(t => !t.completed).length === 0 ? (
                <div className="no-todos">
                  <p>🎉 All tasks completed! Great job!</p>
                </div>
              ) : (
                todos.map(todo => (
                  <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) => handleToggleTodo(todo._id, e.target.checked)}
                      className="todo-checkbox"
                    />
                    <div className="todo-content">
                      <h4 className={todo.completed ? 'completed-text' : ''}>{todo.title}</h4>
                      {todo.description && (
                        <p className="todo-description">{todo.description}</p>
                      )}
                      <div className="todo-meta">
                        {todo.dueDate && (
                          <span className="todo-due-date">
                            📅 Due: {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span className={`todo-priority ${todo.priority}`}>
                          {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'} {todo.priority}
                        </span>
                        <span className="todo-category">{todo.category}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {todos.filter(t => t.completed).length > 0 && (
              <details className="completed-todos">
                <summary>Completed Tasks ({todos.filter(t => t.completed).length})</summary>
                <div className="todos-list">
                  {todos.filter(t => t.completed).map(todo => (
                    <div key={todo._id} className="todo-item completed">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={(e) => handleToggleTodo(todo._id, false)}
                        className="todo-checkbox"
                      />
                      <div className="todo-content">
                        <h4 className="completed-text">{todo.title}</h4>
                        {todo.description && (
                          <p className="todo-description">{todo.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <Link to="/one-on-one-tracker" className="action-card">
              <div className="action-icon">📋</div>
              <h4>1:1 Tracker</h4>
              <p>Manage your networking, brotherhood, alumni, and industry 1:1s</p>
            </Link>

            <div className="action-card disabled">
              <div className="action-icon">📅</div>
              <h4>Events</h4>
              <p>Coming soon</p>
            </div>

            <div className="action-card disabled">
              <div className="action-icon">✅</div>
              <h4>Requirements</h4>
              <p>Coming soon</p>
            </div>

            <Link to="/feedback-center" className="action-card">
              <div className="action-icon">💬</div>
              <h4>Feedback Center</h4>
              <p>View feedback for milestones and weekly 1:1s</p>
            </Link>
          </div>
        </div>

        {stats && (
          <div className="stats-overview">
            <h3>Overall Progress</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.networking.total}</div>
                <div className="stat-label">Networking 1:1s Started</div>
                <div className="stat-detail">{stats.networking.completed} completed</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">{stats.brotherhood.total}</div>
                <div className="stat-label">Brotherhood 1:1s Started</div>
                <div className="stat-detail">{stats.brotherhood.completed} completed</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">{stats.alumni.total}</div>
                <div className="stat-label">Alumni 1:1s</div>
                <div className="stat-detail">{stats.alumni.completed} completed</div>
              </div>

              <div className="stat-card">
                <div className="stat-number">{stats.industry.total}</div>
                <div className="stat-label">Industry 1:1s</div>
                <div className="stat-detail">{stats.industry.completed} completed</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

