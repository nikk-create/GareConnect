import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const [status, setStatus] = useState('loading'); // loading | ok | denied | unauth
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    base44.auth.me()
      .then((u) => {
        if (!mounted) return;
        setUser(u);
        setStatus(adminOnly && u.role !== 'admin' ? 'denied' : 'ok');
      })
      .catch(() => mounted && setStatus('unauth'));
    return () => { mounted = false; };
  }, [adminOnly]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (status === 'unauth') return <Navigate to="/login" replace />;
  if (status === 'denied') return <Navigate to="/" replace />;
  return children;
}
