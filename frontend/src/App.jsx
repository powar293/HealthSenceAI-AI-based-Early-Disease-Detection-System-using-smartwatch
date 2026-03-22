import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Sidebar from './components/Sidebar';

function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Allow other components to trigger a re-render by dispatching a custom event
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('auth-change', checkAuthStatus);
    return () => window.removeEventListener('auth-change', checkAuthStatus);
  }, []);

  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen font-sans text-slate-800">
        {isAuthenticated && <Sidebar onLogout={() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }} />}
        
        <main className={`flex-1 w-full ${isAuthenticated ? 'p-4 md:p-8 ml-0 md:ml-64' : ''} overflow-y-auto transition-all duration-300`}>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login setAuth={setIsAuthenticated} />
            } />
            <Route path="/" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/contacts" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Contacts />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
