import React from 'react';
import { MessageSquare, CheckCheck, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_ICON = { envoye: Clock, delivre: CheckCheck, echec: X };
const STATUS_COLOR = { envoye: 'text-encre/40', delivre: 'text-emerald-600', echec: 'text-red-500' };

export function SmsBubble({ alerte }) {
  const Icon = STATUS_ICON[alerte.statut_sms] || Clock;
  return (
    <div className="flex gap-3 py-3 border-b border-encre/5 last:border-0">
      <div className="w-9 h-9 rounded-full bg-menthe/15 flex items-center justify-center shrink-0">
        <MessageSquare className="w-4 h-4 text-emerald-700" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-encre">{alerte.message}</p>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-encre/40">
          <span>{alerte.destinataire}</span>
          <span>·</span>
          <span>{alerte.cout_sms} FCFA</span>
          <span>·</span>
          <span className={cn('flex items-center gap-0.5', STATUS_COLOR[alerte.statut_sms])}>
            <Icon className="w-3 h-3" /> {alerte.statut_sms}
          </span>
        </div>
      </div>
    </div>
  );
}
