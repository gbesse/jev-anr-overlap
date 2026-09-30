// Objectif : vérifier que les types publics sont importables.
import { researchProjectCase, detectResearchOverlap } from "../src/index.mjs";
const dossier = researchProjectCase({
  "id": "exemple-1",
  "text": "Deux projets étudient la sobriété hydrique agricole ; l’un porte sur les capteurs, l’autre sur les politiques publiques.",
  "source": {
    "url": "https://example.test/donnee-source",
    "date": "2026-09-15"
  },
  "details": {
    "territoire": "Commune Exemple",
    "origine": "donnée synthétique"
  }
});
void detectResearchOverlap(dossier, { decide: async () => ({}) });
