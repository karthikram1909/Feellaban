import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Login } from './components/Login';

function App() {
  const [currentView, setCurrentView] = useState<'login' | 'dashboard'>('login');

  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login 
            onLogin={() => setCurrentView('dashboard')} 
          />
        );
      case 'dashboard':
        return <Dashboard onLogout={() => setCurrentView('login')} />;
      default:
        return <Login onLogin={() => setCurrentView('dashboard')} />;
    }
  };

  return (
    <ErrorBoundary>
      {renderView()}
    </ErrorBoundary>
  );
}

export default App;
