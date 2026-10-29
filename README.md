# Produit.ai

Infrastructure de connaissance des marchandises physiques: identité des produits, conditionnements, attributs et preuves, sourcés, datés, historisés et vérifiables. Multi-locataire, API d'abord, IA-native.

**Xports** (dépôt `Fran-hd/Xports`) en est le premier consommateur, sans en être une dépendance du cœur. Produit.ai fournit attributs et preuves. Xports applique le droit: classement opposable, règles de taxation, montants. Frontière décidée par l'utilisateur le 28/10/2026 (Xports D132, ici [ADR-001](DECISIONS.md)).

> Nouvel agent: lire [AGENTS.md](AGENTS.md), puis [memory/etat.md](memory/etat.md), puis [DECISIONS.md](DECISIONS.md).

## État au 28/10/2026

- Dépôt créé le 28/10/2026, vide de code. Le code de la première application (normalisation de désignations par lots, interface de revue Streamlit) n'est pas encore versé ici.
- Base Supabase « Produit.ai » (eu-west-1): 437 105 produits d'une base de produits de grande consommation appartenant à l'utilisateur, normalisés par IA, 2 % validés. Audit: [docs/AUDIT-2026-10-28.md](docs/AUDIT-2026-10-28.md).
- Sécurité de cette base corrigée le 28/10/2026: [migrations/20261028_securite_d132.sql](migrations/20261028_securite_d132.sql).

## Organisation

| Chemin | Contenu |
|---|---|
| `DECISIONS.md` | décisions d'architecture (ADR), index en tête |
| `docs/` | audits, PRD, contrats, protocoles de banc |
| `migrations/` | migrations SQL appliquées, dans l'ordre, avec retour arrière |
| `memory/` | état courant (`etat.md`, court, réécrit en place) et journal daté (`journal.md`, ajout seul) |

## Données

Aucune donnée de produit, aucun prix, aucune pièce de client dans ce dépôt. Il ne contient que du code, des schémas, des fixtures fictives et des agrégats.
