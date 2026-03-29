import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// ==============================|| ROLE HIERARCHY ||============================== //

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  STAFF: 'STAFF',
  CLUB_LEADER: 'CLUB_LEADER',
  MEMBER: 'MEMBER'
};

const ROLE_LEVEL = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.STAFF]: 3,
  [ROLES.CLUB_LEADER]: 2,
  [ROLES.MEMBER]: 1
};

/**
 * Check if userRole has at least the level of requiredRole.
 */
export function hasRole(userRole, requiredRole) {
  return (ROLE_LEVEL[userRole] ?? 0) >= (ROLE_LEVEL[requiredRole] ?? 99);
}

/**
 * Check if userRole is included in the allowedRoles array.
 */
export function hasAnyRole(userRole, allowedRoles) {
  return allowedRoles.includes(userRole);
}

// ==============================|| AUTH CONTEXT ||============================== //

const API_BASE = '/api/auth';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// ==============================|| AUTH PROVIDER ||============================== //

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user profile using stored token
  const fetchUser = useCallback(async (accessToken) => {
    try {
      const res = await fetch(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error('Unauthorized');
      const user = await res.json();
      setCurrentUser(user);
      return user;
    } catch {
      // Token expired or invalid
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      return null;
    }
  }, []);

  // On mount, verify existing token
  useEffect(() => {
    if (token) {
      fetchUser(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Login: POST /api/auth/login (OAuth2 form data)
  const login = useCallback(async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || '로그인에 실패했습니다.');
    }

    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
    return data;
  }, [fetchUser]);

  // Register: POST /api/auth/register
  const register = useCallback(async ({ email, username, password }) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || '회원가입에 실패했습니다.');
    }

    return await res.json();
  }, []);

  // Forgot password: POST /api/auth/forgot-password
  const forgotPassword = useCallback(async (email) => {
    const res = await fetch(`${API_BASE}/forgot-password?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || '요청 처리에 실패했습니다.');
    }

    return await res.json();
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  }, []);

  const isAuthenticated = Boolean(token && currentUser);
  const role = currentUser?.role || null;

  const value = useMemo(
    () => ({
      token,
      currentUser,
      role,
      isAuthenticated,
      loading,
      login,
      logout,
      register,
      forgotPassword,
      hasRole: (requiredRole) => hasRole(role, requiredRole),
      hasAnyRole: (allowedRoles) => hasAnyRole(role, allowedRoles)
    }),
    [token, currentUser, role, isAuthenticated, loading, login, logout, register, forgotPassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };

export default AuthContext;
