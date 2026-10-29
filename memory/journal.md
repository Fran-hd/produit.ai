# Journal de Produit.ai

Ajout seul. Heure de la Martinique.

- 2026-10-28 20h30-21h00 : trois documents de l'utilisateur (note stratégique, architecture et pilote, prompt maître) analysés dans Xports (PRODUIT-AI.md, D132). Audit en lecture seule de la base Supabase « Produit.ai ».
- 2026-10-28 20h45 : réponses de l'utilisateur. Frontière « Oui, dans Produit.ai » (ADR-001), « Oui, tout corriger » (ADR-004, migration appliquée vers 20h46), dépôt séparé.
- 2026-10-28 20h55 : « Dépôt créé » (`Fran-hd/produit.ai`). « Les données m'appartiennent. Pas besoin de contrat » (ADR-005). Structure initiale posée: README, AGENTS, DECISIONS, audit, migration, mémoire.
- 2026-10-28 21h05 : « pose moi les questions ». Entité « Une société Produit.ai à créer » (ADR-006), ancien code « Oui, je le verse » (ADR-007), schéma neuf « Oui » (ADR-002), architecture « Oui » (ADR-003).
- 2026-10-28 21h10 : « je souhaite quelque chose d'automatique » (versement de l'ancien code). Recherche automatique faite: Documents, Bureau et Téléchargements du Mac (accès accordés), dossier Projects (noms), fonctions Edge et migrations de la base. Aucun code trouvé. La base ne contient que 4 migrations de mai (marques, regroupements) et aucune fonction. Le code est probablement dans un dépôt GitHub (déploiement Streamlit), nom à obtenir.
- 2026-10-28 21h15 : archive « Produit.ai.zip » versée (67 fichiers). C'est un prototype d'interface (17 écrans, données fictives, aucun secret), pas la chaîne de traitement. Code versé dans `ancien/maquettes/`, images de marques, captures et débogage écartés. Inventaire: `ancien/README.md`.
- 2026-10-28 21h23 : « Reconstitue ». Chaîne reconstituée en lecture seule depuis la base (`ancien/RECONSTITUTION.md`): passe IA hors base puis import 1, normalisation v1 (99,86 %), contenance de référence (99,99 %), seconde passe sur 18 380 produits, arbitrage de 3 620, un relecteur, 8 650 validations sans auteur, import 2 interrompu avec une autre normalisation. Règles en Python testées, contrat de sortie, prompt v0 reconstitué (hypothèse), requêtes de mesure.
