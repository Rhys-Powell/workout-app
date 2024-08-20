import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthHooks';
import { AuthContext } from './AuthProvider';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }: PrivateRouteProps) => {
  const context: React.ContextType<typeof AuthContext> = useAuth();
  const isAuthenticated = !!context?.token;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
