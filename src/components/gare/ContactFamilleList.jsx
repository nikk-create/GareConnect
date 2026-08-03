import React from 'react';
import { Plus, Trash2, UserPlus } from 'lucide-react';

export default function ContactFamilleList({ contacts = [], setContacts }) {
  const add = () => setContacts([...contacts, { nom: '', relation: '', telephone: '' }]);
  const remove = (idx) => setContacts(contacts.filter((_, i) => i !== idx));
  const update = (idx, field, value) => {
    const next = [...contacts];
    next[idx] = { ...next[idx], [field]: value };
    setContacts(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Contacts famille (notifiés par SMS)
        </label>
        <button type="button" onClick={add} className="flex items-center gap-1 text-[11px] font-bold text-primary">
          <Plus className="w-3.5 h-3.5" /> Ajouter
        </button>
      </div>

      {contacts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 rounded-xl bg-muted/30 border border-dashed border-border/50">
          <UserPlus className="w-5 h-5 text-muted-foreground mb-1.5" />
          <p className="text-xs text-muted-foreground">Aucun contact ajouté</p>
        </div>
      )}

      <div className="space-y-2.5">
        {contacts.map((c, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-muted/30 border border-border/30 space-y-2 relative">
            <button type="button" onClick={() => remove(idx)} className="absolute top-2.5 right-2.5 text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="grid grid-cols-2 gap-2 pr-6">
              <input
                value={c.nom}
                onChange={(e) => update(idx, 'nom', e.target.value)}
                placeholder="Nom"
                className="h-9 px-2.5 rounded-lg bg-background/50 border border-border/50 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <input
                value={c.relation}
                onChange={(e) => update(idx, 'relation', e.target.value)}
                placeholder="Relation"
                className="h-9 px-2.5 rounded-lg bg-background/50 border border-border/50 text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <input
              value={c.telephone}
              onChange={(e) => update(idx, 'telephone', e.target.value)}
              placeholder="+229 97 00 00 00"
              className="w-full h-9 px-2.5 rounded-lg bg-background/50 border border-border/50 text-xs font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
