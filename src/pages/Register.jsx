import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form.email, form.password, form.fullName);
      setDone(true);
    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout title="Vérifiez vos emails" subtitle="Confirmation requise">
        <p className="text-sm text-encre/60 text-center">
          Un email de confirmation a été envoyé à <strong>{form.email}</strong>. Cliquez sur le lien pour activer votre compte.
        </p>
        <Button className="w-full mt-4" onClick={() => navigate('/login')}>Retour à la connexion</Button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Créer un compte" subtitle="Rejoignez votre gare">
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Nom complet</Label><Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required /></div>
        <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
        <div><Label>Mot de passe</Label><Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} /></div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Création...' : 'Créer mon compte'}</Button>
      </form>
      <p className="text-center text-sm text-encre/50 mt-5">
        Déjà inscrit ? <Link to="/login" className="text-ciel font-medium">Se connecter</Link>
      </p>
    </AuthLayout>
  );
}
