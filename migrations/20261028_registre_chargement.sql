-- Chargement de l'existant dans le schéma « registre » (ADR-002), base Supabase « Produit.ai ».
-- Accord de l'utilisateur: « Go », 28/10/2026 21h35 heure de Martinique.
-- Lit public.* sans le modifier. Blocs exécutés dans l'ordre, chacun idempotent par sa garde.
-- Règles reprises de ancien/RECONSTITUTION.md.

-- Bloc 0. Fonction de contrôle d'un GTIN (longueur et clé).
create or replace function registre.gtin_cle_ok(v text) returns boolean
language sql immutable set search_path = '' as $$
  select case when v ~ '^[0-9]+$' and length(v) in (8, 12, 13, 14) then
    (10 - (select sum(substr(reverse(left(v, -1)), i, 1)::int * case when i % 2 = 1 then 3 else 1 end)
           from generate_series(1, length(v) - 1) i) % 10) % 10 = right(v, 1)::int
  else false end
$$;

-- Bloc 1. Locataire et sources.
insert into registre.tenant (nom) values ('proprietaire') on conflict (nom) do nothing;
insert into registre.source (tenant_id, code, nature, proprietaire, importee_le, ancien_import_id, regle_normalisation, notes)
select t.id, s.code, s.nature, 'utilisateur (ADR-005)', i.date_import, i.id, s.regle, s.notes
from registre.tenant t,
  (values
    ('pgc_2026_05_13', 'catalogue de produits de grande consommation', 'normaliser_v1', 'import 1, 420 239 produits'),
    ('articles_2026_05_14', 'fichier d''articles par région', 'normaliser_v2', 'import 2 interrompu, valeurs IA jamais retenues')
  ) s(code, nature, regle, notes)
  join public.imports i on i.date_import::date = case s.code when 'pgc_2026_05_13' then date '2026-05-13' else date '2026-05-14' end
where t.nom = 'proprietaire'
on conflict (code) do nothing;
insert into registre.source (tenant_id, code, nature, proprietaire, notes)
select t.id, s.code, s.nature, 'utilisateur (ADR-005)', s.notes
from registre.tenant t,
  (values
    ('chaine_ia_2026_05', 'passes IA de l''ancienne chaîne', 'modèle, prompts, coût et lots non conservés'),
    ('revue_2026_05', 'revue humaine de l''ancienne application', 'un relecteur, 13 au 22/05/2026')
  ) s(code, nature, notes)
where t.nom = 'proprietaire'
on conflict (code) do nothing;

-- Bloc 2. Produits et unités commerciales (identifiant de l'ancienne ligne conservé).
insert into registre.product (id, tenant_id, cree_le)
select p.id, t.id, p.created_at from public.produits p, registre.tenant t
where t.nom = 'proprietaire' and not exists (select 1 from registre.product x where x.id = p.id);
insert into registre.trade_item (id, tenant_id, product_id, premiere_source_id, etat_revue, cree_le)
select p.id, t.id, p.id, s.id,
  case p.statut when 'valide' then 'valide' when 'a_arbitrer' then 'a_arbitrer' when 'rejete' then 'rejete' else 'a_reviser' end::registre.etat_revue,
  p.created_at
from public.produits p
join registre.source s on s.ancien_import_id = p.premier_import_id
cross join registre.tenant t
where t.nom = 'proprietaire' and not exists (select 1 from registre.trade_item x where x.id = p.id);

-- Bloc 3. Identifiants: EAN de chaque référence de source, puis référence interne de la source.
-- Durée constatée: environ 10 min pour les EAN (lecture des données d'origine). Lancer avec un délai long:
set statement_timeout = '60min';
create index if not exists identifier_ancienne_reference_id_idx on registre.identifier(ancienne_reference_id);
insert into registre.identifier (tenant_id, trade_item_id, schema, valeur, cle_controle_ok, source_id, ancienne_reference_id, observe_le)
select s.tenant_id, r.produit_id,
  case when registre.gtin_cle_ok(r.ean_source) then 'gtin'
       when r.source_data->>'ean_type' = 'PLU' or r.ean_source ~ '^[0-9]{4,6}$' then 'plu'
       else 'non_conforme' end::registre.schema_identifiant,
  r.ean_source, registre.gtin_cle_ok(r.ean_source), s.id, r.id, r.importe_le
from public.references_source r
join registre.source s on s.ancien_import_id = r.import_id
where r.ean_source is not null
  and not exists (select 1 from registre.identifier x where x.ancienne_reference_id = r.id and x.schema <> 'ref_source');
insert into registre.identifier (tenant_id, trade_item_id, schema, valeur, source_id, ancienne_reference_id, observe_le)
select s.tenant_id, r.produit_id, 'ref_source', coalesce(r.id_source, r.source_data->>'art'), s.id, r.id, r.importe_le
from public.references_source r
join registre.source s on s.ancien_import_id = r.import_id
where coalesce(r.id_source, r.source_data->>'art') is not null
  and not exists (select 1 from registre.identifier x where x.ancienne_reference_id = r.id and x.schema = 'ref_source');

-- Bloc 4. Validations de l'ancienne application: une ligne par produit validé, auteur connu ou « inconnu ».
insert into registre.validation (tenant_id, trade_item_id, decision, auteur_type, auteur, decide_le, notes)
select t.id, p.id, 'valide',
  case when p.revise_par is not null then 'humain' else 'inconnu' end,
  case when p.revise_par is not null then 'relecteur_1' end,
  coalesce(p.revise_le, p.updated_at),
  case when p.revise_par is null then 'validation en masse de l''ancienne application, règle inconnue' end
from public.produits p, registre.tenant t
where t.nom = 'proprietaire' and p.statut = 'valide'
  and not exists (select 1 from registre.validation v where v.trade_item_id = p.id);

-- Bloc 5. Désignation d'origine et nom normalisé (retenus).
insert into registre.attribute_observation (tenant_id, trade_item_id, attribut, valeur_texte, methode, passe, statut, source_id, observe_le)
select s.tenant_id, p.id, 'nom_source', p.name_origine, 'source', null, 'retenu', s.id, p.created_at
from public.produits p join registre.source s on s.ancien_import_id = p.premier_import_id
where p.name_origine is not null;
insert into registre.attribute_observation (tenant_id, trade_item_id, attribut, valeur_texte, methode, passe, statut, source_id, observe_le)
select s.tenant_id, p.id, 'nom_normalise', p.name_normalise, 'regle', s.regle_normalisation, 'retenu', s.id, p.created_at
from public.produits p join registre.source s on s.ancien_import_id = p.premier_import_id
where p.name_normalise is not null;

-- Bloc 6. Valeurs retenues de l'import 1 (colonnes finales de public.produits).
-- Méthode: « humain » si le relecteur a modifié ce champ, « arbitrage » si choisi entre passes ou saisi
-- à l'arbitrage, sinon « ia » (passe 2 quand elle a eu lieu, car elle écrasait les colonnes ia_*). Exécuté par groupe d'attributs (6a, 6b) pour borner la durée.
-- 6a. Attributs texte.
insert into registre.attribute_observation (tenant_id, trade_item_id, attribut, valeur_texte, methode, passe, statut, confiance, source_id, observe_le)
select ci.tenant_id, p.id, a.attr, a.val,
  case when h.produit_id is not null then 'humain'
       when p.ia_sources ? a.attr then 'arbitrage'
       else 'ia' end::registre.methode,
  case when h.produit_id is not null then null
       when p.ia_sources ? a.attr then case when p.ia_sources->>a.attr in ('source_1', 'source_2') then 'ia_' || right(p.ia_sources->>a.attr, 1) end
       when p.ia_source_2 is not null then 'ia_2' else 'ia_1' end,
  'retenu', p.confiance::registre.confiance,
  case when h.produit_id is not null then rv.id else ci.id end,
  p.updated_at
from public.produits p
cross join lateral (values
  ('designation_normalisee', p.designation_normalisee), ('marque', p.marque), ('gamme', p.gamme),
  ('univers', p.univers), ('categorie', p.categorie), ('type_produit', p.type_produit),
  ('variante', p.variante), ('caracteristique', p.caracteristique), ('format', p.format),
  ('unite', p.unite), ('couleur', p.couleur), ('genre', p.genre)) a(attr, val)
left join (select distinct produit_id, champ from public.historique_modifications) h
  on h.produit_id = p.id and h.champ = a.attr
cross join (select id, tenant_id from registre.source where code = 'chaine_ia_2026_05') ci
cross join (select id from registre.source where code = 'revue_2026_05') rv
where a.val is not null
  and p.premier_import_id = (select ancien_import_id from registre.source where code = 'pgc_2026_05_13');
-- 6b. Attributs numériques.
insert into registre.attribute_observation (tenant_id, trade_item_id, attribut, valeur_nombre, methode, passe, statut, confiance, source_id, observe_le)
select ci.tenant_id, p.id, a.attr, a.val,
  case when h.produit_id is not null then 'humain'
       when p.ia_sources ? a.attr then 'arbitrage'
       else 'ia' end::registre.methode,
  case when h.produit_id is not null then null
       when p.ia_sources ? a.attr then case when p.ia_sources->>a.attr in ('source_1', 'source_2') then 'ia_' || right(p.ia_sources->>a.attr, 1) end
       when p.ia_source_2 is not null then 'ia_2' else 'ia_1' end,
  'retenu', p.confiance::registre.confiance,
  case when h.produit_id is not null then rv.id else ci.id end,
  p.updated_at
from public.produits p
cross join lateral (values
  ('valeur', p.valeur), ('contenance_ref', p.contenance_ref), ('nb_unites_lot', p.nb_unites_lot::numeric)) a(attr, val)
left join (select distinct produit_id, champ from public.historique_modifications) h
  on h.produit_id = p.id and h.champ = a.attr
cross join (select id, tenant_id from registre.source where code = 'chaine_ia_2026_05') ci
cross join (select id from registre.source where code = 'revue_2026_05') rv
where a.val is not null
  and p.premier_import_id = (select ancien_import_id from registre.source where code = 'pgc_2026_05_13');

-- Bloc 7. Propositions IA de l'import 2, jamais retenues par l'ancienne chaîne.
insert into registre.attribute_observation (tenant_id, trade_item_id, attribut, valeur_texte, valeur_nombre, methode, passe, statut, confiance, source_id, observe_le)
select ci.tenant_id, p.id, a.attr, a.txt, a.num, 'ia', 'ia_1', 'propose', p.ia_confiance::registre.confiance, ci.id, p.updated_at
from public.produits p
cross join lateral (values
  ('designation_normalisee', p.ia_designation_normalisee, null::numeric), ('marque', p.ia_marque, null), ('gamme', p.ia_gamme, null),
  ('univers', p.ia_univers, null), ('categorie', p.ia_categorie, null), ('type_produit', p.ia_type_produit, null),
  ('variante', p.ia_variante, null), ('caracteristique', p.ia_caracteristique, null), ('format', p.ia_format, null),
  ('unite', p.ia_unite, null), ('valeur', null, p.ia_valeur), ('contenance_ref', null, p.ia_contenance_ref),
  ('nb_unites_lot', null, p.ia_nb_unites_lot::numeric)) a(attr, txt, num)
cross join (select id, tenant_id from registre.source where code = 'chaine_ia_2026_05') ci
where (a.txt is not null or a.num is not null)
  and p.premier_import_id = (select ancien_import_id from registre.source where code = 'articles_2026_05_14');

-- Bloc 8. Instantanés des deux passes IA de l'import 1 (propositions).
insert into registre.attribute_observation (tenant_id, trade_item_id, attribut, valeur_texte, valeur_nombre, methode, passe, statut, confiance, source_id, observe_le)
select ci.tenant_id, p.id, e.key,
  case when d.type = 'texte' then e.value #>> '{}' end,
  case when d.type <> 'texte' and (e.value #>> '{}') ~ '^-?[0-9]+(\.[0-9]+)?$' then (e.value #>> '{}')::numeric end,
  'ia', x.passe, 'propose',
  case when (x.snap->>'confiance') in ('haute', 'moyenne', 'basse') then (x.snap->>'confiance')::registre.confiance end,
  ci.id, p.updated_at
from public.produits p
cross join lateral (values ('ia_1', p.ia_source_1), ('ia_2', p.ia_source_2)) x(passe, snap)
cross join lateral jsonb_each(x.snap) e
join registre.attribute_definition d on d.code = e.key
cross join (select id, tenant_id from registre.source where code = 'chaine_ia_2026_05') ci
where x.snap is not null and e.value <> 'null'::jsonb
  and (d.type = 'texte' or (e.value #>> '{}') ~ '^-?[0-9]+(\.[0-9]+)?$');

-- Journal d'exécution du 28/10/2026 (heure de Martinique)
-- Blocs 0 à 5, 6a, 6b et 7 exécutés. Le bloc 6a, lancé d'abord en une seule requête, a renvoyé une erreur de passerelle
-- mais a continué côté serveur et s'est validé, alors qu'il avait été relancé en 8 morceaux: valeurs texte retenues en double.
-- Correction: déclencheur d'ajout seul désactivé le temps de supprimer les doublons exacts (2 359 203 lignes, la plus
-- ancienne de chaque paire gardée), puis à réactiver. Règle retenue: après une erreur de passerelle, attendre que
-- pg_stat_activity (backend_type = 'client backend', sans filtre de base) soit vide avant toute relance.
-- Bloc 8 (instantanés des deux passes) et invariants (tests/registre_invariants.sql): restant à exécuter.
