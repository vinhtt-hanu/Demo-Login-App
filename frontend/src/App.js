import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
  };

  const handleRegister = (token) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCurrentView('login');
  };

  if (isLoggedIn) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to the Demo Login App!</h1>
          <p>You are successfully logged in.</p>
          <button onClick={handleLogout}>Logout</button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Demo Login App</h1>
        <div className="auth-container">
          <div className="auth-tabs">
            <button
              className={currentView === 'login' ? 'active' : ''}
              onClick={() => setCurrentView('login')}
            >
              Login
            </button>
            <button
              className={currentView === 'register' ? 'active' : ''}
              onClick={() => setCurrentView('register')}
            >
              Register
            </button>
          </div>
          {currentView === 'login' ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Register onRegister={handleRegister} />
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
