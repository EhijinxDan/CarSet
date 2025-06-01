import { Users, Settings, FileText, AlertCircle } from 'lucide-react';

// Get color classes for priority badges
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-800 border-red-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Get color classes for status badges
export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Get icon component for task categories
export const getCategoryIcon = (category) => {
  switch (category) {
    case 'Driver Onboarding': return Users;
    case 'Vehicle Maintenance': return Settings;
    case 'Contract Verification': return FileText;
    case 'System Management': return Settings;
    default: return AlertCircle;
  }
};

// Filter tasks based on criteria
export const filterTasks = (tasks, filters) => {
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
  
  // Sort by due date
  filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  return filtered;
};