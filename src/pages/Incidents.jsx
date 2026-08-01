import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/gare/AppLayout';
import { Header } from '@/components/gare/Header';
import { StatusBadge } from '@/components/gare/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Incident } from '@/api/entities';
import { notifierIncidentResolu } from '@/api/entities';
import { useGare } from '@/lib/GareContext';

const GRAVITE_COLOR = { faible: 'text-encre/40', moyen: 'text-or', grave: 'text-red-500', critique: 'text-red-600 font-bold' };

export default function Incidents() {
  const { addToast } = useGare() || {};
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try { setIncidents(await Incident.list('-created_at', 100)); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resoudre = async (incident) => {
    setResolvingId(incident.id);
    try {
      await Incident.update(incident.id, {
        statut_resolution: 'resolu',
        resolved_at: new Date().toISOString(),
      });
      const result = await notifierIncidentResolu(incident.id);
      await Incident.update(incident.id, { passengers_notified: true });
      addToast?.(`Incident résolu · ${result.notified_count} personne(s) notifiée(s)`);
      load();
    } catch (e) {
      addToast?.("Erreur lors de la résolution", 'warn');
    } finally {
      setResolvingId(null);
    }
  };

  const ouverts = incidents.filter((i) => i.statut_resolution !== 'resolu');
  const resolus = incidents.filter((i) => i.statut_resolution === 'resolu');

  return (
    <AppLayout>
      <Header title="Incidents" subtitle={`${ouverts.length} ouvert(s)`} />
      <div className="px-5 -mt-4 space-y-5 pt-2">
        {loading ? (
          <p className="text-sm text-encre/40 text-center py-8">Chargement...</p>
        ) : (
          <>
            <div className="space-y-3">
              {ouverts.length === 0 && <p className="text-sm text-encre/40 text-center py-6">Aucun incident ouvert. 🎉</p>}
              {ouverts.map((inc) => (
                <Card key={inc.id}>
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${GRAVITE_COLOR[inc.gravite]}`} />
                        <span className="font-medium text-encre capitalize">{inc.type_incident.replace('_', ' ')}</span>
                      </div>
                      <StatusBadge status={inc.statut_resolution} />
                    </div>
                    <p className="text-sm text-encre/60">{inc.description}</p>
                    <p className="text-xs text-encre/40">{inc.destination} · {inc.code_voyage}</p>
                    <Button size="sm" className="w-full mt-1" onClick={() => resoudre(inc)} disabled={resolvingId === inc.id}>
                      <CheckCircle2 className="w-4 h-4" /> {resolvingId === inc.id ? 'Résolution...' : 'Marquer résolu & notifier'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {resolus.length > 0 && (
              <div>
                <p className="text-xs text-encre/40 mb-2 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Résolus récemment</p>
                <div className="space-y-2">
                  {resolus.slice(0, 10).map((inc) => (
                    <div key={inc.id} className="flex items-center justify-between text-sm py-2 border-b border-encre/5">
                      <span className="text-encre/60">{inc.type_incident.replace('_', ' ')} · {inc.destination}</span>
                      <span className="text-emerald-600 text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Résolu</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
