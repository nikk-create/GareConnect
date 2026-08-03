import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bus, Plus, Pencil, Trash2, CheckCircle2, Wrench, XCircle, X } from 'lucide-react';

const statutConfig = {
  actif:       { label: 'Actif',       color: 'text-primary',     bg: 'bg-primary/10 border-primary/30' },
  maintenance: { label: 'Maintenance', color: 'text-warn',        bg: 'bg-warn/10 border-warn/30' },
  hors_service:{ label: 'Hors service',color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/30' },
};

const EMPTY = { immatriculation: '', marque: '', modele: '', capacite: '', annee: '', statut: 'actif', chauffeur_attitré: '', notes: '' };

function VehiculeForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-t-3xl border-t border-border/50 p-5 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-muted rounded-full mx-auto" />
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold font-outfit">{initial?.id ? 'Modifier le véhicule' : 'Nouveau véhicule'}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Immatriculation *</label>
            <input value={form.immatriculation} onChange={e => set('immatriculation', e.target.value)}
              placeholder="AB-1234-BJ" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-mono uppercase placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Marque</label>
            <input value={form.marque} onChange={e => set('marque', e.target.value)}
              placeholder="Toyota" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Modèle</label>
            <input value={form.modele} onChange={e => set('modele', e.target.value)}
              placeholder="Hiace" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Capacité *</label>
            <input type="number" value={form.capacite} onChange={e => set('capacite', e.target.value)}
              placeholder="18" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Année</label>
            <input type="number" value={form.annee} onChange={e => set('annee', e.target.value)}
              placeholder="2020" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Statut</label>
            <div className="flex gap-2">
              {Object.entries(statutConfig).map(([key, cfg]) => (
                <button type="button" key={key} onClick={() => set('statut', key)}
                  className={`flex-1 h-9 rounded-xl text-[11px] font-bold border transition-all ${form.statut === key ? cfg.bg + ' ' + cfg.color : 'bg-muted/30 text-muted-foreground border-border/30'}`}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Chauffeur attitré</label>
            <input value={form.chauffeur_attitré} onChange={e => set('chauffeur_attitré', e.target.value)}
              placeholder="Nom du chauffeur" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div className="col-span-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Informations supplémentaires..." rows={2}
              className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 h-11 rounded-2xl bg-muted text-muted-foreground text-sm font-bold">Annuler</button>
          <button
            onClick={() => { if (!form.immatriculation || !form.capacite) return; onSave(form); onClose(); }}
            disabled={!form.immatriculation || !form.capacite}
            className="flex-1 h-11 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-40"
          >
            {initial?.id ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GestionVehicules() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterStatut, setFilterStatut] = useState('all');

  const { data: vehicules = [], isLoading } = useQuery({
    queryKey: ['vehicules'],
    queryFn: () => base44.entities.Vehicule.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Vehicule.create({ ...data, capacite: Number(data.capacite), annee: data.annee ? Number(data.annee) : undefined }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicules'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Vehicule.update(id, { ...data, capacite: Number(data.capacite), annee: data.annee ? Number(data.annee) : undefined }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicules'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Vehicule.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicules'] }),
  });

  const handleSave = (form) => {
    if (editing?.id) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const filtered = filterStatut === 'all' ? vehicules : vehicules.filter(v => v.statut === filterStatut);

  const actifs = vehicules.filter(v => v.statut === 'actif').length;
  const maintenance = vehicules.filter(v => v.statut === 'maintenance').length;
  const horsService = vehicules.filter(v => v.statut === 'hors_service').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold font-outfit">Flotte</h2>
          <p className="text-xs text-muted-foreground">Gestion des véhicules</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-primary/20"
        >
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-center">
          <p className="text-2xl font-extrabold text-primary">{actifs}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Actifs</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-warn/10 border border-warn/20 text-center">
          <p className="text-2xl font-extrabold text-warn">{maintenance}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Maintenance</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
          <p className="text-2xl font-extrabold text-destructive">{horsService}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Hors service</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'Tous', count: vehicules.length },
          { key: 'actif', label: 'Actifs', count: actifs },
          { key: 'maintenance', label: 'Maintenance', count: maintenance },
          { key: 'hors_service', label: 'Hors service', count: horsService },
        ].map(f => (
          <button key={f.key} onClick={() => setFilterStatut(f.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatut === f.key ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}>
            {f.label}
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filterStatut === f.key ? 'bg-primary-foreground/20' : 'bg-muted'}`}>{f.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-24 rounded-2xl bg-muted/30 animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 text-muted-foreground text-sm">
            <Bus className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Aucun véhicule enregistré
          </div>
        ) : (
          filtered.map(v => {
            const sc = statutConfig[v.statut] || statutConfig.actif;
            const Icon = v.statut === 'actif' ? CheckCircle2 : v.statut === 'maintenance' ? Wrench : XCircle;
            return (
              <div key={v.id} className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                      <Bus className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold font-mono uppercase">{v.immatriculation}</p>
                      <p className="text-xs text-muted-foreground">{[v.marque, v.modele, v.annee].filter(Boolean).join(' · ')}</p>
                    </div>
                  </div>
                  <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${sc.bg} ${sc.color}`}>
                    <Icon className="w-2.5 h-2.5" /> {sc.label}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="font-bold text-foreground">{v.capacite} places</span>
                    {v.chauffeur_attitré && <span>· {v.chauffeur_attitré}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(v); setShowForm(true); }}
                      className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-accent/10 hover:text-accent transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(v.id)}
                      className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {v.notes && <p className="mt-2 text-[11px] text-muted-foreground italic">{v.notes}</p>}
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <VehiculeForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
