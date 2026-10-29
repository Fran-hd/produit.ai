"""Invariants des règles reconstituées, sur des exemples fictifs."""
import unittest
from regles import normaliser_v1, normaliser_v2, contenance_ref, ean_plausible, arbitrer, statut_initial


class Regles(unittest.TestCase):
    def test_normaliser_v1(self):
        self.assertEqual(normaliser_v1("  Pâte à Tartiner « Choco » 750g "), "pate a tartiner choco 750g")
        self.assertEqual(normaliser_v1("Eau 6x1,5L"), "eau 6x1 5l")

    def test_normaliser_v2(self):
        self.assertEqual(normaliser_v2("Pâte à tartiner 750g"), "PATE A TARTINER 750G")

    def test_v1_et_v2_divergent(self):
        self.assertNotEqual(normaliser_v1("Thé vert"), normaliser_v2("Thé vert"))

    def test_contenance(self):
        self.assertEqual(contenance_ref(1.5, "L"), 1500)
        self.assertEqual(contenance_ref(75, "cl"), 750)
        self.assertEqual(contenance_ref(250, "g"), 250)
        self.assertEqual(contenance_ref(4, "rouleaux"), 4)
        self.assertIsNone(contenance_ref(None, "g"))

    def test_ean(self):
        self.assertTrue(ean_plausible("4006381333931"))
        self.assertFalse(ean_plausible("4006381333932"))
        self.assertFalse(ean_plausible("1234"))
        self.assertFalse(ean_plausible("123456789012345"))

    def test_arbitrage_conserve_les_deux_passes(self):
        s1, s2 = {"marque": "A", "type_produit": "chips"}, {"marque": "B", "type_produit": "chips"}
        retenu, origine = arbitrer(s1, s2, {"marque": "source_2"})
        self.assertEqual(retenu["marque"], "B")
        self.assertEqual(origine["marque"], "source_2")
        self.assertEqual(s1["marque"], "A")
        retenu, origine = arbitrer(s1, s2, {"marque": "C"})
        self.assertEqual((retenu["marque"], origine["marque"]), ("C", "arbitrage"))

    def test_statut(self):
        self.assertEqual(statut_initial(), "a_reviser")


if __name__ == "__main__":
    unittest.main()
