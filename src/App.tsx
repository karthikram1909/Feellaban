import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './components/Login';
import { setupAxiosInterceptors } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard'>(() => {
    return localStorage.getItem('feellaban_session') === 'true' ? 'dashboard' : 'login';
  });

  useEffect(() => {
    setupAxiosInterceptors(() => {
      alert('Your session has expired. Please login again.');
      localStorage.removeItem('feellaban_session');
      setCurrentView('login');
    });
  }, []);

  const handleLogin = () => {
    localStorage.setItem('feellaban_session', 'true');
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('feellaban_session');
    setCurrentView('login');
  };

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login 
            onLogin={handleLogin} 
          />
        );
      case 'dashboard':
        return <Dashboard onLogout={handleLogout} />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <ErrorBoundary>
      {renderView()}
    </ErrorBoundary>
  );
}

export default App;
