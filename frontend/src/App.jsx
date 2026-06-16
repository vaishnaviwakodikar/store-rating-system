import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import StoreListPage from './pages/StoreListPage';
import OwnerDashboard from './pages/OwnerDashboard';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={
        user ? (
          user.role === 'admin' ? <Navigate to="/admin/dashboard" /> :
          user.role === 'store_owner' ? <Navigate to="/owner/dashboard" /> :
          <Navigate to="/stores" />
        ) : <Navigate to="/login" />
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/stores" element={
        <ProtectedRoute roles={['user']}>
          <Layout><StoreListPage /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/owner/dashboard" element={
        <ProtectedRoute roles={['store_owner']}>
          <Layout><OwnerDashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/change-password" element={
        <ProtectedRoute roles={['admin', 'user', 'store_owner']}>
          <Layout><ChangePasswordPage /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;