import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Courses from './pages/Courses';
import Progress from './pages/Progress';
import FocusMode from './pages/FocusMode';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" /> : <Login />
      } />
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/" /> : <Register />
      } />

      {/* Routes protégées */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="courses" element={<Courses />} />
        <Route path="progress" element={<Progress />} />
        <Route path="focus" element={<FocusMode />} />
      </Route>
    </Routes>
  );
}

export default App;
