import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { todoAPI, authAPI } from '../utils/api';
import './AdminTodos.css';

function AdminTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectAllPledges, setSelectAllPledges] = useState(false);
  const [formData, setFormData] = useState({
    pledgeId: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'general'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [todosRes, usersRes] = await Promise.all([
        todoAPI.getAllForAdmin(),
        authAPI.getUsers({ role: 'pledge' })
      ]);
      
      setTodos(todosRes.data.todos);
      setPledges(usersRes.data.users || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectAllPledges) {
        // Create todo for all pledges
        const pledgeIds = pledges.map(p => p._id);
        await todoAPI.createBulk({
          pledgeIds,
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          priority: formData.priority,
          category: formData.category
        });
      } else {
        // Create todo for single pledge
        await todoAPI.create(formData);
      }
      
      setShowAddModal(false);
      setSelectAllPledges(false);
      setFormData({
        pledgeId: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: 'general'
      });
      await loadData();
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Error creating todo');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoAPI.delete(id);
        setTodos(prev => prev.filter(t => t._id !== id));
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-todos-container">
      <nav className="admin-nav">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>Manage Todos</h1>
      </nav>

      <div className="admin-todos-main">
        <div className="admin-header">
          <h2>All Pledge Todos</h2>
          <button onClick={() => setShowAddModal(true)} className="btn-add">
            + Add Todo
          </button>
        </div>

        <div className="todos-grid">
          {pledges.map(pledge => {
            const pledgeTodos = todos.filter(t => t.pledgeId?._id === pledge._id);
            const completedCount = pledgeTodos.filter(t => t.completed).length;
            
            return (
              <div key={pledge._id} className="pledge-todos-card">
                <div className="pledge-header">
                  <h3>{pledge.firstName} {pledge.lastName}</h3>
                  <span className="pledge-stats">
                    {completedCount} / {pledgeTodos.length} completed
                  </span>
                </div>
                
                <div className="pledge-todos-list">
                  {pledgeTodos.map(todo => (
                    <div key={todo._id} className={`admin-todo-item ${todo.completed ? 'completed' : ''}`}>
                      <div className="todo-info">
                        <h4>{todo.title}</h4>
                        {todo.description && <p>{todo.description}</p>}
                        <div className="todo-badges">
                          <span className={`priority-badge ${todo.priority}`}>
                            {todo.priority}
                          </span>
                          <span className="category-badge">{todo.category}</span>
                          {todo.dueDate && (
                            <span className="due-badge">
                              Due: {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {todo.completed && <span className="completed-badge">✓ Completed</span>}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(todo._id)} 
                        className="btn-delete-small"
                        title="Delete todo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {pledgeTodos.length === 0 && (
                    <p className="no-todos-text">No todos assigned</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {pledges.length === 0 && (
          <div className="no-data">
            <p>No pledges with todos found.</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add New Todo</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectAllPledges}
                    onChange={(e) => {
                      setSelectAllPledges(e.target.checked);
                      if (e.target.checked) {
                        setFormData({...formData, pledgeId: ''});
                      }
                    }}
                  />
                  <span>Select all pledges ({pledges.length})</span>
                </label>
              </div>

              {!selectAllPledges && (
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
              )}

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Todo title"
                />
              </div>

              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Additional details"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="general">General</option>
                    <option value="event">Event</option>
                    <option value="requirement">Requirement</option>
                    <option value="paddle">Paddle</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due Date (optional)</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Todo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTodos;

