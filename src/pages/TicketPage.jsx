import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TicketPreview } from '@/components/gare/TicketPreview';
import { ContactFamilleList } from '@/components/gare/ContactFamilleList';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Ticket, Voyage } from '@/api/entities';
import { genererCodeTicket } from '@/lib/utils';
import { useGare } from '@/lib/GareContext';

export default function TicketPage() {
  const [params] = useSearchParams();
  const voyageId = params.get('voyage_id');
  const { addToast } = useGare() || {};
  const [form, setForm] = useState({
    passager_prenom: '', passager_nom: '', passager_telephone: '',
    moyen_paiement: 'mtn_momo', montant: '',
  });
  const [contacts, setContacts] = useState([]);
  const [ticketCree, setTicketCree] = useState(null);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const submit = async () => {
    if (!form.passager_prenom || !form.passager_nom || !form.passager_telephone || !form.montant) return;
    setSaving(true);
    try {
      const voyage = voyageId ? await Voyage.get(voyageId) : null;
      const ticket = await Ticket.create({
        ...form,
        montant: Number(form.montant),
        voyage_id: voyageId,
        contacts_famille: contacts.filter((c) => c.telephone),
        code_ticket: genererCodeTicket(),
        destination: voyage?.destination,
        heure_depart: voyage?.heure_depart,
        date_depart: voyage?.date_depart,
      });
      if (voyage) {
        // Incrément atomique côté base (fonction RPC) pour éviter les pertes
        // de place en cas de double vente simultanée sur le même voyage.
        await Voyage.rpcIncrementPlaces(voyage.id);
      }
      setTicketCree(ticket);
      addToast?.('Ticket émis avec succès');
    } catch {
      addToast?.("Erreur lors de l'émission du ticket", 'warn');
    } finally {
      setSaving(false);
    }
  };

  const telechargerPdf = async () => {
    const el = document.getElementById('ticket-preview');
    if (!el) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`ticket-${ticketCree.code_ticket}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  if (ticketCree) {
    return (
      <div className="min-h-screen bg-papier px-5 py-8">
        <button onClick={() => setTicketCree(null)} className="flex items-center gap-1.5 text-sm text-encre/50 mb-4">
          <ArrowLeft className="w-4 h-4" /> Nouveau ticket
        </button>
        <TicketPreview ticket={ticketCree} />
        <Button variant="outline" className="w-full mt-4" onClick={telechargerPdf} disabled={downloading}>
          <Download className="w-4 h-4" /> {downloading ? 'Génération...' : 'Télécharger le PDF'}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-papier px-5 py-8">
      <h1 className="font-display text-xl font-semibold text-encre mb-1">Émettre un ticket</h1>
      <p className="text-sm text-encre/50 mb-5">Paiement en espèces au guichet ou par Mobile Money.</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Prénom</Label><Input value={form.passager_prenom} onChange={(e) => setForm({ ...form, passager_prenom: e.target.value })} /></div>
          <div><Label>Nom</Label><Input value={form.passager_nom} onChange={(e) => setForm({ ...form, passager_nom: e.target.value })} /></div>
        </div>
        <div><Label>Téléphone du passager</Label><Input value={form.passager_telephone} onChange={(e) => setForm({ ...form, passager_telephone: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Moyen de paiement</Label>
            <Select value={form.moyen_paiement} onChange={(e) => setForm({ ...form, moyen_paiement: e.target.value })}>
              <option value="mtn_momo">MTN MoMo</option>
              <option value="moov_money">Moov Money</option>
              <option value="especes">Espèces</option>
            </Select>
          </div>
          <div><Label>Montant (FCFA)</Label><Input type="number" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} /></div>
        </div>

        <div>
          <Label>Contacts famille (notifiés en cas d'incident)</Label>
          <ContactFamilleList contacts={contacts} onChange={setContacts} />
        </div>

        <Button className="w-full" onClick={submit} disabled={saving}>
          {saving ? 'Émission...' : 'Émettre le ticket'}
        </Button>
      </div>
    </div>
  );
}
