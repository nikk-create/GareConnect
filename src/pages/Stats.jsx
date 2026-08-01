import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AppLayout } from '@/components/gare/AppLayout';
import { Header } from '@/components/gare/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Voyage, Ticket, Incident } from '@/api/entities';
import { formatFCFA } from '@/lib/utils';

const COLORS = ['#4C82F0', '#7FE0D3', '#F4B942', '#E5484D', '#9B8AFB'];

export default function Stats() {
  const [voyages, setVoyages] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    (async () => {
      const [v, t, i] = await Promise.all([Voyage.list('-created_at', 300), Ticket.list('-created_at', 300), Incident.list('-created_at', 300)]);
      setVoyages(v); setTickets(t); setIncidents(i);
    })();
  }, []);

  const parDestination = useMemo(() => {
    const map = {};
    for (const v of voyages) map[v.destination] = (map[v.destination] || 0) + 1;
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [voyages]);

  const parPaiement = useMemo(() => {
    const map = {};
    for (const t of tickets) map[t.moyen_paiement || 'especes'] = (map[t.moyen_paiement || 'especes'] || 0) + 1;
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [tickets]);

  const revenuTotal = tickets.reduce((sum, t) => sum + (t.montant || 0), 0);
  const tauxResolution = incidents.length ? Math.round((incidents.filter((i) => i.statut_resolution === 'resolu').length / incidents.length) * 100) : 100;

  return (
    <AppLayout>
      <Header title="Statistiques" subtitle="Vue d'ensemble de la gare" />
      <div className="px-5 -mt-4 space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <Card><CardContent className="py-4"><p className="text-2xl font-display font-semibold text-encre">{formatFCFA(revenuTotal)}</p><p className="text-xs text-encre/50">Revenu total billets</p></CardContent></Card>
          <Card><CardContent className="py-4"><p className="text-2xl font-display font-semibold text-encre">{tauxResolution}%</p><p className="text-xs text-encre/50">Taux résolution incidents</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Voyages par destination</CardTitle></CardHeader>
          <CardContent className="pt-0" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={parDestination}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#4C82F0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Moyens de paiement</CardTitle></CardHeader>
          <CardContent className="pt-0" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={parPaiement} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {parPaiement.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
