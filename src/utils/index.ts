// Génère les URLs de page (équivalent createPageUrl utilisé par base44)
export function createPageUrl(pageName: string): string {
  const map: Record<string, string> = {
    Accueil: '/',
    Departs: '/departs',
    Incidents: '/incidents',
    Alertes: '/alertes',
    Carte: '/carte',
    Stats: '/stats',
    GestionVehicules: '/vehicules',
    ListePassagers: '/passagers',
    Profil: '/profil',
    TicketPage: '/ticket',
    Login: '/login',
    Register: '/register',
    ForgotPassword: '/mot-de-passe-oublie',
    ResetPassword: '/reinitialiser-mot-de-passe',
  };
  return map[pageName] || '/';
}
