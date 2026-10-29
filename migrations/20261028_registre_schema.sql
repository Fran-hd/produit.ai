-- Schéma canonique « registre » (ADR-002), base Supabase « Produit.ai ».
-- Accord de l'utilisateur: « Go », 28/10/2026 21h35 heure de Martinique.
-- Les anciennes tables du schéma public restent intactes et en lecture.
-- Retour arrière: drop schema registre cascade.

create schema if not exists registre;
revoke all on schema registre from anon, authenticated, public;

create type registre.methode as enum ('source', 'regle', 'ia', 'humain', 'arbitrage', 'inconnue');
create type registre.statut_observation as enum ('propose', 'retenu', 'rejete');
create type registre.confiance as enum ('haute', 'moyenne', 'basse');
create type registre.etat_revue as enum ('a_reviser', 'a_arbitrer', 'valide', 'rejete');
create type registre.schema_identifiant as enum ('gtin', 'plu', 'ref_source', 'non_conforme');
create type registre.niveau_conditionnement as enum ('unite', 'lot', 'carton', 'couche', 'palette');

-- Locataire: chaque ligne de données en porte un.
create table registre.tenant (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  cree_le timestamptz not null default now()
);

-- Source: d'où vient une donnée, à qui elle appartient, comment elle a été traitée.
create table registre.source (
  id smallint generated always as identity primary key,
  tenant_id uuid not null references registre.tenant(id),
  code text not null unique,
  nature text not null,
  proprietaire text not null,
  acquise_le date,
  importee_le timestamptz,
  ancien_import_id uuid,
  regle_normalisation text,
  notes text
);

-- Produit: l'objet abstrait (une recette, un modèle). Fusion et scission réversibles.
create table registre.product (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references registre.tenant(id),
  fusionne_dans uuid references registre.product(id),
  cree_le timestamptz not null default now()
);

-- Unité commerciale: ce qui se vend sous un identifiant (un format donné d'un produit).
-- À la reprise, l'identifiant de l'ancienne ligne `public.produits` est conservé tel quel.
create table registre.trade_item (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references registre.tenant(id),
  product_id uuid not null references registre.product(id),
  premiere_source_id smallint references registre.source(id),
  etat_revue registre.etat_revue not null default 'a_reviser',
  cree_le timestamptz not null default now()
);
create index on registre.trade_item(product_id);

-- Niveaux de conditionnement: unité, lot, carton, palette, chacun avec son propre identifiant éventuel.
create table registre.packaging_level (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references registre.tenant(id),
  trade_item_id uuid not null references registre.trade_item(id),
  niveau registre.niveau_conditionnement not null,
  contient_id uuid references registre.packaging_level(id),
  quantite_contenue numeric,
  poids_net_g numeric, poids_brut_g numeric,
  longueur_mm numeric, largeur_mm numeric, hauteur_mm numeric,
  source_id smallint references registre.source(id),
  check (poids_brut_g is null or poids_net_g is null or poids_brut_g >= poids_net_g)
);

-- Identifiants: jamais pris pour une preuve d'identité suffisante, chacun daté, peut être faux.
create table registre.identifier (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references registre.tenant(id),
  trade_item_id uuid not null references registre.trade_item(id),
  schema registre.schema_identifiant not null,
  valeur text not null,
  cle_controle_ok boolean,
  source_id smallint not null references registre.source(id),
  ancienne_reference_id uuid,
  observe_le timestamptz not null default now()
);
create index on registre.identifier(valeur);
create index on registre.identifier(trade_item_id);

-- Définition des attributs.
create table registre.attribute_definition (
  code text primary key,
  type text not null check (type in ('texte', 'nombre', 'entier')),
  unite_base text,
  description text not null
);

-- Preuves: document, extrait, emplacement. Les données d'origine de la reprise restent dans public.references_source.
create table registre.evidence (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references registre.tenant(id),
  source_id smallint references registre.source(id),
  nature text not null,
  reference text not null,
  extrait text,
  emplacement jsonb,
  cree_le timestamptz not null default now()
);

-- Observations d'attributs: ajout seul. Une valeur nouvelle ne remplace jamais l'ancienne.
create table registre.attribute_observation (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references registre.tenant(id),
  trade_item_id uuid not null references registre.trade_item(id),
  attribut text not null references registre.attribute_definition(code),
  valeur_texte text,
  valeur_nombre numeric,
  unite text,
  methode registre.methode not null,
  passe text,
  statut registre.statut_observation not null,
  confiance registre.confiance,
  source_id smallint not null references registre.source(id),
  evidence_id bigint references registre.evidence(id),
  modele text,
  prompt_version text,
  lot_ia text,
  cout_eur numeric,
  observe_le timestamptz not null default now(),
  check (valeur_texte is not null or valeur_nombre is not null)
);
create index on registre.attribute_observation(trade_item_id, attribut);
create index on registre.attribute_observation(attribut, statut);

create function registre.interdire_modification() returns trigger
language plpgsql set search_path = '' as $$
begin
  raise exception 'registre.attribute_observation est en ajout seul (AGENTS règle 4)';
end $$;
create trigger observation_ajout_seul before update or delete on registre.attribute_observation
  for each row execute function registre.interdire_modification();

-- Validations: une décision a toujours un auteur, humain ou règle nommée, ou « inconnu » pour la reprise.
create table registre.validation (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references registre.tenant(id),
  trade_item_id uuid not null references registre.trade_item(id),
  decision registre.etat_revue not null,
  auteur_type text not null check (auteur_type in ('humain', 'regle', 'inconnu')),
  auteur text,
  regle_version text,
  decide_le timestamptz,
  notes text
);
create index on registre.validation(trade_item_id);

-- Classements: observation en lecture, jamais décidée ici (ADR-001).
create table registre.classification (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references registre.tenant(id),
  trade_item_id uuid not null references registre.trade_item(id),
  nomenclature text not null,
  version text not null,
  code text not null,
  territoire text,
  debut date, fin date,
  origine text not null,
  reference_decision text
);

-- Relations entre produits (doublon, variante, équivalent, substitut, lot...).
create table registre.relationship (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references registre.tenant(id),
  de_id uuid not null references registre.trade_item(id),
  vers_id uuid not null references registre.trade_item(id),
  type text not null,
  statut registre.statut_observation not null default 'propose',
  methode registre.methode not null,
  source_id smallint references registre.source(id),
  cree_le timestamptz not null default now(),
  check (de_id <> vers_id)
);

-- Sécurité: aucune lecture par les rôles publics, sécurité par ligne activée partout.
do $$ declare t text; begin
  for t in select tablename from pg_tables where schemaname = 'registre' loop
    execute format('alter table registre.%I enable row level security', t);
    execute format('revoke all on registre.%I from anon, authenticated, public', t);
  end loop;
end $$;
alter default privileges in schema registre revoke all on tables from anon, authenticated, public;

-- Attributs de la reprise (contrat de sortie reconstitué, ancien/reconstitution/contrat_sortie.json).
insert into registre.attribute_definition (code, type, unite_base, description) values
  ('nom_source', 'texte', null, 'désignation telle que reçue de la source'),
  ('nom_normalise', 'texte', null, 'désignation normalisée par une règle versionnée'),
  ('designation_normalisee', 'texte', null, 'désignation structurée'),
  ('marque', 'texte', null, 'marque'),
  ('gamme', 'texte', null, 'gamme'),
  ('univers', 'texte', null, 'univers de rayon'),
  ('categorie', 'texte', null, 'catégorie'),
  ('type_produit', 'texte', null, 'type de produit'),
  ('variante', 'texte', null, 'variante (parfum, goût, modèle)'),
  ('caracteristique', 'texte', null, 'caractéristique distinctive'),
  ('format', 'texte', null, 'format en texte libre'),
  ('valeur', 'nombre', null, 'contenance d''une unité, dans l''unité donnée'),
  ('unite', 'texte', null, 'unité de la contenance'),
  ('contenance_ref', 'nombre', 'g ou ml', 'contenance d''une unité ramenée en g ou ml'),
  ('nb_unites_lot', 'entier', null, 'nombre d''unités dans le lot'),
  ('couleur', 'texte', null, 'couleur'),
  ('genre', 'texte', null, 'genre (textile)');
