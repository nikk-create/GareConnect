import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Users, AlertTriangle, Bell, Plus } from 'lucide-react';
import { AppLayout } from '@/components/gare/AppLayout';
import { Header } from '@/components/gare/Header';
import { MetricCard } from '@/components/gare/MetricCard';
import { VoyageCard } from '@/components/gare/VoyageCard';
import { RouteOptimizer } from '@/components/gare/RouteOptimizer';
import { DetailVoyageSheet } from '@/components/gare/DetailVoyageSheet';
import { NouveauDepartSheet } from '@/components/gare/NouveauDepartSheet';
import { Button } from '@/components/ui/button';
import { Voyage, Incident, Alerte } from '@/api/entities';
import { useAuth } from '@/lib/AuthContext';

export default function Accueil() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [voyages, setVoyages] = useState([]);
  const [incidentsOuverts, setIncidentsOuverts] = useState(0);
  const [alertesToday, setAlertesToday] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [v, inc, al] = await Promise.all([
        Voyage.list('-created_at', 50),
        Incident.filter({ statut_resolution: 'ouvert' }),
        Alerte.list('-created_at', 100),
      ]);
      setVoyages(v);
      setIncidentsOuverts(inc.length);
      setAlertesToday(al.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const enCours = voyages.filter((v) => !['arrive'].includes(v.statut));
  const totalPassagers = voyages.reduce((sum, v) => sum + (v.places_occupees || 0), 0);

  return (
    <AppLayout>
      <Header title={`Bonjour ${profile?.full_name?.split(' ')[0] || ''} 👋`} subtitle="Gare de Cotonou · aujourd'hui" />
      <div className="px-5 -mt-4 space-y-5 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard icon={Bus} label="Voyages actifs" value={enCours.length} accent="ciel" onClick={() => navigate('/departs')} />
          <MetricCard icon={Users} label="Passagers" value={totalPassagers} accent="menthe" />
          <MetricCard icon={AlertTriangle} label="Incidents ouverts" value={incidentsOuverts} accent="danger" />
          <MetricCard icon={Bell} label="Alertes SMS" value={alertesToday} accent="or" />
        </div>

        <RouteOptimizer voyages={voyages} />

        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-encre">Prochains départs</h2>
          <Button size="sm" onClick={() => setShowNew(true)}><Plus className="w-4 h-4" /> Départ</Button>
        </div>

        {loading ? (
          <p className="text-sm text-encre/40 text-center py-8">Chargement...</p>
        ) : voyages.length === 0 ? (
          <p className="text-sm text-encre/40 text-center py-8">Aucun voyage pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {voyages.slice(0, 6).map((v) => (
              <VoyageCard key={v.id} voyage={v} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      <DetailVoyageSheet open={!!selected} onClose={() => setSelected(null)} voyage={selected} onUpdated={load} />
      <NouveauDepartSheet open={showNew} onClose={() => setShowNew(false)} onCreated={load} />
    </AppLayout>
  );
}
