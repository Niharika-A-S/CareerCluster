import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Starfield from './components/Starfield';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Interests from './pages/Interests';
import Mentors from './pages/Mentors';
import MentorDetails from './pages/MentorDetails';
import Profile from './pages/Profile';
import ChatPage from './pages/Chat';
import Create from './pages/Create';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import ProtectedRoute, { RoleRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col text-white relative">
          <Starfield />
          
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/interests" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
                <Route path="/mentors" element={<Mentors />} />
                <Route path="/mentor/:id" element={<MentorDetails />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/create" element={<RoleRoute allowRoles={['mentor']}><Create /></RoleRoute>} />
                <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
                <Route path="/groups/:id" element={<ProtectedRoute><GroupDetails /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
