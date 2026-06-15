import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import CourierPage from './pages/CourierPage';
import AdminDashboard from './pages/AdminDashboard';
import TicketsPage from './pages/TicketsPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orders" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <OrdersPage />
          </ProtectedRoute>
        }/>
        <Route path="/tickets" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <TicketsPage />
          </ProtectedRoute>
        }/>
        <Route path="/track/:orderId" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <TrackOrderPage />
          </ProtectedRoute>
        }/>
        <Route path="/courier" element={
          <ProtectedRoute allowedRoles={['Courier']}>
            <CourierPage />
          </ProtectedRoute>
        }/>
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;