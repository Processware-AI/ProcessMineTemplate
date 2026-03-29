import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// project imports
import { useAuth } from 'contexts/AuthContext';
import Loader from 'ui-component/Loader';

// ==============================|| ROLE GUARD ||============================== //

/**
 * RoleGuard - 필요한 역할이 없는 사용자의 접근을 제한합니다.
 *
 * @param {string[]} allowedRoles - 접근이 허용된 역할 목록 (e.g., ['SUPER_ADMIN', 'STAFF'])
 * @param {string} minimumRole - 최소 역할 등급 (allowedRoles 대신 사용 가능)
 * @param {string} fallback - 권한 없을 때 리디렉션 경로 (기본값: '/dashboard')
 */
export default function RoleGuard({ children, allowedRoles, minimumRole, fallback = '/dashboard' }) {
  const { isAuthenticated, loading, role, hasRole, hasAnyRole } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/pages/login" replace />;
  }

  // Check by allowedRoles list
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to={fallback} replace />;
  }

  // Check by minimum role level
  if (minimumRole && !hasRole(minimumRole)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
}

RoleGuard.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  minimumRole: PropTypes.string,
  fallback: PropTypes.string
};
