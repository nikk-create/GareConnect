import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Bus } from 'lucide-react';

export default function TicketPreview({ ticket }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (ticket?.code_ticket && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, ticket.code_ticket, {
        width: 128,
        margin: 0,
        color: { dark: '#e8fffc', light: '#00000000' },
      });
    }
  }, [ticket?.code_ticket]);

  if (!ticket) return null;

  return (
    <div id="ticket-preview" className="rounded-3xl overflow-hidden border border-primary/20 glow-primary">
      <div className="bg-gradient-to-br from-primary/20 via-card to-card px-5 py-4 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bus className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-mono">GareConnect Bénin</p>
            <p className="font-extrabold font-outfit text-sm">{ticket.destination}</p>
          </div>
        </div>
        <span className="font-mono text-[10px] font-bold bg-primary/15 text-primary px-2 py-1 rounded-lg">
          {ticket.code_ticket}
        </span>
      </div>
      <div className="p-5 space-y-3 bg-card">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Passager</span>
          <span className="font-bold">{ticket.passager_prenom} {ticket.passager_nom}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Départ</span>
          <span className="font-bold font-mono">{ticket.date_depart || '—'} · {ticket.heure_depart}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Montant</span>
          <span className="font-bold font-mono text-primary">{(ticket.montant || 0).toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div className="flex justify-center py-4 border-t border-dashed border-border/30 mt-2">
          <div className="p-2 rounded-xl bg-background">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
