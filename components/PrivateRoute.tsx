
import React from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // MVP LIVRE: No restrictions.
  return <>{children}</>;
};
