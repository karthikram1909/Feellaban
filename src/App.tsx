import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './components/Login';
import { Register } from './components/Register';

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login 
            onLogin={() => setCurrentView('dashboard')} 
            onNavigateToRegister={() => setCurrentView('register')} 
          />
        );
      case 'register':
        return (
          <Register 
            onNavigateToLogin={() => setCurrentView('login')} 
          />
        );
      case 'dashboard':
        return <Dashboard onLogout={() => setCurrentView('login')} />;
      default:
        return <Login onLogin={() => setCurrentView('dashboard')} onNavigateToRegister={() => setCurrentView('register')} />;
    }
  };

  return (
    <ErrorBoundary>
      {renderView()}
    </ErrorBoundary>
  );
}

export default App;
