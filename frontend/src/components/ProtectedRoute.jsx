import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('secretToken');

  if (!token) {
    return <Navigate to="/secret-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
