import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await resetPassword(email); setSent(true); } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Mot de passe oublié" subtitle="Nous vous enverrons un lien">
      {sent ? (
        <p className="text-sm text-encre/60 text-center">Vérifiez votre boîte mail pour réinitialiser votre mot de passe.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer le lien'}</Button>
        </form>
      )}
      <p className="text-center text-sm text-encre/50 mt-5">
        <Link to="/login" className="text-ciel font-medium">Retour à la connexion</Link>
      </p>
    </AuthLayout>
  );
}
