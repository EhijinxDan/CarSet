import React from 'react';
import { Edit3, Trash2, Check, Calendar } from 'lucide-react';
import { getPriorityColor, getStatusColor, getCategoryIcon } from '../../utils/taskHelpers';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete, onComplete }) => {
  const CategoryIcon = getCategoryIcon(task.category);

  const priorityClass = {
    High: 'priority-high',
    Medium: 'priority-medium',
    Low: 'priority-low',
  }[task.priority] || 'priority-default';

  const statusClass = {
    Pending: 'status-pending',
    'In Progress': 'status-inprogress',
    Completed: 'status-completed',
  }[task.status] || 'status-default';

  return (
    <div className="task-card">
      <div className="task-header">
        <div className="category">
          <CategoryIcon className="icon" />
          <span>{task.category}</span>
        </div>
        <div>
          <button
            onClick={() => onEdit(task)}
            className="icon-btn"
            aria-label="Edit task"
          >
            <Edit3 className="icon" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="icon-btn delete"
            aria-label="Delete task"
          >
            <Trash2 className="icon" />
          </button>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      <p className="task-description">{task.description}</p>

      <div className="task-header" style={{ justifyContent: 'flex-start', gap: '8px', marginBottom: '16px' }}>
        <span className={`badge ${priorityClass}`}>{task.priority}</span>
        <span className={`badge ${statusClass}`}>{task.status}</span>
      </div>

      <div className="task-footer">
        <div className="due-date">
          <Calendar className="icon" />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
        </div>

        {task.status !== 'Completed' && (
          <button
            onClick={() => onComplete(task)}
            className="complete-btn"
          >
            <Check className="icon" />
            <span>Complete</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
