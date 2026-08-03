import React from 'react';
import { Link } from 'react-router-dom';
import { Bus } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Bus className="w-7 h-7 text-primary" />
      </div>
      <h1 className="text-2xl font-extrabold font-outfit mb-2">Page introuvable</h1>
      <p className="text-muted-foreground text-sm mb-6">Cette route n'existe pas dans GareConnect.</p>
      <Link to="/" className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center shadow-lg shadow-primary/20">
        Retour à l'accueil
      </Link>
    </div>
  );
}
