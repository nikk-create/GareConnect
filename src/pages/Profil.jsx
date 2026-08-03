import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { User, Bell, Shield, Save, LogOut, ChevronRight, Check } from 'lucide-react';

export default function Profil() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ full_name: '' });
  const [prefs, setPrefs] = useState({
    notif_depart: true,
    notif_arrivee: true,
    notif_incident: true,
    notif_retard: true,
    notif_sms: false,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setForm({ full_name: u?.full_name || '' });
      if (u?.notification_prefs) {
        setPrefs(p => ({ ...p, ...u.notification_prefs }));
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    await base44.auth.updateMe({ full_name: form.full_name, notification_prefs: prefs });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => base44.auth.logout('/login');

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(4).fill(0).map((_, i) => <div key={i} className="h-16 rounded-2xl bg-muted/30 animate-pulse" />)}
      </div>
    );
  }

  const initials = (user?.full_name || user?.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold font-outfit">Mon profil</h2>
        <p className="text-xs text-muted-foreground">Paramètres et préférences</p>
      </div>

      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <span className="text-3xl font-extrabold text-primary">{initials}</span>
        </div>
        <div className="text-center">
          <p className="text-base font-extrabold font-outfit">{user?.full_name || '—'}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted text-muted-foreground'}`}>
            {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/30">
          <User className="w-4 h-4 text-primary" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Informations</span>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Nom complet</label>
            <input
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              placeholder="Votre nom..."
              className="w-full h-11 px-3 rounded-xl bg-muted/50 border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Email</label>
            <div className="h-11 px-3 rounded-xl bg-muted/30 border border-border/30 flex items-center">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/30">
          <Bell className="w-4 h-4 text-accent" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Notifications</span>
        </div>
        <div className="divide-y divide-border/20">
          {[
            { key: 'notif_depart',  label: 'Alertes départ',   desc: 'Notifié lors des départs' },
            { key: 'notif_arrivee', label: 'Alertes arrivée',  desc: 'Notifié lors des arrivées' },
            { key: 'notif_incident',label: 'Incidents',        desc: 'Alertes incidents en temps réel' },
            { key: 'notif_retard',  label: 'Retards',          desc: 'Signalement des retards' },
            { key: 'notif_sms',     label: 'Copies SMS',       desc: 'Recevoir une copie des SMS familles' },
          ].map(({ key, label, desc }) => (
            <button key={key} onClick={() => setPrefs(p => ({ ...p, [key]: !p[key] }))}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors text-left">
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
              <div className={`w-11 h-6 rounded-full transition-colors flex items-center px-1 ${prefs[key] ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${prefs[key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/30">
          <Shield className="w-4 h-4 text-secondary" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Sécurité</span>
        </div>
        <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
          <div>
            <p className="text-sm font-semibold">Changer le mot de passe</p>
            <p className="text-[11px] text-muted-foreground">Modifier votre mot de passe</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex gap-3 pb-4">
        <button
          onClick={handleSave}
          className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          {saved ? <><Check className="w-4 h-4" /> Enregistré</> : <><Save className="w-4 h-4" /> Enregistrer</>}
        </button>
        <button
          onClick={handleLogout}
          className="h-12 px-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive font-bold text-sm flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>
    </div>
  );
}
