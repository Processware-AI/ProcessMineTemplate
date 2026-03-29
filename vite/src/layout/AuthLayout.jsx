import { Outlet } from 'react-router-dom';
import { AuthProvider } from 'contexts/AuthContext';

// ==============================|| AUTH LAYOUT - wraps all routes with AuthProvider ||============================== //

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
