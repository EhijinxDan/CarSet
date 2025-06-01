console.log("User prop in TaskDashboard:");

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Clock, 
  AlertCircle, 
  Check, 
  Car, 
  User, 
  LogOut,
  Filter,
  Calendar,
  Edit3,
  Trash2,
  Users,
  Settings,
  FileText
} from 'lucide-react';
import mockAPI from '../../services/API.js';
import TaskModal from '../modals/TaskModal.jsx';
import TaskCard from './TaskCard';
import StatsCard from './StatsCard.jsx';
import FilterBar from './FilterBar';
import './Dashboard.css';

const TaskDashboard = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    priority: 'All',
    status: 'All',
    showCompleted: true
  });
  const [message, setMessage] = useState(null);

  const mockAPI = {
    getTasks: async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return [
        {
          id: 1,
          title: 'Onboard new driver - Michael Chen',
          category: 'Driver Onboarding',
          priority: 'High',
          status: 'Pending',
          dueDate: '2025-05-30',
          description: 'Complete background check and vehicle training'
        },
        {
          id: 2,
          title: 'Schedule maintenance for BMW X5',
          category: 'Vehicle Maintenance',
          priority: 'Medium',
          status: 'In Progress',
          dueDate: '2025-06-02',
          description: 'Regular service and safety inspection'
        },
        {
          id: 3,
          title: 'Verify rental contract - Johnson Wedding',
          category: 'Contract Verification',
          priority: 'High',
          status: 'Pending',
          dueDate: '2025-05-29',
          description: 'Review insurance documents and payment details'
        },
        {
          id: 4,
          title: 'Update fleet inventory system',
          category: 'System Management',
          priority: 'Low',
          status: 'Completed',
          dueDate: '2025-05-28',
          description: 'Add new vehicles to database'
        }
      ];
    },
    
    createTask: async (task) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...task, id: Date.now() };
    },
    
    updateTask: async (id, updates) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, ...updates };
    },
    
    deleteTask: async (id) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filters]);

  const loadTasks = async () => {
    try {
      const data = await mockAPI.getTasks();
      setTasks(data);
    } catch (error) {
      showMessage('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;
    
    if (filters.category !== 'All') {
      filtered = filtered.filter(task => task.category === filters.category);
    }
    
    if (filters.priority !== 'All') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    if (filters.status !== 'All') {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    
    if (!filters.showCompleted) {
      filtered = filtered.filter(task => task.status !== 'Completed');
    }
    
    filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    setFilteredTasks(filtered);
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await mockAPI.updateTask(editingTask.id, taskData);
        setTasks(tasks.map(task => 
          task.id === editingTask.id ? { ...task, ...taskData } : task
        ));
        showMessage('Task updated successfully');
      } else {
        const newTask = await mockAPI.createTask(taskData);
        setTasks([...tasks, newTask]);
        showMessage('Task created successfully');
      }
      setShowModal(false);
      setEditingTask(null);
    } catch (error) {
      showMessage('Failed to save task', 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await mockAPI.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
        showMessage('Task deleted successfully');
      } catch (error) {
        showMessage('Failed to delete task', 'error');
      }
    }
  };

  const handleCompleteTask = async (task) => {
    try {
      const updatedTask = { ...task, status: 'Completed' };
      await mockAPI.updateTask(task.id, updatedTask);
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      showMessage('Task marked as completed');
    } catch (error) {
      showMessage('Failed to update task', 'error');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Driver Onboarding': return <Users className="h-4 w-4" />;
      case 'Vehicle Maintenance': return <Settings className="h-4 w-4" />;
      case 'Contract Verification': return <FileText className="h-4 w-4" />;
      case 'System Management': return <Settings className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const TaskModal = ({ task, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: '',
      category: 'Driver Onboarding',
      priority: 'Medium',
      status: 'Pending',
      dueDate: '',
      description: ''
    });

    useEffect(() => {
      if (task) {
        setFormData(task);
      } else {
        setFormData({
          title: '',
          category: 'Driver Onboarding',
          priority: 'Medium',
          status: 'Pending',
          dueDate: '',
          description: ''
        });
      }
    }, [task]);

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
  <div className="modal-container">
    <div className="modal-content">
      <h2 className="modal-title">{task ? 'Edit Task' : 'Create New Task'}</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="form-select"
          >
            <option value="Driver Onboarding">Driver Onboarding</option>
            <option value="Vehicle Maintenance">Vehicle Maintenance</option>
            <option value="Contract Verification">Contract Verification</option>
            <option value="System Management">System Management</option>
            <option value="Customer Support">Customer Support</option>
          </select>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="form-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="form-select"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="form-textarea"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {task ? 'Update Task' : 'Create Task'}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
    );
  }

  return (
    <div className="app-container">
  <header className="header">
    <div className="header-inner">
      <div className="header-left">
        <Car className="icon-large blue-icon" />
        <div>
          <h1 className="title">CarSet Operations</h1>
          <p className="subtitle">Task Management Dashboard</p>
        </div>
      </div>
      <div className="header-right">
        <div className="user-info">
          <User className="icon-small gray-icon" />
          <div className="user-text">
            {user && <p className="user-name">{user.name}</p>}
            {user && <p className="user-role">{user.role}</p>}
          </div>
        </div>
        <button onClick={onLogout} className="logout-btn">
          <LogOut className="icon-small" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </header>

  {message && (
    <div className={`toast ${message.type === 'error' ? 'toast-error' : 'toast-success'}`}>
      {message.text}
    </div>
  )}

  <main className="main-content">
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon bg-blue-light">
          <Clock className="icon-medium blue-icon" />
        </div>
        <div className="stat-text">
          <p className="stat-label">Pending</p>
          <p className="stat-value">{tasks.filter(t => t.status === 'Pending').length}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon bg-yellow-light">
          <AlertCircle className="icon-medium yellow-icon" />
        </div>
        <div className="stat-text">
          <p className="stat-label">In Progress</p>
          <p className="stat-value">{tasks.filter(t => t.status === 'In Progress').length}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon bg-green-light">
          <Check className="icon-medium green-icon" />
        </div>
        <div className="stat-text">
          <p className="stat-label">Completed</p>
          <p className="stat-value">{tasks.filter(t => t.status === 'Completed').length}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <button onClick={() => setShowModal(true)} className="btn-primary btn-block">
          <Plus className="icon-small" />
          <span>New Task</span>
        </button>
      </div>
    </section>

    <section className="filters-section">
      <div className="filters-header">
        <Filter className="icon-small gray-icon" />
        <h3 className="filters-title">Filters</h3>
      </div>
      <div className="filters-grid">
        <div className="filter-item">
          <label htmlFor="category" className="filter-label">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={e => setFilters({...filters, category: e.target.value})}
            className="filter-select"
          >
            <option value="All">All Categories</option>
            <option value="Driver Onboarding">Driver Onboarding</option>
            <option value="Vehicle Maintenance">Vehicle Maintenance</option>
            <option value="Contract Verification">Contract Verification</option>
            <option value="System Management">System Management</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="priority" className="filter-label">Priority</label>
          <select
            id="priority"
            value={filters.priority}
            onChange={e => setFilters({...filters, priority: e.target.value})}
            className="filter-select"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="status" className="filter-label">Status</label>
          <select
            id="status"
            value={filters.status}
            onChange={e => setFilters({...filters, status: e.target.value})}
            className="filter-select"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-item checkbox-filter">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.showCompleted}
              onChange={e => setFilters({...filters, showCompleted: e.target.checked})}
            />
            <span>Show completed</span>
          </label>
        </div>
      </div>
    </section>

    <section className="tasks-grid">
      {filteredTasks.length === 0 && (
        <div className="no-tasks">
          <AlertCircle className="icon-large gray-icon" />
          <h3>No tasks found</h3>
          <p>Try adjusting your filters or create a new task.</p>
        </div>
      )}

      {filteredTasks.map(task => (
        <article key={task.id} className="task-card">
          <div className="task-header">
            <div className="task-category">
              {getCategoryIcon(task.category)}
              <span>{task.category}</span>
            </div>
            <div className="task-actions">
              <button
                onClick={() => { setEditingTask(task); setShowModal(true); }}
                className="btn-icon btn-edit"
              >
                <Edit3 className="icon-small" />
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="btn-icon btn-delete"
              >
                <Trash2 className="icon-small" />
              </button>
            </div>
          </div>

          <h3 className="task-title">{task.title}</h3>
          <p className="task-desc">{task.description}</p>

          <div className="task-tags">
            <span className={`tag tag-priority ${getPriorityColor(task.priority)}`}>{task.priority}</span>
            <span className={`tag tag-status ${getStatusColor(task.status)}`}>{task.status}</span>
          </div>

          <div className="task-footer">
            <div className="task-due-date">
              <Calendar className="icon-small" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            {task.status !== 'Completed' && (
              <button
                onClick={() => handleCompleteTask(task)}
                className="btn-complete"
              >
                <Check className="icon-small green-icon" />
                <span>Complete</span>
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  </main>

  <TaskModal
    task={editingTask}
    isOpen={showModal}
    onClose={() => {
      setShowModal(false);
      setEditingTask(null);
    }}
    onSave={handleSaveTask}
  />
  <footer className="footer-credit">
  Developed by <strong>EHIJINWA DANIEL-CLINTON</strong>
</footer>
</div>
  );
};

export default TaskDashboard;