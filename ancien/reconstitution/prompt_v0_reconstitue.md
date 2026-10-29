# Prompt v0, reconstitué (pas l'original)

*Rédigé le 28/10/2026 à partir du contrat de sortie observé en base. L'original est perdu. À traiter comme une hypothèse: il n'a jamais tourné et ses résultats doivent être comparés aux instantanés `ia_source_1` avant tout usage.*

Tu reçois une désignation brute d'article de grande consommation, éventuellement son EAN et sa marque brute. Rends un objet JSON conforme au schéma `structuration_designation`, sans texte autour.

Règles:
1. Ne déduis rien qui ne soit pas dans la désignation ou les champs fournis. Une variable inconnue vaut `null`.
2. `valeur` et `unite` décrivent une seule unité. Le nombre d'unités d'un lot va dans `nb_unites_lot` (« 6 x 1,5 L »: valeur 1,5, unité « l », lot 6).
3. `univers` est pris dans la liste fermée du schéma.
4. N'écris pas `contenance_ref`: il est calculé ensuite par une règle.
5. `confiance` décrit ta certitude sur l'ensemble: « haute » seulement si marque, type et contenance sont lisibles dans la désignation.
