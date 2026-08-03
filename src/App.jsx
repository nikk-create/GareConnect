import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/gare/AppLayout';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import TicketPage from '@/pages/TicketPage';

import Accueil from '@/pages/Accueil';
import Departs from '@/pages/Departs';
import Incidents from '@/pages/Incidents';
import Alertes from '@/pages/Alertes';
import GestionVehicules from '@/pages/GestionVehicules';
import ListePassagers from '@/pages/ListePassagers';
import Profil from '@/pages/Profil';

import PageNotFound from '@/lib/PageNotFound';

// Carte (Leaflet) et Stats (Recharts) sont lourdes : chargées à la demande.
const Carte = lazy(() => import('@/pages/Carte'));
const Stats = lazy(() => import('@/pages/Stats'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Protected({ children, adminOnly }) {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Auth (publiques) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* App (protégées, avec Header + BottomNav) */}
      <Route path="/" element={<Protected><Accueil /></Protected>} />
      <Route path="/departs" element={<Protected><Departs /></Protected>} />
      <Route path="/carte" element={<Protected><Suspense fallback={<PageLoader />}><Carte /></Suspense></Protected>} />
      <Route path="/incidents" element={<Protected><Incidents /></Protected>} />
      <Route path="/alertes" element={<Protected><Alertes /></Protected>} />
      <Route path="/gestion-vehicules" element={<Protected adminOnly><GestionVehicules /></Protected>} />
      <Route path="/liste-passagers" element={<Protected><ListePassagers /></Protected>} />
      <Route path="/profil" element={<Protected><Profil /></Protected>} />
      <Route path="/stats" element={<Protected><Suspense fallback={<PageLoader />}><Stats /></Suspense></Protected>} />
      <Route path="/ticket" element={<Protected><TicketPage /></Protected>} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
