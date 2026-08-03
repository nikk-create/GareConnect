import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useGare } from '@/lib/GareContext';
import ContactFamilleList from '@/components/gare/ContactFamilleList';
import TicketPreview from '@/components/gare/TicketPreview';
import SmsBubble from '@/components/gare/SmsBubble';
import { TicketCheck, Smartphone, Banknote, CreditCard } from 'lucide-react';

const payMethods = [
  { key: 'mtn_momo', label: 'MTN MoMo', color: 'bg-warn/15 text-warn border-warn/30', icon: Smartphone },
  { key: 'moov_money', label: 'Moov Money', color: 'bg-accent/15 text-accent border-accent/30', icon: CreditCard },
  { key: 'especes', label: 'Espèces', color: 'bg-primary/15 text-primary border-primary/30', icon: Banknote },
];

export default function TicketPage() {
  const { addToast, isOffline, addToPending } = useGare();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const preselectedVoyageId = searchParams.get('voyage_id') || '';
  const [step, setStep] = useState('form'); // form | preview
  const [form, setForm] = useState({
    voyage_id: preselectedVoyageId, passager_prenom: '', passager_nom: '', passager_telephone: '',
    contacts_famille: [], moyen_paiement: 'especes', montant: 0,
  });
  const [createdTicket, setCreatedTicket] = useState(null);

  const { data: voyages = [] } = useQuery({
    queryKey: ['voyages'],
    queryFn: () => base44.entities.Voyage.list('-created_date', 50),
  });

  const activeVoyages = voyages.filter(v => v.statut !== 'arrive');
  const selectedVoyage = voyages.find(v => v.id === form.voyage_id);

  const createMutation = useMutation({
    mutationFn: async (ticketData) => {
      const code = 'GC-' + Date.now().toString(36).toUpperCase().slice(-6);
      const ticket = await base44.entities.Ticket.create({
        ...ticketData,
        code_ticket: code,
        destination: selectedVoyage?.destination,
        heure_depart: selectedVoyage?.heure_depart,
        date_depart: selectedVoyage?.date_depart,
      });
      if (selectedVoyage) {
        await base44.entities.Voyage.rpcIncrementPlaces(selectedVoyage.id);
      }
      for (const contact of ticketData.contacts_famille || []) {
        await base44.entities.Alerte.create({
          type: 'sms',
          message: `Départ de ${ticketData.passager_prenom} pour ${selectedVoyage?.destination} à ${selectedVoyage?.heure_depart}`,
          destination: selectedVoyage?.destination,
          destinataire: contact.telephone,
          voyage_id: selectedVoyage?.id,
        });
      }
      return { ...ticket, code_ticket: code, destination: selectedVoyage?.destination, heure_depart: selectedVoyage?.heure_depart };
    },
    onSuccess: (ticket) => {
      queryClient.invalidateQueries({ queryKey: ['voyages'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['alertes'] });
      setCreatedTicket(ticket);
      setStep('preview');
      addToast('Ticket créé avec succès !', 'success');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.voyage_id || !form.passager_prenom || !form.passager_nom || !form.passager_telephone) {
      addToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    if (isOffline) {
      addToPending({ type: 'ticket', data: form });
      addToast('Ticket ajouté à la file d\'attente', 'warn');
      return;
    }
    createMutation.mutate(form);
  };

  const resetForm = () => {
    setForm({ voyage_id: '', passager_prenom: '', passager_nom: '', passager_telephone: '', contacts_famille: [], moyen_paiement: 'especes', montant: 0 });
    setCreatedTicket(null);
    setStep('form');
  };

  if (step === 'preview' && createdTicket) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold font-outfit">Ticket émis ✓</h2>
        <TicketPreview ticket={createdTicket} />

        {form.contacts_famille.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">SMS envoyés</h3>
            {form.contacts_famille.map((c, i) => (
              <SmsBubble key={i} contact={c} destination={selectedVoyage?.destination} heure={selectedVoyage?.heure_depart} />
            ))}
          </div>
        )}

        <button onClick={resetForm} className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-sm active:scale-[0.98] transition-transform">
          Nouveau ticket
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <TicketCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold font-outfit">Nouveau ticket</h2>
          <p className="text-xs text-muted-foreground">Créer un billet pour un passager</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Voyage</label>
          <select
            value={form.voyage_id}
            onChange={e => {
              const v = voyages.find(v => v.id === e.target.value);
              setForm({ ...form, voyage_id: e.target.value, montant: v?.prix || 0 });
            }}
            className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 appearance-none"
          >
            <option value="">Sélectionner un voyage</option>
            {activeVoyages.map(v => (
              <option key={v.id} value={v.id}>
                {v.origine || 'Cotonou'} → {v.destination} · {v.heure_depart} · {((v.places_total || 0) - (v.places_occupees || 0))} places
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Prénom</label>
            <input value={form.passager_prenom} onChange={e => setForm({ ...form, passager_prenom: e.target.value })}
              placeholder="Prénom" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Nom</label>
            <input value={form.passager_nom} onChange={e => setForm({ ...form, passager_nom: e.target.value })}
              placeholder="Nom" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Téléphone</label>
          <input value={form.passager_telephone} onChange={e => setForm({ ...form, passager_telephone: e.target.value })}
            placeholder="+229 97 00 00 00" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
        </div>

        <ContactFamilleList contacts={form.contacts_famille} setContacts={c => setForm({ ...form, contacts_famille: c })} />

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Paiement</label>
          <div className="flex gap-2">
            {payMethods.map(pm => (
              <button
                key={pm.key} type="button" onClick={() => setForm({ ...form, moyen_paiement: pm.key })}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  form.moyen_paiement === pm.key ? pm.color + ' shadow-lg' : 'bg-muted/30 text-muted-foreground border-border/30 hover:bg-muted/50'
                }`}
              >
                <pm.icon className="w-3.5 h-3.5" />
                {pm.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">Montant FCFA</label>
          <input type="number" value={form.montant || ''} onChange={e => setForm({ ...form, montant: parseInt(e.target.value) || 0 })}
            placeholder="5 000" className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-mono font-bold placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
        </div>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {createMutation.isPending ? 'Création...' : 'Émettre le ticket'}
        </button>
      </form>
    </div>
  );
}
