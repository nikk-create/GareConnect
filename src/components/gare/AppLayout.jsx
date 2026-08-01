import React from 'react';
import { BottomNav } from './BottomNav';
import { ToastContainer } from './ToastContainer';

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-papier pb-20">
      <ToastContainer />
      {children}
      <BottomNav />
    </div>
  );
}
