import React, { useState, useEffect } from 'react';
import AuthPage from './components/auth/AuthPage.jsx';
import TaskDashboard from './components/dashboard/TaskDashboard.jsx';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    try {
      const storedUser = userData && userData !== 'undefined' ? JSON.parse(userData) : null;

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setToken('');
      }
    } catch (error) {
      console.error('Error parsing stored user:', error);
      setIsAuthenticated(false);
      setUser(null);
      setToken('');
    }
  }, []);

  const handleLogin = (authToken, userData) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setToken('');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div className="font-sans">
      {isAuthenticated ? (
        <TaskDashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
