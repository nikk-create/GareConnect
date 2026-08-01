import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-papier px-6 text-center">
      <p className="text-6xl mb-4">🚌💨</p>
      <h1 className="font-display text-2xl font-semibold text-encre mb-2">Page introuvable</h1>
      <p className="text-encre/50 text-sm mb-6">Cette route n'existe pas dans GareConnect.</p>
      <Link to="/"><Button>Retour à l'accueil</Button></Link>
    </div>
  );
}
