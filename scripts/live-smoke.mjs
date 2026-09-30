// Objectif : effectuer un appel Jev synthétique uniquement sur demande explicite.
import { createJevClient } from "../src/jev.mjs";
import { detectResearchOverlap } from "../src/index.mjs";
const client = createJevClient();
const résultat = await detectResearchOverlap({
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
}, client);
console.log(JSON.stringify({ décision: résultat.decision, confiance: résultat.confidence, usage: résultat.usage }, null, 2));
