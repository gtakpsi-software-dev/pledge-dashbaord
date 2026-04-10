import React, { useState, useEffect } from 'react';
import { weeklyRequirementsAPI, authAPI } from '../utils/api';
import './AdminRequirements.css';

function AdminRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [filterClass, setFilterClass] = useState('');
  
  const [formData, setFormData] = useState({
    weekStartDate: '',
    weekEndDate: '',
    pledgeClass: '',
    networking: 0,
    brotherhood: 0,
    alumni: 0,
    industry: 0,
    paddleTasks: 0
  });

  useEffect(() => {
    loadData();
  }, [filterClass]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Admin API defaults to all unless ?pledgeClass= is specified
      const reqRes = await weeklyRequirementsAPI.getAll(filterClass ? { params: { pledgeClass: filterClass } } : {});
      setRequirements(reqRes.data.requirements || []);

      // Load users just to get unique pledge classes (if we don't have them in requirements yet)
      const usersRes = await authAPI.getUsers({ role: 'pledge' });
      setPledges(usersRes.data.users || []);
    } catch (err) {
      console.error('Error loading requirements:', err);
      setError('Could not load weekly requirements.');
    } finally {
      setLoading(false);
    }
  };

  const parseClasses = () => {
    const fromUsers = pledges.map(p => p.pledgeClass);
    const fromReqs = requirements.map(r => r.pledgeClass);
    return [...new Set([...fromUsers, ...fromReqs].filter(Boolean))].sort();
  };
  
  const classes = parseClasses();

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      weekStartDate: '',
      weekEndDate: '',
      pledgeClass: filterClass || '', // default to currently filtered class
      networking: 0,
      brotherhood: 0,
      alumni: 0,
      industry: 0,
      paddleTasks: 0
    });
    setShowModal(true);
  };

  const handleOpenEdit = (req) => {
    setIsEditing(true);
    setEditingId(req._id);
    setFormData({
      weekStartDate: new Date(req.weekStartDate).toISOString().split('T')[0],
      weekEndDate: new Date(req.weekEndDate).toISOString().split('T')[0],
      pledgeClass: req.pledgeClass,
      networking: req.requirements.networking || 0,
      brotherhood: req.requirements.brotherhood || 0,
      alumni: req.requirements.alumni || 0,
      industry: req.requirements.industry || 0,
      paddleTasks: req.requirements.paddleTasks || 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this weekly requirement?')) return;
    try {
      await weeklyRequirementsAPI.delete(id);
      loadData();
    } catch (err) {
      alert('Error deleting requirement.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        weekStartDate: formData.weekStartDate,
        weekEndDate: formData.weekEndDate,
        pledgeClass: formData.pledgeClass,
        requirements: {
          networking: parseInt(formData.networking) || 0,
          brotherhood: parseInt(formData.brotherhood) || 0,
          alumni: parseInt(formData.alumni) || 0,
          industry: parseInt(formData.industry) || 0,
          paddleTasks: parseInt(formData.paddleTasks) || 0
        }
      };

      if (isEditing) {
        await weeklyRequirementsAPI.update(editingId, payload);
      } else {
        await weeklyRequirementsAPI.create(payload);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error saving requirements. Note: Only 1 requirement record can exist per week per class.');
    }
  };

  if (loading && requirements.length === 0) {
    return (
      <div className="flex-center w-full min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page dashboard-layout">
      <div className="admin-header">
        <h1>Manage Requirements</h1>
        <p>Set quotas for 1:1s and paddle tasks by week and pledge class.</p>
        <button onClick={handleOpenAdd} className="btn-primary mt-4">
          + Add Weekly Requirement
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-controls-bar">
        <label htmlFor="class-filter" style={{ fontWeight: 600 }}>Filter by Class: </label>
        <select 
          id="class-filter"
          className="base-input inline-select"
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">All Pledge Classes</option>
          {classes.map(c => (
             <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="admin-section mt-6">
        {requirements.length === 0 ? (
          <div className="empty-state">No weekly requirements found.</div>
        ) : (
          <div className="table-responsive bg-white rounded-lg shadow">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Week Range</th>
                  <th>Networking</th>
                  <th>Brotherhood</th>
                  <th>Alumni</th>
                  <th>Industry</th>
                  <th>Tasks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((req) => (
                  <tr key={req._id}>
                    <td><strong>{req.pledgeClass}</strong></td>
                    <td>
                      {new Date(req.weekStartDate).toLocaleDateString()} - {new Date(req.weekEndDate).toLocaleDateString()}
                    </td>
                    <td>{req.requirements.networking}</td>
                    <td>{req.requirements.brotherhood}</td>
                    <td>{req.requirements.alumni}</td>
                    <td>{req.requirements.industry}</td>
                    <td>{req.requirements.paddleTasks}</td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleOpenEdit(req)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(req._id)} className="btn-delete-small">×</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{isEditing ? 'Edit Week Requirements' : 'Create Weekly Requirement'}</h3>
            <form onSubmit={handleSubmit} className="mt-4">
              
              <div className="form-group">
                <label>Pledge Class</label>
                <select 
                  className="base-input"
                  value={formData.pledgeClass} 
                  onChange={(e) => setFormData({...formData, pledgeClass: e.target.value})}
                  required
                >
                  <option value="">Select a class...</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    className="base-input"
                    value={formData.weekStartDate}
                    onChange={(e) => setFormData({...formData, weekStartDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    className="base-input"
                    value={formData.weekEndDate}
                    onChange={(e) => setFormData({...formData, weekEndDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <h4 className="mt-4 mb-2 text-md font-semibold text-gray-700">1:1 Quotas</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Networking</label>
                  <input 
                    type="number" min="0" className="base-input"
                    value={formData.networking} onChange={(e) => setFormData({...formData, networking: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Brotherhood</label>
                  <input 
                    type="number" min="0" className="base-input"
                    value={formData.brotherhood} onChange={(e) => setFormData({...formData, brotherhood: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-row">
                 <div className="form-group">
                  <label>Alumni</label>
                  <input 
                    type="number" min="0" className="base-input"
                    value={formData.alumni} onChange={(e) => setFormData({...formData, alumni: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <input 
                    type="number" min="0" className="base-input"
                    value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  />
                </div>
              </div>

              <h4 className="mt-4 mb-2 text-md font-semibold text-gray-700">Other</h4>
              <div className="form-group">
                <label>Paddle Tasks</label>
                <input 
                  type="number" min="0" className="base-input max-w-sm"
                  value={formData.paddleTasks} onChange={(e) => setFormData({...formData, paddleTasks: e.target.value})}
                />
              </div>

              <div className="modal-actions mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-submit">{isEditing ? 'Save Changes' : 'Create Assignment'}</button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRequirements;
