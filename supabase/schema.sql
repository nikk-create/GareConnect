-- ============================================================
-- GareConnect Bénin — Schéma Supabase (migration depuis Base44)
-- Note : les colonnes horodatage sont nommées "created_date" (et non
-- "created_at") pour rester compatibles avec le code frontend qui
-- utilise cette convention base44 (ex: base44.entities.Voyage.list('-created_date')).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- PROFILES (remplace l'entité User) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'user' check (role in ('admin','user')),
  notification_prefs jsonb not null default '{}'::jsonb,
  created_date timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- VEHICULES ----------
create table public.vehicules (
  id uuid primary key default gen_random_uuid(),
  immatriculation text not null,
  marque text,
  modele text,
  capacite numeric not null,
  statut text not null default 'actif' check (statut in ('actif','maintenance','hors_service')),
  annee numeric,
  "chauffeur_attitré" text,
  notes text,
  created_by uuid references auth.users(id) default auth.uid(),
  created_date timestamptz not null default now()
);

-- ---------- VOYAGES ----------
create table public.voyages (
  id uuid primary key default gen_random_uuid(),
  destination text not null,
  origine text default 'Cotonou',
  heure_depart text not null,
  date_depart date,
  places_total numeric not null,
  places_occupees numeric not null default 0,
  chauffeur text not null,
  vehicule text,
  statut text not null default 'planifie'
    check (statut in ('planifie','embarquement','en_route','retard','sans_nouvelles','arrive')),
  progression numeric not null default 0,
  prix numeric,
  code_voyage text,
  created_by uuid references auth.users(id) default auth.uid(),
  created_date timestamptz not null default now()
);

-- ---------- TICKETS ----------
create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  voyage_id uuid references public.voyages(id) on delete cascade,
  code_ticket text,
  passager_prenom text not null,
  passager_nom text not null,
  passager_telephone text not null,
  contacts_famille jsonb not null default '[]'::jsonb, -- [{nom, relation, telephone}]
  moyen_paiement text check (moyen_paiement in ('mtn_momo','moov_money','especes')),
  montant numeric not null default 0,
  destination text,
  heure_depart text,
  date_depart date,
  created_by uuid references auth.users(id) default auth.uid(),
  created_date timestamptz not null default now()
);

-- ---------- INCIDENTS ----------
create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  voyage_id uuid references public.voyages(id) on delete cascade,
  type_incident text not null
    check (type_incident in ('panne','accident','retard_majeur','passager_malade','route_bloquee','autre')),
  description text not null,
  gravite text not null default 'moyen' check (gravite in ('faible','moyen','grave','critique')),
  statut_resolution text not null default 'ouvert' check (statut_resolution in ('ouvert','en_cours','resolu')),
  assigned_to text,
  assigned_at timestamptz,
  resolved_at timestamptz,
  resolution_notes text,
  passengers_notified boolean not null default false,
  destination text,
  code_voyage text,
  created_by uuid references auth.users(id) default auth.uid(),
  created_date timestamptz not null default now()
);

-- ---------- ALERTES ----------
create table public.alertes (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('depart','retard','arrivee','sans_nouvelles','incident','sms')),
  message text not null,
  voyage_id uuid references public.voyages(id) on delete set null,
  destination text,
  statut_sms text not null default 'envoye' check (statut_sms in ('envoye','delivre','echec')),
  destinataire text,
  cout_sms numeric not null default 25,
  created_by uuid references auth.users(id) default auth.uid(),
  created_date timestamptz not null default now()
);

-- Incrément atomique des places occupées (évite les pertes de place en cas
-- de double vente simultanée sur le même voyage — race condition côté client)
create or replace function public.increment_places(p_voyage_id uuid)
returns void as $$
  update public.voyages
  set places_occupees = least(places_occupees + 1, places_total)
  where id = p_voyage_id;
$$ language sql security definer set search_path = public;

grant execute on function public.increment_places(uuid) to authenticated;

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles enable row level security;
alter table public.vehicules enable row level security;
alter table public.voyages enable row level security;
alter table public.tickets enable row level security;
alter table public.incidents enable row level security;
alter table public.alertes enable row level security;

create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$ language sql stable security definer set search_path = public;

create policy "profiles_select" on public.profiles for select using (true);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id or is_admin());

create policy "vehicules_select" on public.vehicules for select using (auth.role() = 'authenticated');
create policy "vehicules_insert" on public.vehicules for insert with check (auth.role() = 'authenticated');
create policy "vehicules_update" on public.vehicules for update using (auth.role() = 'authenticated');
create policy "vehicules_delete" on public.vehicules for delete using (is_admin());

create policy "voyages_select" on public.voyages for select using (auth.role() = 'authenticated');
create policy "voyages_insert" on public.voyages for insert with check (auth.role() = 'authenticated');
create policy "voyages_update" on public.voyages for update using (auth.role() = 'authenticated');
create policy "voyages_delete" on public.voyages for delete using (is_admin());

create policy "tickets_select" on public.tickets for select using (created_by = auth.uid() or is_admin());
create policy "tickets_insert" on public.tickets for insert with check (auth.role() = 'authenticated');
create policy "tickets_update" on public.tickets for update using (created_by = auth.uid() or is_admin());
create policy "tickets_delete" on public.tickets for delete using (is_admin());

create policy "incidents_select" on public.incidents for select using (auth.role() = 'authenticated');
create policy "incidents_insert" on public.incidents for insert with check (auth.role() = 'authenticated');
create policy "incidents_update" on public.incidents for update using (auth.role() = 'authenticated');
create policy "incidents_delete" on public.incidents for delete using (is_admin());

create policy "alertes_select" on public.alertes for select using (auth.role() = 'authenticated');
create policy "alertes_insert" on public.alertes for insert with check (auth.role() = 'authenticated');
create policy "alertes_update" on public.alertes for update using (created_by = auth.uid() or is_admin());
create policy "alertes_delete" on public.alertes for delete using (is_admin());

create index on public.tickets (voyage_id);
create index on public.incidents (voyage_id);
create index on public.alertes (voyage_id);
create index on public.voyages (statut);
