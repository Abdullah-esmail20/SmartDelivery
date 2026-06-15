import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

// ✅ يحمي الصفحات من الدخول بدون صلاحية
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;