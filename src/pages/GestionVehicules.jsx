import React, { useEffect, useState } from 'react';
import { Plus, Car } from 'lucide-react';
import { AppLayout } from '@/components/gare/AppLayout';
import { Header } from '@/components/gare/Header';
import { StatusBadge } from '@/components/gare/StatusBadge';
import { BottomSheet } from '@/components/gare/BottomSheet';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Vehicule } from '@/api/entities';
import { useGare } from '@/lib/GareContext';

export default function GestionVehicules() {
  const { addToast } = useGare() || {};
  const [vehicules, setVehicules] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ immatriculation: '', marque: '', modele: '', capacite: 50, statut: 'actif', chauffeur_attitre: '' });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setVehicules(await Vehicule.list('-created_at', 100)); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.immatriculation || !form.capacite) return;
    try {
      await Vehicule.create({ ...form, capacite: Number(form.capacite) });
      addToast?.('Véhicule ajouté');
      setShowNew(false);
      setForm({ immatriculation: '', marque: '', modele: '', capacite: 50, statut: 'actif', chauffeur_attitre: '' });
      load();
    } catch {
      addToast?.("Erreur lors de l'ajout", 'warn');
    }
  };

  return (
    <AppLayout>
      <Header title="Véhicules" subtitle={`${vehicules.length} véhicule(s) enregistré(s)`} />
      <div className="px-5 -mt-4 space-y-4 pt-2">
        <Button className="w-full" onClick={() => setShowNew(true)}><Plus className="w-4 h-4" /> Ajouter un véhicule</Button>

        {loading ? (
          <p className="text-sm text-encre/40 text-center py-8">Chargement...</p>
        ) : (
          <div className="space-y-3">
            {vehicules.map((v) => (
              <Card key={v.id}>
                <CardContent className="py-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-ciel/10 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-ciel" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-encre">{v.immatriculation}</p>
                    <p className="text-xs text-encre/50">{v.marque} {v.modele} · {v.capacite} places · {v.chauffeur_attitre || 'Sans chauffeur attitré'}</p>
                  </div>
                  <StatusBadge status={v.statut} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomSheet open={showNew} onClose={() => setShowNew(false)} title="Nouveau véhicule">
        <div className="space-y-3">
          <div><Label>Immatriculation</Label><Input value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Marque</Label><Input value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} /></div>
            <div><Label>Modèle</Label><Input value={form.modele} onChange={(e) => setForm({ ...form, modele: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Capacité</Label><Input type="number" value={form.capacite} onChange={(e) => setForm({ ...form, capacite: e.target.value })} /></div>
            <div>
              <Label>Statut</Label>
              <Select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                <option value="actif">Actif</option>
                <option value="maintenance">Maintenance</option>
                <option value="hors_service">Hors service</option>
              </Select>
            </div>
          </div>
          <div><Label>Chauffeur attitré</Label><Input value={form.chauffeur_attitre} onChange={(e) => setForm({ ...form, chauffeur_attitre: e.target.value })} /></div>
          <Button className="w-full" onClick={submit}>Enregistrer</Button>
        </div>
      </BottomSheet>
    </AppLayout>
  );
}
