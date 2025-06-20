import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AccessToken {
  value: string;
  expiresAt: number;
}

interface PrivateRoutesProps {
  children: React.ReactNode;
}

export function PrivateRoutes({ children }: PrivateRoutesProps) {
  const location = useLocation();
  
  const storedValue = localStorage.getItem('access_token');
  
  if (!storedValue) {
    return <Navigate to="/auth/sign-in" replace state={{ from: location }} />;
  }

  let isAuth = false;

  try {
    const tokenData: AccessToken = JSON.parse(storedValue);
    const { expiresAt } = tokenData;
    const now = Date.now();
    const fiveMinutesInMs = 2 * 60 * 1000;

    if (expiresAt && expiresAt + fiveMinutesInMs > now) {
      isAuth = true;
    }
  } catch (error) {
    console.error('Error parsing access_token:', error);
  }

  return isAuth ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/sign-in" replace state={{ from: location }} />
  );
}