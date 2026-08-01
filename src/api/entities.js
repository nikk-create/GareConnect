// Couche de compatibilité : reproduit l'API base44.entities.X.method()
// pour que les pages/composants gardent la même syntaxe qu'avant,
// tout en tapant sur Supabase en dessous.
import { supabase } from './supabaseClient';

function makeEntity(table) {
  return {
    async list(orderBy = '-created_at', limit = 200) {
      let col = orderBy.replace('-', '');
      let asc = !orderBy.startsWith('-');
      const { data, error } = await supabase
        .from(table).select('*').order(col, { ascending: asc }).limit(limit);
      if (error) throw error;
      return data;
    },
    async filter(query = {}, orderBy = '-created_at', limit = 200) {
      let col = orderBy.replace('-', '');
      let asc = !orderBy.startsWith('-');
      let req = supabase.from(table).select('*');
      for (const [key, value] of Object.entries(query)) {
        req = req.eq(key, value);
      }
      const { data, error } = await req.order(col, { ascending: asc }).limit(limit);
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

export const Voyage = makeEntity('voyages');
Voyage.rpcIncrementPlaces = async (voyageId) => {
  const { data, error } = await supabase.rpc('increment_places', { p_voyage_id: voyageId });
  if (error) throw error;
  return data;
};
export const Ticket = makeEntity('tickets');
export const Incident = makeEntity('incidents');
export const Alerte = makeEntity('alertes');
export const Vehicule = makeEntity('vehicules');

// Appel de la fonction Edge notifier-incident-resolu
export async function notifierIncidentResolu(incident_id) {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  const { data, error } = await supabase.functions.invoke('notifier-incident-resolu', {
    body: { incident_id },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (error) throw error;
  return data;
}
