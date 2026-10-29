# Ancien code de Produit.ai (inventaire)

*Versé par l'utilisateur le 28/10/2026 à 21h15 heure de Martinique (archive « Produit.ai.zip », 11 Mo, 67 fichiers). Inventaire du même soir. Lecture seule: rien n'en passe dans le nouveau code sans test (ADR-007).*

## 1. Ce que contient l'archive

**Ce n'est pas la chaîne de traitement.** L'archive ne contient ni le traitement par lots, ni l'application de revue Streamlit, ni les prompts, ni de code relié à la base. C'est un **prototype d'interface**: une toile de maquettes React (JSX chargé par Babel dans le navigateur) avec des données fictives. Aucun secret trouvé (recherche de clés, mots de passe, adresses Supabase, jetons).

| Versé dans `maquettes/` | Écarté du dépôt, et pourquoi |
|---|---|
| 29 fichiers JSX, la page `Enrichissement Articles.html`, l'état de la toile | 9 photos de produits et 15 images téléversées (emballages de marques, droits des marques), 4 captures d'écran (contenu non vérifié), 7 images de débogage, la vignette |

La page s'ouvre dans un navigateur, les photos de produits n'y apparaîtront plus.

## 2. Les 17 écrans, en trois sections

| Section | Écrans | Ce qu'ils explorent |
|---|---|---|
| Enrichissement et structuration | A (liste, fiche à onglets), B, B restylée, C (tableur), D (structure de libellé), D2 (file IA au clavier), D3 (groupes par motif), D4 (revue avant / après), D5 (tableur dense), D6 (tableur IA), D7 (constructeur glisser-déposer), E (dictionnaire d'abréviations) | structurer les désignations: marque, type, contenance, unité, à partir d'un libellé brut |
| Marques | V1 liste et détail, V2 galerie, V3 tableau en masse, V4 groupes actionnaires | référentiel marque et groupe (tables `marques`, `regroupements` de la base) |
| Liaisons entre articles | F1 clusters, F2 file IA, F3 graphe et matrice | huit types de liens: doublon, équivalent MDD, équivalent marque nationale, variante, version, substitut, vente associée, lot |

## 3. Ce qui se reprend

| Acquis | Où il sert dans la cible |
|---|---|
| D6 (tableur avec suggestion IA et confiance par cellule, panneau latéral, J/K/Y/N) | parcours de validation du Product Studio (prompt maître §11), à confronter à la visionneuse à double panneau de Xports (D96) |
| D3 et D4 (validation d'un motif ou d'un lot en une signature) | réduire les minutes humaines par article: une décision couvre N lignes, chacune gardant sa trace |
| D7 et la table `formules` (structure de libellé en jetons) | règle déterministe de normalisation, versionnée, appliquée sans modèle |
| E (dictionnaire d'abréviations) | normalisation déterministe avant tout appel modèle |
| Huit types de liens (F) | entité `ProductRelationship` (prompt maître §4), avec les sorties du rapprochement d'ADR-002 |
| Marques et groupes actionnaires | entités `Organization` et marque, avec la typologie déjà en base |

## 4. Ce qui ne se reprend pas tel quel

- **Validation automatique au-dessus de 95 % de confiance** (D2): une confiance brute n'est pas une probabilité. Seuil seulement après calibration mesurée (prompt maître §7, AGENTS règle 3).
- **Doublons « à fusionner »** (F): toute fusion reste réversible, aucune fusion automatique sous un seuil fixé avant la mesure (ADR-002).
- **Prix dans les liaisons**: hors périmètre tant que la surface publique n'est pas cadrée.
- **React chargé par Babel dans le navigateur**: bon pour une maquette, pas pour la production.

## 5. Ce qui manque encore

Le code de la chaîne réelle: lecture du fichier source, appels par lots (deux passes), arbitrage, application Streamlit. Sans lui, le coût par référence et le taux de correction ne se mesurent pas. S'il est introuvable, la logique se reconstitue depuis la base (instantanés des deux passes, origine retenue par variable, formule de libellé), mais pas les prompts.
