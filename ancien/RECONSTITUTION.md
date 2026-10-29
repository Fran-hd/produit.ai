# Reconstitution de l'ancienne chaîne de traitement

*Faite le 28/10/2026 au soir (heure de Martinique), à la demande de l'utilisateur (« Reconstitue »), en lecture seule sur la base Supabase « Produit.ai ». Le code d'origine est introuvable. Chaque constat est mesuré, les requêtes sont dans [reconstitution/mesures.sql](reconstitution/mesures.sql). Agrégats seulement.*

## 1. La chaîne telle qu'elle a tourné

| Étape | Ce que la base montre | Preuve |
|---|---|---|
| 1. Passe IA hors base | les désignations ont été structurées avant l'import, dans un fichier « CSV IA » de 421 412 lignes (traitement par lots, résultats ramenés en fichier) | note de l'import du 13/05/2026 |
| 2. Import 1 (13/05/2026) | fichier source de 23 colonnes (identifiant, EAN, nom, marque brute, poids, unité, catégorie sur trois niveaux avec méthode et probabilité, prix minimum, maximum et moyen, dates), correspondance limitée à EAN, nom et identifiant. 420 239 produits créés, 1 173 lignes écartées (doublons de nom normalisé ou lignes « ### ») | table `imports`, clés de `source_data` |
| 3. Normalisation du nom | règle v1: minuscules, sans accents, tout signe non alphanumérique remplacé par une espace | 419 634 sur 420 239 (99,86 %) |
| 4. Copie IA → valeurs retenues | sur l'import 1, les colonnes retenues sont égales aux colonnes `ia_*`, confiance comprise | aucune différence sur l'import 1 |
| 5. Contenance de référence | `valeur` ramenée en g ou en ml (kg et l × 1000, cl × 10), pour une unité, sans le lot | 137 427 sur 137 439 (99,99 %) |
| 6. Seconde passe (« Batch B ») | 18 380 produits repassés sur un « libellé phase 2 ». Les colonnes `ia_*` sont écrasées par la seconde passe | colonnes `ia_source_2`, commentaire de colonne |
| 7. Arbitrage | 3 620 produits arbitrés variable par variable (type de produit 3 278 fois, marque 418), origine retenue: première passe 1 931, seconde 1 666, valeur saisie 99. 4 479 produits encore « à arbitrer » | `ia_sources`, `statut` |
| 8. Revue humaine | un seul relecteur, du 13 au 22/05/2026, 146 produits modifiés, 618 champs (marque 123, type 104, catégorie 89, variante 61) | `historique_modifications` |
| 9. Validation | 8 794 produits « validés », dont 144 par le relecteur. Les 8 650 autres n'ont pas d'auteur: validation en masse, règle inconnue (ni la confiance seule, ni le statut d'arbitrage ne l'expliquent) | `revise_par` |
| 10. Import 2 (14/05/2026) | fichier d'articles (code article, EAN brut, type d'EAN, région sur 3 valeurs). 38 712 références: 21 841 rattachées à des produits existants par l'EAN, 16 866 produits créés avec une **autre règle de normalisation** (v2, majuscules sans accents), passe IA faite mais **non recopiée** dans les valeurs retenues. Compteurs jamais mis à jour, import resté « en cours »: chaîne interrompue | `premier_import_id`, `references_source` |
| 11. Marques | 630 marques typées (nationale 468, MDD 97, locale 24, premier prix 9, non typées 32), 471 rattachées à un groupe actionnaire. 44,7 % des produits qui ont une marque la trouvent dans ce référentiel | `marques`, jointure |
| 12. Constructeur de libellé | une seule formule, vide: jamais configuré | `formules` |

## 2. Fidélité des deux passes IA

Sur les 3 620 produits dont les deux instantanés existent:

| Variable | Accord entre les deux passes |
|---|---|
| type de produit | 96,7 % |
| catégorie | 84,5 % |
| unité | 67,1 % |
| marque | 63,6 % |
| valeur (comparée en nombre) | 62,3 % |
| désignation normalisée | 6,5 % (6,9 % sans casse ni accents) |

Ces produits ont été choisis pour une seconde passe, sans doute parce qu'ils posaient problème. L'accord n'est donc pas représentatif de toute la base. Il dit au moins que la désignation normalisée n'est pas une sortie stable, et qu'elle ne peut pas servir de clé.

## 3. Défauts relevés

1. **Deux règles de normalisation** pour une même clé (v1 et v2 selon l'import): le nom normalisé ne permet pas de rapprocher les deux imports.
2. **Décimales perdues** par la règle v1 (« 1,5 l » devient « 1 5 l »).
3. **Vocabulaires ouverts**: 24 univers dont des doublons d'accent (« Hygiène » et « Hygiene »), 33 675 types de produit, 100 catégories produites par l'IA.
4. **Codes PLU de magasin stockés comme EAN** (340 à 4 chiffres) et 536 EAN à 15 caractères: l'identifiant n'est pas contrôlé.
5. **Première passe perdue** pour 14 760 des 18 380 produits repassés: l'instantané n'existe que pour 3 620.
6. **8 650 validations sans auteur.**
7. **Import 2 interrompu**: 16 866 produits sans valeurs retenues.
8. **Ni modèle, ni prompt, ni coût, ni identifiant de lot** conservés (`batch_ids` vide): le coût par référence n'est pas reconstituable.

## 4. Ce que la reconstitution livre

| Fichier | Contenu |
|---|---|
| [reconstitution/regles.py](reconstitution/regles.py) | les règles déterministes retrouvées (normalisation v1 et v2, contenance de référence, statut initial, arbitrage), plus un contrôle d'EAN que l'ancienne chaîne n'avait pas |
| [reconstitution/tests.py](reconstitution/tests.py) | invariants sur des exemples fictifs (`python3 tests.py` dans le dossier) |
| [reconstitution/contrat_sortie.json](reconstitution/contrat_sortie.json) | contrat de sortie des passes IA (14 variables), vocabulaires observés |
| [reconstitution/prompt_v0_reconstitue.md](reconstitution/prompt_v0_reconstitue.md) | prompt **reconstitué, pas l'original**, à comparer aux instantanés avant tout usage |
| [reconstitution/mesures.sql](reconstitution/mesures.sql) | requêtes pour relancer chaque mesure |

## 5. Conséquences pour le nouveau schéma (ADR-002)

- L'existant entre comme **deux sources distinctes** (import 1 et import 2), chacune avec ses valeurs d'origine, ses instantanés IA et sa règle de normalisation.
- Une seule règle de normalisation, versionnée, qui garde les décimales. Le nom normalisé reste un attribut, jamais une clé d'identité.
- Chaque passe IA devient une observation datée, avec modèle, version du prompt, coût et identifiant de lot. Rien n'écrase une passe précédente.
- `contenance_ref` est calculée par règle, plus demandée au modèle.
- Les codes PLU deviennent des identifiants internes de leur source, jamais des GTIN.
- Une validation a toujours un auteur, humain ou règle nommée et versionnée.
