# Produit.ai, état courant

> Court, réécrit en place. Historique: [journal.md](journal.md).

## Ce qu'on construit

Plateforme de connaissance des marchandises physiques. Xports en est le premier consommateur, sans dépendance du cœur (ADR-001).

## Règles permanentes

Voir [AGENTS.md](../AGENTS.md). Essentielles: l'IA propose, Produit.ai ne décide ni classement ni montant, aucune contradiction écrasée, aucune mutualisation entre clients, aucune donnée réelle dans le dépôt.

## État

| Chantier | État au 28/10/2026 |
|---|---|
| Dépôt | créé, structure posée, maquettes d'interface versées (`ancien/`) |
| Base Supabase « Produit.ai » | 437 105 produits, sécurité corrigée (ADR-004), inactive depuis le 22/05/2026 |
| Schéma canonique (ADR-002, décidé) | à écrire |
| Ancien code (ADR-007) | maquettes inventoriées, chaîne reconstituée depuis la base (`ancien/RECONSTITUTION.md`), prompts perdus |
| Société Produit.ai (ADR-006) | à créer |

## En attente

1. Création de la société Produit.ai.

## Suite proposée

Schéma canonique et import de l'existant comme source, puis rapprochement des lignes Xports (API `resolve` en lecture), puis pilote de 10 000 références en mode fantôme côté Xports (plan: Xports, PRODUIT-AI.md §5).
