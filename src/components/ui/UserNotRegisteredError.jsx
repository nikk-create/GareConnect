import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function UserNotRegisteredError({ message }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-papier p-6">
      <div className="max-w-sm text-center">
        <AlertTriangle className="w-10 h-10 text-or mx-auto mb-3" />
        <h2 className="font-display font-semibold text-lg text-encre mb-2">Compte non reconnu</h2>
        <p className="text-sm text-encre/60">{message || "Votre compte n'est pas encore enregistré pour cette gare. Contactez un administrateur."}</p>
      </div>
    </div>
  );
}
