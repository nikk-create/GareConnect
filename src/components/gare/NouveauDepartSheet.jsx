import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Voyage } from '@/api/entities';
import { useGare } from '@/lib/GareContext';
import { genererCodeVoyage } from '@/lib/utils';

export function NouveauDepartSheet({ open, onClose, onCreated }) {
  const { addToast } = useGare() || {};
  const [form, setForm] = useState({
    destination: '', origine: 'Cotonou', heure_depart: '', date_depart: '',
    places_total: 50, chauffeur: '', vehicule: '', prix: '',
  });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    if (!form.destination || !form.heure_depart || !form.chauffeur) return;
    setSaving(true);
    try {
      const created = await Voyage.create({
        ...form,
        places_total: Number(form.places_total),
        prix: form.prix ? Number(form.prix) : null,
        code_voyage: genererCodeVoyage(),
        statut: 'planifie',
      });
      addToast?.('Départ créé avec succès');
      onCreated?.(created);
      onClose();
    } catch (e) {
      addToast?.('Erreur lors de la création', 'warn');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Nouveau départ">
      <div className="space-y-3">
        <div><Label>Destination</Label><Input value={form.destination} onChange={set('destination')} placeholder="Ex: Parakou" /></div>
        <div><Label>Origine</Label><Input value={form.origine} onChange={set('origine')} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Date</Label><Input type="date" value={form.date_depart} onChange={set('date_depart')} /></div>
          <div><Label>Heure</Label><Input type="time" value={form.heure_depart} onChange={set('heure_depart')} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Places totales</Label><Input type="number" value={form.places_total} onChange={set('places_total')} /></div>
          <div><Label>Prix (FCFA)</Label><Input type="number" value={form.prix} onChange={set('prix')} /></div>
        </div>
        <div><Label>Chauffeur</Label><Input value={form.chauffeur} onChange={set('chauffeur')} /></div>
        <div><Label>Véhicule (immatriculation)</Label><Input value={form.vehicule} onChange={set('vehicule')} /></div>
        <Button className="w-full" onClick={submit} disabled={saving}>
          {saving ? 'Création...' : 'Créer le départ'}
        </Button>
      </div>
    </BottomSheet>
  );
}
