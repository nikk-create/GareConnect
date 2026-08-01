import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { AppLayout } from '@/components/gare/AppLayout';
import { Header } from '@/components/gare/Header';
import { SmsBubble } from '@/components/gare/SmsBubble';
import { Card, CardContent } from '@/components/ui/card';
import { Alerte } from '@/api/entities';
import { formatFCFA } from '@/lib/utils';

const TYPES = ['tous', 'depart', 'retard', 'arrivee', 'sans_nouvelles', 'incident', 'sms'];

export default function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const [filtre, setFiltre] = useState('tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { setAlertes(await Alerte.list('-created_at', 150)); } finally { setLoading(false); }
    })();
  }, []);

  const filtered = filtre === 'tous' ? alertes : alertes.filter((a) => a.type === filtre);
  const coutTotal = alertes.reduce((sum, a) => sum + (a.cout_sms || 0), 0);

  return (
    <AppLayout>
      <Header title="Alertes SMS" subtitle={`${alertes.length} envoyées · ${formatFCFA(coutTotal)}`} />
      <div className="px-5 -mt-4 space-y-4 pt-2">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFiltre(t)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border capitalize ${filtre === t ? 'bg-encre text-papier border-encre' : 'border-encre/10 text-encre/50'}`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <Card>
          <CardContent className="py-2">
            {loading ? (
              <p className="text-sm text-encre/40 text-center py-8">Chargement...</p>
            ) : filtered.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-encre/20 mx-auto mb-2" />
                <p className="text-sm text-encre/40">Aucune alerte pour ce filtre.</p>
              </div>
            ) : (
              filtered.map((a) => <SmsBubble key={a.id} alerte={a} />)
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
