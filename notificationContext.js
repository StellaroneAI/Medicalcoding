import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import { useAuth } from './AuthContext';

export const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children, app }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!app || !user) return;
    
    const messaging = getMessaging(app);
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Notification received:', payload);
      setNotifications(prev => [
        {
          id: Date.now(),
          title: payload.notification.title,
          body: payload.notification.body,
        },
        ...prev
      ]);
    });
    
    return () => unsubscribe();
  }, [app, user]);

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearNotification }}>
      {/* You can add a visual component here to display notifications */}
      {children}
    </NotificationContext.Provider>
  );
};