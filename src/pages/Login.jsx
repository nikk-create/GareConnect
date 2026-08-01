import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/ui/AuthLayout';
import { GoogleIcon } from '@/components/ui/GoogleIcon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

export default function Login() {
  const { loginWithPassword, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await loginWithPassword(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="GareConnect" subtitle="Connexion à votre espace gare">
      <form onSubmit={submit} className="space-y-4">
        <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        <div><Label>Mot de passe</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="text-right">
          <Link to="/mot-de-passe-oublie" className="text-xs text-ciel">Mot de passe oublié ?</Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</Button>
      </form>
      <div className="flex items-center gap-3 my-4">
        <div className="h-px bg-encre/10 flex-1" /><span className="text-xs text-encre/30">ou</span><div className="h-px bg-encre/10 flex-1" />
      </div>
      <Button variant="outline" className="w-full" onClick={loginWithGoogle}>
        <GoogleIcon /> Continuer avec Google
      </Button>
      <p className="text-center text-sm text-encre/50 mt-5">
        Pas de compte ? <Link to="/register" className="text-ciel font-medium">S'inscrire</Link>
      </p>
    </AuthLayout>
  );
}
