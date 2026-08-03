import React from 'react';
import { MessageSquare, Check } from 'lucide-react';

export default function SmsBubble({ contact, destination, heure }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20">
      <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
        <MessageSquare className="w-4 h-4 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium leading-snug">
          Départ de <span className="font-bold">{contact?.nom || 'passager'}</span> pour{' '}
          <span className="font-bold">{destination}</span> à <span className="font-mono">{heure}</span>
        </p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-mono">
          <span>{contact?.telephone}</span>
          {contact?.relation && <span>· {contact.relation}</span>}
          <span className="flex items-center gap-0.5 text-primary ml-auto"><Check className="w-3 h-3" /> Envoyé</span>
        </div>
      </div>
    </div>
  );
}
