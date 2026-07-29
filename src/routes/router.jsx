import { Navigate, Route, Routes } from 'react-router-dom';

// import AuthLayout from '@/layouts/AuthLayout'
import { appRoutes, authRoutes } from '@/routes/index';
import { useAuthContext } from '@/context/useAuthContext';
import { useAuth } from '@/hooks/useAuth';
import { isPathAllowedForRole } from '@/routes/roleAccess';
import { ROLES } from '@/assets/data/roles';
import OtherLayout from '@/layout/OtherLayout';
import AdminLayout from '@/layout/AdminLayout';

const getLandingPath = (role) => {
  if (role === ROLES.SELLER) return '/seller/dashboard';
  if (role === ROLES.WAREHOUSE) return '/warehouse/dashboard';
  return '/dashboard';
};

const AppRouter = props => {
  const {
    isAuthenticated
  } = useAuthContext();
  const { role } = useAuth();
  const renderAppElement = (route) => {
    if (!isAuthenticated) {
      return <Navigate to={{
        pathname: '/auth/sign-in',
        search: 'redirectTo=' + route.path
      }} />;
    }
    if (!isPathAllowedForRole(role, route.path)) {
      return <Navigate to={getLandingPath(role)} replace />;
    }
    return <AdminLayout {...props}>{route.element}</AdminLayout>;
  };
  return <Routes>
      {(authRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={<OtherLayout {...props}>{route.element}</OtherLayout>} />)}

      {(appRoutes || []).map((route, idx) => <Route key={idx + route.name} path={route.path} element={renderAppElement(route)} />)}
    </Routes>;
};
export default AppRouter;