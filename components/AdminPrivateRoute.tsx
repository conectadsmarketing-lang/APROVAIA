
import React from 'react';

interface AdminPrivateRouteProps {
  children: React.ReactNode;
}

export const AdminPrivateRoute: React.FC<AdminPrivateRouteProps> = ({ children }) => {
  // MVP LIVRE: No restrictions.
  return <>{children}</>;
};
