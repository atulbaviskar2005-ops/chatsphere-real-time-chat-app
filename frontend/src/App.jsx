import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import GroupChat from './pages/GroupChat.jsx';
import Login from './pages/Login.jsx';
import PrivateChat from './pages/PrivateChat.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';
import SettingsPage from './pages/Settings.jsx';
import { useAuth } from './context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { token, booting } = useAuth();
  if (booting) return <div className="grid min-h-screen place-items-center bg-app text-white">Loading ChatSphere...</div>;
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/chat/:email" element={<ProtectedRoute><PrivateChat /></ProtectedRoute>} />
      <Route path="/rooms/:roomId" element={<ProtectedRoute><GroupChat /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
