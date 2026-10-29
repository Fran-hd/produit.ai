"""Règles déterministes de l'ancienne chaîne Produit.ai, reconstituées depuis la base (28/10/2026).

Chaque règle porte sa mesure de concordance sur la base « Produit.ai » (voir RECONSTITUTION.md et mesures.sql).
Rien ici n'appelle un modèle. Rien ici n'est encore utilisé par le nouveau code (ADR-007).
"""
import re
import unicodedata

UNIVERS_CONNUS = ("Alimentaire", "Bazar", "Hygiène", "Droguerie", "Textile",
                  "Électroménager / Multimédia", "Autre")


def _sans_accents(texte: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", texte) if unicodedata.category(c) != "Mn")


def normaliser_v1(nom: str) -> str:
    """Import 1 (13/05/2026): minuscules, sans accents, tout ce qui n'est ni lettre ni chiffre devient
    une espace, espaces de bord retirées. Concordance mesurée: 419 634 sur 420 239 (99,86 %).
    Les décimales perdent leur séparateur (« 1,5 l » devient « 1 5 l »): défaut repris tel quel."""
    return re.sub(r"[^a-z0-9]+", " ", _sans_accents(nom).lower()).strip()


def normaliser_v2(nom: str) -> str:
    """Import 2 (14/05/2026): majuscules sans accents, le reste inchangé.
    Concordance mesurée: 16 606 sur 16 866 (98,5 %). Incompatible avec v1: deux règles pour une même clé."""
    return _sans_accents(nom).upper()


FACTEURS = {"kg": 1000, "l": 1000, "cl": 10}


def contenance_ref(valeur, unite):
    """Contenance ramenée à l'unité de base (g ou ml) pour UNE unité, sans multiplier par le lot.
    Concordance mesurée: 137 427 sur 137 439 (99,99 %)."""
    if valeur is None:
        return None
    return valeur * FACTEURS.get((unite or "").lower(), 1)


def statut_initial() -> str:
    """Tout produit créé par import part « à réviser » (défaut de la colonne `statut`)."""
    return "a_reviser"


def ean_plausible(ean: str) -> bool:
    """Contrôle absent de l'ancienne chaîne: longueur GTIN et clé de contrôle.
    Dans la base: 4 chiffres (codes PLU de magasin) 340 fois, 15 caractères 536 fois."""
    if not ean or not ean.isdigit() or len(ean) not in (8, 12, 13, 14):
        return False
    chiffres = [int(c) for c in ean]
    corps, cle = chiffres[:-1], chiffres[-1]
    somme = sum(c * (3 if i % 2 == 0 else 1) for i, c in enumerate(reversed(corps)))
    return (10 - somme % 10) % 10 == cle


def arbitrer(source_1: dict, source_2: dict, choix: dict) -> tuple[dict, dict]:
    """Arbitrage par variable entre les deux passes IA. `choix` donne, par variable, « source_1 »,
    « source_2 » ou une valeur saisie (« arbitrage »). Renvoie les valeurs retenues et l'origine par
    variable, au format de la colonne `ia_sources`. Les deux instantanés ne sont jamais modifiés."""
    retenu, origine = {}, {}
    for variable in set(source_1) | set(source_2):
        decision = choix.get(variable)
        if decision in (None, "source_1"):
            retenu[variable], origine[variable] = source_1.get(variable), "source_1"
        elif decision == "source_2":
            retenu[variable], origine[variable] = source_2.get(variable), "source_2"
        else:
            retenu[variable], origine[variable] = decision, "arbitrage"
    if not choix:
        origine = {}
    return retenu, origine
