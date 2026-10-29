-- Base Supabase « Produit.ai » (hwuwzikyrzfztiyeevfp), migration « securite_d132_fermeture_acces_publics »
-- Appliquée le 28/10/2026 vers 20h46 heure de Martinique, sur autorisation de l'utilisateur (« Oui, tout corriger », D132).
-- Déplacée depuis Fran-hd/Xports (PRODUIT-AI.md §7) le 28/10/2026.
-- Retour arrière: alter view public.produits_avec_sources reset (security_invoker) ; grant select on ... to anon (à ne pas faire sans politique par locataire).
alter view public.produits_avec_sources set (security_invoker = true);
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke all on functions from anon, authenticated;
alter function public.set_maj_le() set search_path = '';
alter function public.set_updated_at() set search_path = '';
alter function public.marques_set_maj_le() set search_path = '';
alter function public.regroupements_set_maj_le() set search_path = '';
alter extension unaccent set schema extensions;
