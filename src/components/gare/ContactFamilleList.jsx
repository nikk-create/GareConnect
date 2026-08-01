import React from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ContactFamilleList({ contacts = [], onChange }) {
  const add = () => onChange([...contacts, { nom: '', relation: '', telephone: '' }]);
  const remove = (idx) => onChange(contacts.filter((_, i) => i !== idx));
  const update = (idx, field, value) => {
    const next = [...contacts];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {contacts.map((c, idx) => (
        <div key={idx} className="p-3 rounded-xl bg-encre/5 space-y-2 relative">
          <button type="button" onClick={() => remove(idx)} className="absolute top-2 right-2 text-red-500">
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-xs text-encre/50 mb-1">
            <User className="w-3.5 h-3.5" /> Contact famille {idx + 1}
          </div>
          <Input placeholder="Nom" value={c.nom} onChange={(e) => update(idx, 'nom', e.target.value)} />
          <Input placeholder="Relation (père, sœur...)" value={c.relation} onChange={(e) => update(idx, 'relation', e.target.value)} />
          <Input placeholder="Téléphone" value={c.telephone} onChange={(e) => update(idx, 'telephone', e.target.value)} />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="w-4 h-4" /> Ajouter un contact
      </Button>
    </div>
  );
}
