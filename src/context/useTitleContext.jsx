import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'react-router-dom';

const TitleContext = createContext(undefined);
export const TitleProvider = ({
  children
}) => {
  const { role } = useAuth();
  const [title, setTitle] = useState('WELCOME!');
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    if (role) {
      // We don't necessarily need to set title state to role if we override it in value
      // but keeping the effect for consistency if logic changes
    }
  }, [role]);

  return <TitleContext.Provider value={{
    title: (isDashboard && role) ? role : title,
    setTitle
  }}>{children}</TitleContext.Provider>;
};
export const useTitle = () => {
  const context = useContext(TitleContext);
  if (context === undefined) {
    throw new Error('useTitle must be used within a TitleProvider');
  }
  return context;
};