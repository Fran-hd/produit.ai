-- Mesures de la reconstitution, base Supabase « Produit.ai », lecture seule. Relancer pour vérifier RECONSTITUTION.md.
-- 1. Règle de normalisation par import
select premier_import_id, count(*) n,
  sum((name_normalise = btrim(regexp_replace(lower(extensions.unaccent(name_origine)),'[^a-z0-9]+',' ','g')))::int) v1,
  sum((name_normalise = upper(extensions.unaccent(name_origine)))::int) v2
from produits group by 1;
-- 2. Contenance de référence
select count(*) n, sum((contenance_ref = valeur * case lower(unite) when 'kg' then 1000 when 'l' then 1000 when 'cl' then 10 else 1 end)::int) ok
from produits where contenance_ref is not null and valeur is not null;
-- 3. Accord des deux passes IA, par variable
select count(*) n,
  sum((ia_source_1->>'marque' is not distinct from ia_source_2->>'marque')::int) marque,
  sum((ia_source_1->>'type_produit' is not distinct from ia_source_2->>'type_produit')::int) type_produit,
  sum((ia_source_1->>'unite' is not distinct from ia_source_2->>'unite')::int) unite,
  sum((ia_source_1->>'categorie' is not distinct from ia_source_2->>'categorie')::int) categorie
from produits where ia_source_1 is not null and ia_source_2 is not null;
-- 4. Statuts, validation humaine
select statut, count(*), count(revise_par) par_humain from produits group by 1;
-- 5. Identifiants
select length(ean) l, count(*) from produits group by 1 order by 2 desc;
