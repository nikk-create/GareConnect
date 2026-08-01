import React, { createContext, useContext, useState, useCallback } from 'react';

const GareContext = createContext(null);

export function GareProvider({ children }) {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingQueue, setPendingQueue] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);
  const [sheetData, setSheetData] = useState(null);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const toggleOffline = useCallback(() => {
    setIsOffline(prev => {
      const next = !prev;
      addToast(next ? 'Mode hors-ligne activé' : 'Connexion rétablie — synchronisation...', next ? 'warn' : 'success');
      return next;
    });
  }, [addToast]);

  const addToPending = useCallback((action) => {
    setPendingQueue(prev => [...prev, { ...action, id: Date.now(), timestamp: new Date().toISOString(), status: 'pending' }]);
  }, []);

  const syncQueue = useCallback(() => {
    setPendingQueue(prev => prev.map(item => ({ ...item, status: 'synced' })));
    addToast('Synchronisation terminée !', 'success');
    setTimeout(() => setPendingQueue([]), 2000);
  }, [addToast]);

  const openSheet = useCallback((name, data = null) => {
    setActiveSheet(name);
    setSheetData(data);
  }, []);

  const closeSheet = useCallback(() => {
    setActiveSheet(null);
    setSheetData(null);
  }, []);

  return (
    <GareContext.Provider value={{
      isOffline, toggleOffline,
      pendingQueue, addToPending, syncQueue,
      toasts, addToast,
      activeSheet, sheetData, openSheet, closeSheet,
    }}>
      {children}
    </GareContext.Provider>
  );
}

export const useGare = () => useContext(GareContext);
