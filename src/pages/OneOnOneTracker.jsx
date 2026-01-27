import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { oneOnOneAPI, brotherAPI, weeklyRequirementsAPI, paddleTaskAPI } from '../utils/api';
import './OneOnOneTracker.css';

function OneOnOneTracker() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('brother');
  const [brothers, setBrothers] = useState([]);
  const [oneOnOnes, setOneOnOnes] = useState([]);
  const [weeklyRequirements, setWeeklyRequirements] = useState([]);
  const [paddleTasks, setPaddleTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [brothersRes, oneOnOnesRes, weeklyRes, paddleRes] = await Promise.all([
        brotherAPI.getAll(),
        oneOnOneAPI.getAll(),
        weeklyRequirementsAPI.getAll(),
        paddleTaskAPI.getAll()
      ]);

      setBrothers(brothersRes.data.brothers);
      setOneOnOnes(oneOnOnesRes.data.oneOnOnes);
      setWeeklyRequirements(weeklyRes.data.requirements);
      setPaddleTasks(paddleRes.data.paddleTasks);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = async (oneOnOneId, field, value) => {
    try {
      await oneOnOneAPI.update(oneOnOneId, { [field]: value });
      // Update local state
      setOneOnOnes(prev => prev.map(item => 
        item._id === oneOnOneId ? { ...item, [field]: value } : item
      ));
    } catch (error) {
      console.error('Error updating 1:1:', error);
    }
  };

  const handleAddOneOnOne = async (type, brotherId, contactName) => {
    try {
      const data = {
        type,
        ...(brotherId && { brotherId }),
        ...(contactName && { contactName })
      };
      
      await oneOnOneAPI.create(data);
      await loadData();
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding 1:1:', error);
    }
  };

  const handleDeleteOneOnOne = async (id) => {
    if (window.confirm('Are you sure you want to delete this 1:1?')) {
      try {
        await oneOnOneAPI.delete(id);
        setOneOnOnes(prev => prev.filter(item => item._id !== id));
      } catch (error) {
        console.error('Error deleting 1:1:', error);
      }
    }
  };

  const handlePaddleTaskUpdate = async (taskId, field, value) => {
    try {
      await paddleTaskAPI.update(taskId, { [field]: value });
      setPaddleTasks(prev => prev.map(task =>
        task._id === taskId ? { ...task, [field]: value } : task
      ));
    } catch (error) {
      console.error('Error updating paddle task:', error);
    }
  };

  const networkingBrothers = brothers.filter(b => b.type === 'networking');
  const brotherhoodBrothers = brothers.filter(b => b.type === 'brotherhood');
  const networkingOneOnOnes = oneOnOnes.filter(o => o.type === 'networking');
  const brotherhoodOneOnOnes = oneOnOnes.filter(o => o.type === 'brotherhood');
  const alumniOneOnOnes = oneOnOnes.filter(o => o.type === 'alumni');
  const industryOneOnOnes = oneOnOnes.filter(o => o.type === 'industry');

  if (loading) {
    return (
      <div className="tracker-loading">
        <div className="spinner"></div>
        <p>Loading tracker...</p>
      </div>
    );
  }

  return (
    <div className="tracker-container">
      <nav className="tracker-nav">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>1:1 Tracker</h1>
      </nav>

      <div className="tracker-main">
        <div className="tracker-tabs">
          <button 
            className={`tab ${activeTab === 'brother' ? 'active' : ''}`}
            onClick={() => setActiveTab('brother')}
          >
            Brother 1:1s
          </button>
          <button 
            className={`tab ${activeTab === 'alumni' ? 'active' : ''}`}
            onClick={() => setActiveTab('alumni')}
          >
            Alumni 1:1s
          </button>
          <button 
            className={`tab ${activeTab === 'industry' ? 'active' : ''}`}
            onClick={() => setActiveTab('industry')}
          >
            Industry 1:1s
          </button>
          <button 
            className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly Tracker
          </button>
          <button 
            className={`tab ${activeTab === 'paddle' ? 'active' : ''}`}
            onClick={() => setActiveTab('paddle')}
          >
            Paddle Tasks
          </button>
        </div>

        {activeTab === 'brother' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Brother 1:1s Tracker</h2>
              <button 
                className="btn-add"
                onClick={() => {
                  setModalType('networking');
                  setShowAddModal(true);
                }}
              >
                + Add Networking
              </button>
            </div>

            <div className="brother-section">
              <h3>Networking (Total: {networkingOneOnOnes.length})</h3>
              <div className="table-container">
                <table className="tracker-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Brother Name</th>
                      <th>Email Sent</th>
                      <th>1:1 Completed</th>
                      <th>Thank You Sent</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {networkingOneOnOnes.map((oneOnOne, index) => (
                      <tr key={oneOnOne._id}>
                        <td>{index + 1}</td>
                        <td>{oneOnOne.brotherId?.name || oneOnOne.contactName || 'N/A'}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={oneOnOne.emailSent}
                            onChange={(e) => handleCheckboxChange(oneOnOne._id, 'emailSent', e.target.checked)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={oneOnOne.completed}
                            onChange={(e) => handleCheckboxChange(oneOnOne._id, 'completed', e.target.checked)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={oneOnOne.thankYouSent}
                            onChange={(e) => handleCheckboxChange(oneOnOne._id, 'thankYouSent', e.target.checked)}
                          />
                        </td>
                        <td>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteOneOnOne(oneOnOne._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {networkingOneOnOnes.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                          No networking 1:1s yet. Click "Add Networking" to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="brother-section">
              <div className="section-header">
                <h3>Brotherhood (Total: {brotherhoodOneOnOnes.length})</h3>
                <button 
                  className="btn-add"
                  onClick={() => {
                    setModalType('brotherhood');
                    setShowAddModal(true);
                  }}
                >
                  + Add Brotherhood
                </button>
              </div>
              <div className="table-container">
                <table className="tracker-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Brother Name</th>
                      <th>Email Sent</th>
                      <th>1:1 Completed</th>
                      <th>Thank You Sent</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brotherhoodOneOnOnes.map((oneOnOne, index) => (
                      <tr key={oneOnOne._id}>
                        <td>{index + 1}</td>
                        <td>{oneOnOne.brotherId?.name || oneOnOne.contactName || 'N/A'}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={oneOnOne.emailSent}
                            onChange={(e) => handleCheckboxChange(oneOnOne._id, 'emailSent', e.target.checked)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={oneOnOne.completed}
                            onChange={(e) => handleCheckboxChange(oneOnOne._id, 'completed', e.target.checked)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={oneOnOne.thankYouSent}
                            onChange={(e) => handleCheckboxChange(oneOnOne._id, 'thankYouSent', e.target.checked)}
                          />
                        </td>
                        <td>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteOneOnOne(oneOnOne._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {brotherhoodOneOnOnes.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                          No brotherhood 1:1s yet. Click "Add Brotherhood" to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alumni' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Alumni 1:1s (Total: {alumniOneOnOnes.length})</h2>
              <button 
                className="btn-add"
                onClick={() => {
                  setModalType('alumni');
                  setShowAddModal(true);
                }}
              >
                + Add Alumni 1:1
              </button>
            </div>
            <div className="table-container">
              <table className="tracker-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Coffee Chat</th>
                    <th>Thank You</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alumniOneOnOnes.map((oneOnOne, index) => (
                    <tr key={oneOnOne._id}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={oneOnOne.contactName || ''}
                          onChange={async (e) => {
                            await oneOnOneAPI.update(oneOnOne._id, { contactName: e.target.value });
                            setOneOnOnes(prev => prev.map(item => 
                              item._id === oneOnOne._id ? { ...item, contactName: e.target.value } : item
                            ));
                          }}
                          placeholder="Alumni name"
                          className="inline-input"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={oneOnOne.meetingDate ? new Date(oneOnOne.meetingDate).toISOString().split('T')[0] : ''}
                          onChange={async (e) => {
                            await oneOnOneAPI.update(oneOnOne._id, { meetingDate: e.target.value });
                            setOneOnOnes(prev => prev.map(item => 
                              item._id === oneOnOne._id ? { ...item, meetingDate: e.target.value } : item
                            ));
                          }}
                          className="inline-input"
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={oneOnOne.coffeeChat}
                          onChange={(e) => handleCheckboxChange(oneOnOne._id, 'coffeeChat', e.target.checked)}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={oneOnOne.thankYouSent}
                          onChange={(e) => handleCheckboxChange(oneOnOne._id, 'thankYouSent', e.target.checked)}
                        />
                      </td>
                      <td>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteOneOnOne(oneOnOne._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {alumniOneOnOnes.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                        No alumni 1:1s yet. Click "Add Alumni 1:1" to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'industry' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Industry 1:1s (Total: {industryOneOnOnes.length})</h2>
              <button 
                className="btn-add"
                onClick={() => {
                  setModalType('industry');
                  setShowAddModal(true);
                }}
              >
                + Add Industry 1:1
              </button>
            </div>
            <div className="table-container">
              <table className="tracker-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Coffee Chat</th>
                    <th>Thank You</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {industryOneOnOnes.map((oneOnOne, index) => (
                    <tr key={oneOnOne._id}>
                      <td>{index + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={oneOnOne.contactName || ''}
                          onChange={async (e) => {
                            await oneOnOneAPI.update(oneOnOne._id, { contactName: e.target.value });
                            setOneOnOnes(prev => prev.map(item => 
                              item._id === oneOnOne._id ? { ...item, contactName: e.target.value } : item
                            ));
                          }}
                          placeholder="Contact name"
                          className="inline-input"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={oneOnOne.meetingDate ? new Date(oneOnOne.meetingDate).toISOString().split('T')[0] : ''}
                          onChange={async (e) => {
                            await oneOnOneAPI.update(oneOnOne._id, { meetingDate: e.target.value });
                            setOneOnOnes(prev => prev.map(item => 
                              item._id === oneOnOne._id ? { ...item, meetingDate: e.target.value } : item
                            ));
                          }}
                          className="inline-input"
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={oneOnOne.coffeeChat}
                          onChange={(e) => handleCheckboxChange(oneOnOne._id, 'coffeeChat', e.target.checked)}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={oneOnOne.thankYouSent}
                          onChange={(e) => handleCheckboxChange(oneOnOne._id, 'thankYouSent', e.target.checked)}
                        />
                      </td>
                      <td>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteOneOnOne(oneOnOne._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {industryOneOnOnes.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                        No industry 1:1s yet. Click "Add Industry 1:1" to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="tab-content">
            <h2>Weekly Requirements Tracker</h2>
            <div className="table-container">
              <table className="tracker-table">
                <thead>
                  <tr>
                    <th>Due Date</th>
                    <th># of Networking</th>
                    <th># of Brotherhood</th>
                    <th>Alumni 1:1</th>
                    <th>Industry 1:1</th>
                    <th>Paddle Tasks</th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyRequirements.map((week) => {
                    const weekStart = new Date(week.weekStartDate).toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: '2-digit'});
                    return (
                      <tr key={week._id}>
                        <td>{weekStart}</td>
                        <td>{week.requirements.networking}</td>
                        <td>{week.requirements.brotherhood}</td>
                        <td>{week.requirements.alumni}</td>
                        <td>{week.requirements.industry}</td>
                        <td>{week.requirements.paddleTasks}</td>
                      </tr>
                    );
                  })}
                  {weeklyRequirements.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>
                        No weekly requirements set yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'paddle' && (
          <div className="tab-content">
            <h2>Paddle Task Tracker</h2>
            <div className="table-container">
              <table className="tracker-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Task 1 Completed</th>
                    <th>Task 2 Completed</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {paddleTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{new Date(task.weekDate).toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: '2-digit'})}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={task.task1Completed}
                          onChange={(e) => handlePaddleTaskUpdate(task._id, 'task1Completed', e.target.checked)}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={task.task2Completed}
                          onChange={(e) => handlePaddleTaskUpdate(task._id, 'task2Completed', e.target.checked)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={task.task1Notes || ''}
                          onChange={(e) => handlePaddleTaskUpdate(task._id, 'task1Notes', e.target.value)}
                          placeholder="Add notes..."
                          className="inline-input"
                        />
                      </td>
                    </tr>
                  ))}
                  {paddleTasks.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>
                        No paddle tasks yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddOneOnOneModal
          type={modalType}
          brothers={modalType === 'networking' ? networkingBrothers : modalType === 'brotherhood' ? brotherhoodBrothers : []}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddOneOnOne}
        />
      )}
    </div>
  );
}

function AddOneOnOneModal({ type, brothers, onClose, onAdd }) {
  const [selectedBrother, setSelectedBrother] = useState('');
  const [contactName, setContactName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (type === 'networking' || type === 'brotherhood') {
      if (selectedBrother) {
        onAdd(type, selectedBrother, null);
      } else if (contactName) {
        onAdd(type, null, contactName);
      }
    } else {
      if (contactName) {
        onAdd(type, null, contactName);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Add {type.charAt(0).toUpperCase() + type.slice(1)} 1:1</h3>
        <form onSubmit={handleSubmit}>
          {(type === 'networking' || type === 'brotherhood') && (
            <>
              <div className="form-group">
                <label>Select Brother</label>
                <select 
                  value={selectedBrother} 
                  onChange={(e) => setSelectedBrother(e.target.value)}
                >
                  <option value="">-- Select a brother --</option>
                  {brothers.map(brother => (
                    <option key={brother._id} value={brother._id}>
                      {brother.name}
                    </option>
                  ))}
                </select>
              </div>
              <p style={{textAlign: 'center', margin: '1rem 0'}}>OR</p>
            </>
          )}
          <div className="form-group">
            <label>{type === 'alumni' || type === 'industry' ? 'Contact Name' : 'Enter Name Manually'}</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter name"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={!selectedBrother && !contactName}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OneOnOneTracker;

