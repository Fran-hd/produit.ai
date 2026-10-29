# Règles de travail des agents

1. **Faits, hypothèses, décisions.** Chaque constat cite sa preuve (requête, fichier, test). Une hypothèse est marquée comme telle. Ne jamais prétendre avoir testé, déployé ou intégré sans preuve.
2. **Auditer avant de modifier.** Lecture seule par défaut. Toute modification externe (base, déploiement, dépense, collecte) attend l'accord écrit de l'utilisateur, noté dans `memory/journal.md`.
3. **Probabiliste et déterministe.** L'IA perçoit et propose. Une proposition enregistre modèle, version du prompt, sources lues et confiance. Produit.ai ne décide jamais un classement douanier ni un montant: c'est le rôle du consommateur (Xports).
4. **Aucune contradiction écrasée en silence.** Une valeur nouvelle s'ajoute comme observation, l'ancienne reste avec sa date.
5. **Isolation.** Aucune mutualisation entre clients, implicite ou non. Chaque table de données porte son locataire et une politique de sécurité par ligne.
6. **Données hors dépôt.** Ni produits réels, ni prix, ni pièces de clients. Fixtures fictives seulement.
7. **Simplicité mesurée.** Monolithe modulaire sur Postgres tant qu'aucune mesure ne justifie la distribution. Vecteurs, graphe ou nouveau service seulement après un banc.
8. **Tenue.** Chaque arbitrage = un ADR dans `DECISIONS.md` (décision, pourquoi, options écartées, conséquences, ce qui l'invaliderait) et une ligne datée au journal. Dates à l'heure de la Martinique.
9. **Chaque fonctionnalité** livre: besoin, interface, contrat, tests, migration avec retour arrière, observabilité, documentation.
10. **Rédaction.** En français. Pas de point-virgule, pas d'espace avant « : ? ! », pas de tiret long, guillemets « ainsi ».
11. **Committer et pousser** chaque travail. Un travail non poussé n'est pas livré.
