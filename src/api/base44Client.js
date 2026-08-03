// Remplace l'ancien base44/api/base44Client.js.
// Reproduit la même surface d'API que le SDK base44 (entities.X.list/create/...,
// auth.me/login.../..., functions.invoke) pour que les pages migrées depuis
// Base44 n'aient (presque) rien à changer — seul ce fichier tape sur Supabase.
import { supabase } from './supabaseClient';

function parseOrder(orderStr = '-created_date') {
  const desc = orderStr.startsWith('-');
  const column = desc ? orderStr.slice(1) : orderStr;
  return { column, ascending: !desc };
}

function makeEntity(table) {
  return {
    async list(orderBy = '-created_date', limit = 100) {
      const { column, ascending } = parseOrder(orderBy);
      const { data, error } = await supabase
        .from(table).select('*').order(column, { ascending }).limit(limit);
      if (error) throw error;
      return data;
    },
    async filter(query = {}, orderBy = '-created_date', limit = 200) {
      const { column, ascending } = parseOrder(orderBy);
      let req = supabase.from(table).select('*');
      for (const [key, value] of Object.entries(query)) req = req.eq(key, value);
      const { data, error } = await req.order(column, { ascending }).limit(limit);
      if (error) throw error;
      return data;
    },
    async get(id) {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    async create(payload) {
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    async update(id, payload) {
      const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return true;
    },
  };
}

async function fetchProfile(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data;
}

export const base44 = {
  entities: {
    Voyage: {
      ...makeEntity('voyages'),
      // Incrément atomique côté base — évite les pertes de place en cas de
      // double vente simultanée sur le même voyage (race condition).
      async rpcIncrementPlaces(voyageId) {
        const { error } = await supabase.rpc('increment_places', { p_voyage_id: voyageId });
        if (error) throw error;
      },
    },
    Ticket: makeEntity('tickets'),
    Alerte: makeEntity('alertes'),
    Incident: makeEntity('incidents'),
    Vehicule: makeEntity('vehicules'),
  },

  auth: {
    async me() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw { status: 401, message: 'Not authenticated' };
      const profile = await fetchProfile(user.id);
      return {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || '',
        role: profile?.role || 'user',
        notification_prefs: profile?.notification_prefs || {},
      };
    },

    async isAuthenticated() {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    },

    async loginViaEmailPassword(email, password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },

    async loginWithProvider(provider, redirectPath = '/') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}${redirectPath}` },
      });
      if (error) throw error;
    },

    async register({ email, password }) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    },

    // Vérifie le code OTP envoyé par email à l'inscription (Supabase doit être
    // configuré en mode "Email OTP" plutôt que "Magic Link" dans Auth settings).
    async verifyOtp({ email, otpCode }) {
      const { data, error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'signup' });
      if (error) throw error;
      return { access_token: data?.session?.access_token };
    },

    async resendOtp(email) {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
    },

    async resetPasswordRequest(email) {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
    },

    // Supabase établit automatiquement une session "recovery" à partir du lien
    // reçu par email (avant l'arrivée sur cette page) — resetToken n'est donc
    // pas transmis à l'API, seul updateUser({password}) est nécessaire.
    async resetPassword({ newPassword }) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },

    async updateMe({ full_name, notification_prefs }) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw { status: 401, message: 'Not authenticated' };
      const { error } = await supabase.from('profiles')
        .update({ full_name, notification_prefs })
        .eq('id', user.id);
      if (error) throw error;
    },

    async logout(redirectPath = '/login') {
      await supabase.auth.signOut();
      window.location.href = redirectPath;
    },

    // Pas d'équivalent nécessaire côté Supabase : la session est gérée par le SDK.
    setToken() {},
  },

  functions: {
    async invoke(name, body = {}) {
      const { data, error } = await supabase.functions.invoke(name, { body });
      if (error) throw error;
      return data;
    },
  },
};
