# Produit.ai, état courant

> Court, réécrit en place. Historique: [journal.md](journal.md).

## Ce qu'on construit

Plateforme de connaissance des marchandises physiques. Xports en est le premier consommateur, sans dépendance du cœur (ADR-001).

## Règles permanentes

Voir [AGENTS.md](../AGENTS.md). Essentielles: l'IA propose, Produit.ai ne décide ni classement ni montant, aucune contradiction écrasée, aucune mutualisation entre clients, aucune donnée réelle dans le dépôt.

## État

| Chantier | État au 28/10/2026 |
|---|---|
| Dépôt | créé, structure posée, aucun code |
| Base Supabase « Produit.ai » | 437 105 produits, sécurité corrigée (ADR-004), inactive depuis le 22/05/2026 |
| Schéma canonique (ADR-002) | proposé, à écrire |
| Code de l'ancienne application | non versé |

## En attente

1. Entité juridique qui porte Produit.ai (société Xports, autre société, holding).
2. Verser le code de l'ancienne application, s'il doit être repris.
3. Valider ADR-002 et ADR-003.

## Suite proposée

Schéma canonique et import de l'existant comme source, puis rapprochement des lignes Xports (API `resolve` en lecture), puis pilote de 10 000 références en mode fantôme côté Xports (plan: Xports, PRODUIT-AI.md §5).
