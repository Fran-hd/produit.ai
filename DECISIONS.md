# Décisions d'architecture (ADR)

Gabarit: décision, pourquoi (coût complet, fiabilité, performance, sécurité, scalabilité, productivité des agents), options écartées, conséquences, ce qui l'invaliderait. Une révision n'efface rien, elle ajoute un bloc daté.

## Index

| N° | Objet | Statut | Date |
|---|---|---|---|
| ADR-001 | Frontière avec Xports et sens de la dépendance | décision de l'utilisateur | 28/10/2026 |
| ADR-002 | Schéma canonique neuf, l'existant chargé comme une source | décision de l'utilisateur | 28/10/2026 |
| ADR-003 | Monolithe modulaire sur Postgres | décision de l'utilisateur | 28/10/2026 |
| ADR-004 | Sécurité de la base existante | décision de l'utilisateur, appliquée | 28/10/2026 |
| ADR-005 | Données de la base existante | décision de l'utilisateur | 28/10/2026 |
| ADR-006 | Une société Produit.ai à créer, Xports client par contrat | décision de l'utilisateur | 28/10/2026 |
| ADR-007 | Reprise du code de l'ancienne application après inventaire | décision de l'utilisateur | 28/10/2026 |

---

## ADR-001 — Frontière avec Xports *(décision de l'utilisateur, 28/10/2026, 20h45 heure de Martinique)*

**Décision.** Produit.ai tient l'identité de l'article, ses conditionnements, ses attributs et leurs preuves. Xports tient le classement opposable et sa fiche, les règles et tous les montants. Un classement validé dans Xports est stocké ici comme observation en lecture, jamais produit ici. Le cœur de Produit.ai ne connaît pas Xports, qui l'appelle par un contrat versionné et ne bloque jamais s'il est indisponible. Le registre d'articles décidé dans Xports (D131) vit ici. Réponse de l'utilisateur: « Oui, dans Produit.ai ».

**Pourquoi.** Une seule identité d'article pour tous les consommateurs, le droit reste dans un moteur déterministe, Produit.ai vendable seul.

**Options écartées.** Registre construit dans Xports (seconde identité d'article). Produit.ai décidant le classement (mélange de la proposition et de l'acte opposable).

**Ce qui l'invaliderait.** Un coût ou une latence d'appel incompatibles avec le traitement d'un dossier Xports.

## ADR-002 — Schéma canonique neuf *(proposée le 28/10/2026, décision de l'utilisateur « Oui, schéma neuf » à 21h05 heure de Martinique)*

**Décision.** Repartir d'un schéma minimal: `tenant`, `source`, `product`, `trade_item` (unité commerciale et son GTIN), `packaging_level` (carton, palette), `identifier` (GTIN, référence client, référence fournisseur, chacun daté et pouvant être faux), `attribute_observation` (valeur, unité, méthode, confiance, statut, date, droits), `evidence` (document, extrait, emplacement), `classification` (nomenclature, version, territoire, période, origine de la décision). Les 437 105 produits existants entrent comme une source datée, valeurs d'origine et deux passes IA conservées. Rapprochement à sorties multiples (identique, variante, conditionnement différent, similaire, distinct, ambigu, inconnu), fusion réversible, aucune fusion automatique sous un seuil fixé avant la mesure.

**Pourquoi.** Dans la table actuelle, l'EAN est l'identité, sans conditionnement ni provenance par attribut, et 939 EAN sont mal formés (audit).

**Options écartées.** Étendre la table plate: la dette serait reportée sur chaque consommateur.

**Ce qui l'invaliderait.** Un besoin limité durablement au catalogue de grande consommation à un seul niveau de conditionnement.

## ADR-003 — Monolithe modulaire sur Postgres *(proposée le 28/10/2026, décision de l'utilisateur « Oui » à 21h05 heure de Martinique)*

**Décision.** Un service, des modules (Registry, Identity, Attributes, Evidence, Import, Search, Trust, API), Postgres et Supabase, workers à part pour les traitements longs. Recherche plein texte d'abord, `pgvector` seulement si un banc montre que le lexical ne suffit pas, base graphe seulement après banc de requêtes réelles.

**Pourquoi.** Coût et charge d'exploitation minimaux, transactions simples, même socle que Xports.

**Options écartées.** Microservices, base vectorielle ou graphe dès le départ: aucune mesure ne les justifie.

**Ce qui l'invaliderait.** Un banc de rapprochement où le lexical reste nettement sous le vectoriel, ou une charge qui sature une instance.

## ADR-004 — Sécurité de la base existante *(décision de l'utilisateur « Oui, tout corriger », 28/10/2026, 20h45, appliquée vers 20h46 heure de Martinique)*

**Constat.** La vue `produits_avec_sources`, en `SECURITY DEFINER`, était lisible par le rôle public `anon`: les 437 105 produits étaient lisibles avec la clé publique.

**Fait.** Vue en `security_invoker`, droits des rôles `anon` et `authenticated` retirés sur tables, séquences, fonctions et privilèges par défaut, chemins de recherche fixés, `unaccent` sorti de `public`. Conseiller Supabase: 0 erreur, 0 avertissement. [Migration](migrations/20261028_securite_d132.sql).

**Reste.** Table `users` maison (empreintes de mot de passe) accessible au seul rôle de service, à remplacer par l'authentification de Supabase dans le schéma de ADR-002. Politiques par locataire à écrire avec ce schéma.

**Conséquence.** Une application qui lisait la base avec la clé publique ne la lit plus.

## ADR-005 — Données de la base existante *(décision de l'utilisateur, 28/10/2026, 20h55 heure de Martinique)*

**Décision.** Les 420 622 lignes importées le 13/05/2026 appartiennent à l'utilisateur: « Les données m'appartiennent. Pas besoin de contrat ». Elles sont chargées comme une source dont le propriétaire est l'utilisateur.

**Conséquence.** Aucun blocage de droits sur leur réutilisation. Leur provenance (fournisseur d'origine, date d'acquisition) reste à inscrire dans la fiche de la source, pour qu'une donnée publiée puisse toujours être retracée.

**Ce qui l'invaliderait.** Des conditions d'acquisition restreignant la redistribution publique.

## ADR-006 — Entité *(décision de l'utilisateur, 28/10/2026, 21h05 heure de Martinique)*

**Décision.** Produit.ai sera porté par une société Produit.ai à créer, distincte de la société Xports. Elle détiendra le code, la base, le domaine `produit.ai` et la marque. Xports en sera client par contrat (accès à l'API, niveau de service, prix, sort des données à la fin du contrat).

**Pourquoi.** Cohérent avec ADR-001: Produit.ai vendable seul, Xports remplaçable comme consommateur, chaque société avec son propre actif.

**Conséquences.** Tant que la société n'existe pas, le code, la base et le domaine restent à l'utilisateur, à apporter à la société à sa création. Le contrat Xports ↔ Produit.ai porte aussi le cloisonnement des données des transitaires équipés par Xports.

**Ce qui l'invaliderait.** Un montage juridique ou fiscal plus simple proposé par la juriste ou l'expert-comptable.

## ADR-007 — Ancien code *(décision de l'utilisateur, 28/10/2026, 21h05 heure de Martinique)*

**Décision.** L'utilisateur verse le code de l'ancienne application (normalisation par lots, revue Streamlit). Il est inventorié avant toute reprise: prompts et leurs versions, coût par référence, taux de correction, dette, secrets éventuels. Il est rangé dans `ancien/`, en lecture, et rien n'en passe dans le nouveau code sans test.

**Pourquoi.** Les deux passes IA conservées et l'arbitrage par attribut sont des acquis. Le coût par référence ne peut être mesuré qu'à partir du code et de ses journaux.

**Ce qui l'invaliderait.** Un code trop couplé à la table plate pour être repris utilement.
