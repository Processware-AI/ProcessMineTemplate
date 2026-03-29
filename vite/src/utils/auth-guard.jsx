import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

// project imports
import { useAuth } from 'contexts/AuthContext';
import Loader from 'ui-component/Loader';

// ==============================|| AUTH GUARD ||============================== //

/**
 * AuthGuard - 인증되지 않은 사용자를 로그인 페이지로 리디렉션합니다.
 */
export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/pages/login" state={{ from: location }} replace />;
  }

  return children;
}

AuthGuard.propTypes = {
  children: PropTypes.node
};
