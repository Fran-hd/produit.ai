-- Invariants du schéma « registre ». Chaque ligne doit renvoyer 0 (lecture seule).
select 'unite_sans_produit' controle, count(*) ecarts from registre.trade_item t left join registre.product p on p.id = t.product_id where p.id is null
union all select 'ancien_produit_non_repris', count(*) from public.produits p left join registre.trade_item t on t.id = p.id where t.id is null
union all select 'reference_source_sans_ean_repris', count(*) from public.references_source r where r.ean_source is not null and not exists (select 1 from registre.identifier i where i.ancienne_reference_id = r.id and i.schema <> 'ref_source')
union all select 'gtin_a_cle_fausse', count(*) from registre.identifier where schema = 'gtin' and cle_controle_ok is not true
union all select 'validation_sans_auteur_ni_mention', count(*) from registre.validation where auteur_type = 'inconnu' and notes is null
union all select 'valide_sans_validation', count(*) from registre.trade_item t where t.etat_revue = 'valide' and not exists (select 1 from registre.validation v where v.trade_item_id = t.id)
union all select 'nom_source_manquant', count(*) from registre.trade_item t where not exists (select 1 from registre.attribute_observation o where o.trade_item_id = t.id and o.attribut = 'nom_source')
union all select 'deux_valeurs_retenues_meme_attribut', count(*) from (select trade_item_id, attribut from registre.attribute_observation where statut = 'retenu' group by 1, 2 having count(*) > 1) x
union all select 'import2_avec_valeur_retenue_ia', count(*) from registre.attribute_observation o join registre.trade_item t on t.id = o.trade_item_id join registre.source s on s.id = t.premiere_source_id where s.code = 'articles_2026_05_14' and o.statut = 'retenu' and o.methode = 'ia'
union all select 'ecart_retenu_vs_ancien_marque', count(*) from public.produits p join registre.attribute_observation o on o.trade_item_id = p.id and o.attribut = 'marque' and o.statut = 'retenu' where o.valeur_texte is distinct from p.marque
union all select 'droits_publics_registre', count(*) from information_schema.role_table_grants where table_schema = 'registre' and grantee in ('anon', 'authenticated');
