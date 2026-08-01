import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { formatFCFA } from '@/lib/utils';

export function TicketPreview({ ticket }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (ticket?.code_ticket && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, ticket.code_ticket, {
        width: 140,
        margin: 1,
        color: { dark: '#0A1224', light: '#00000000' },
      });
    }
  }, [ticket?.code_ticket]);

  if (!ticket) return null;
  return (
    <div id="ticket-preview" className="rounded-2xl overflow-hidden border border-encre/10 bg-white">
      <div className="bg-encre text-papier px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-papier/50">GareConnect Bénin</p>
          <p className="font-display font-semibold">{ticket.destination}</p>
        </div>
        <span className="font-mono text-xs bg-menthe/15 text-menthe px-2 py-1 rounded-lg">{ticket.code_ticket}</span>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-encre/50">Passager</span>
          <span className="font-medium text-encre">{ticket.passager_prenom} {ticket.passager_nom}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-encre/50">Départ</span>
          <span className="font-medium text-encre">{ticket.date_depart} · {ticket.heure_depart}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-encre/50">Montant</span>
          <span className="font-medium text-encre">{formatFCFA(ticket.montant)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-encre/50">Paiement</span>
          <span className="font-medium text-encre capitalize">{(ticket.moyen_paiement || '').replace('_', ' ')}</span>
        </div>
        <div className="flex justify-center py-4 border-t border-dashed border-encre/10 mt-2">
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
