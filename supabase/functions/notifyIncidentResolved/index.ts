// Supabase Edge Function — équivalent de base44/functions/NotifierIncidentRésolu
// Déployer avec : supabase functions deploy notifyIncidentResolved
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_ANON_KEY"),
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    const { incident_id } = await req.json();
    if (!incident_id) {
      return Response.json({ error: "incident_id requis" }, { status: 400, headers: corsHeaders });
    }

    const { data: incident, error: incErr } = await supabase
      .from("incidents").select("*").eq("id", incident_id).single();
    if (incErr || !incident) {
      return Response.json({ error: "Incident non trouvé" }, { status: 404, headers: corsHeaders });
    }

    const { data: tickets } = await supabase
      .from("tickets").select("*").eq("voyage_id", incident.voyage_id);

    const notified = [];
    const alertsToInsert = [];

    for (const ticket of tickets ?? []) {
      const contacts = ticket.contacts_famille || [];
      for (const contact of contacts) {
        if (contact.telephone) {
          const msg = `Bonne nouvelle ! L'incident ${incident.type_incident} concernant le voyage de ${ticket.passager_prenom} ${ticket.passager_nom} vers ${incident.destination || ticket.destination || "la destination"} a été résolu. ${incident.resolution_notes ? "Note: " + incident.resolution_notes : ""}`.trim();

          alertsToInsert.push({
            type: "incident", message: msg, voyage_id: incident.voyage_id,
            destination: incident.destination || ticket.destination || "",
            destinataire: contact.telephone, statut_sms: "envoye", cout_sms: 25,
          });
          notified.push({ contact: contact.nom, telephone: contact.telephone });
        }
      }

      if (ticket.passager_telephone) {
        const msg = `Incident résolu: Le voyage ${incident.code_voyage || ""} vers ${incident.destination || ticket.destination || "la destination"} est de nouveau en ordre. ${incident.resolution_notes || ""}`.trim();

        alertsToInsert.push({
          type: "incident", message: msg, voyage_id: incident.voyage_id,
          destination: incident.destination || ticket.destination || "",
          destinataire: ticket.passager_telephone, statut_sms: "envoye", cout_sms: 25,
        });
        notified.push({ contact: `${ticket.passager_prenom} ${ticket.passager_nom}`, telephone: ticket.passager_telephone });
      }
    }

    let alertsCreated = 0;
    if (alertsToInsert.length > 0) {
      const { data, error } = await supabase.from("alertes").insert(alertsToInsert).select("id");
      if (error) throw error;
      alertsCreated = data?.length ?? 0;
    }

    return Response.json(
      { success: true, notified_count: notified.length, alerts_created: alertsCreated, notified },
      { headers: corsHeaders }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
});
