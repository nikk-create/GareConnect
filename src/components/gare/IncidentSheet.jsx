import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Incident } from '@/api/entities';
import { useGare } from '@/lib/GareContext';

const TYPES = ['panne', 'accident', 'retard_majeur', 'passager_malade', 'route_bloquee', 'autre'];
const GRAVITES = ['faible', 'moyen', 'grave', 'critique'];

export function IncidentSheet({ open, onClose, voyage, onCreated }) {
  const { addToast } = useGare() || {};
  const [form, setForm] = useState({ type_incident: 'panne', description: '', gravite: 'moyen' });
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!form.description) return;
    setSaving(true);
    try {
      const created = await Incident.create({
        ...form,
        voyage_id: voyage?.id,
        destination: voyage?.destination,
        code_voyage: voyage?.code_voyage,
      });
      addToast?.('Incident signalé');
      onCreated?.(created);
      onClose();
    } catch (e) {
      addToast?.("Erreur lors de l'enregistrement", 'warn');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={`Signaler un incident — ${voyage?.destination || ''}`}>
      <div className="space-y-4">
        <div>
          <Label>Type d'incident</Label>
          <Select value={form.type_incident} onChange={(e) => setForm({ ...form, type_incident: e.target.value })}>
            {TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </Select>
        </div>
        <div>
          <Label>Gravité</Label>
          <Select value={form.gravite} onChange={(e) => setForm({ ...form, gravite: e.target.value })}>
            {GRAVITES.map((g) => <option key={g} value={g}>{g}</option>)}
          </Select>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Décrivez ce qui s'est passé..." />
        </div>
        <Button className="w-full" onClick={submit} disabled={saving}>
          {saving ? 'Enregistrement...' : 'Signaler l\'incident'}
        </Button>
      </div>
    </BottomSheet>
  );
}
