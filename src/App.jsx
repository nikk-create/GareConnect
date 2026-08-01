import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ui/ProtectedRoute';

import Accueil from '@/pages/Accueil';
import Departs from '@/pages/Departs';
import Incidents from '@/pages/Incidents';
import Alertes from '@/pages/Alertes';
import GestionVehicules from '@/pages/GestionVehicules';
import ListePassagers from '@/pages/ListePassagers';
import Profil from '@/pages/Profil';
import TicketPage from '@/pages/TicketPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import PageNotFound from '@/pages/PageNotFound';

// Carte (Leaflet) et Stats (Recharts) sont lourdes : on les charge à la demande
// pour ne pas alourdir le premier chargement de l'app.
const Carte = lazy(() => import('@/pages/Carte'));
const Stats = lazy(() => import('@/pages/Stats'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-papier">
      <div className="w-8 h-8 border-2 border-ciel border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
      <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
      <Route path="/ticket" element={<TicketPage />} />

      <Route path="/" element={<ProtectedRoute><Accueil /></ProtectedRoute>} />
      <Route path="/departs" element={<ProtectedRoute><Departs /></ProtectedRoute>} />
      <Route path="/incidents" element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
      <Route path="/alertes" element={<ProtectedRoute><Alertes /></ProtectedRoute>} />
      <Route path="/carte" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Carte /></Suspense></ProtectedRoute>} />
      <Route path="/stats" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><Stats /></Suspense></ProtectedRoute>} />
      <Route path="/vehicules" element={<ProtectedRoute adminOnly><GestionVehicules /></ProtectedRoute>} />
      <Route path="/passagers" element={<ProtectedRoute><ListePassagers /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
