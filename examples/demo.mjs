// Objectif : montrer une décision sémantique avec des données entièrement synthétiques.
import assert from "node:assert/strict";
import { detectResearchOverlap } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
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
};
const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "partial_overlap", probabilities: {
  "strong_overlap": 0.05,
  "partial_overlap": 0.85,
  "distinct": 0.05,
  "same_project": 0.05
}, confidence: 0.85 } }, usage: { input_tokens: 120, output_tokens: 0 } }));
const résultat = await detectResearchOverlap(dossier, provider);
assert.equal(résultat.decision, "partial_overlap");
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · probabilité : ${résultat.probability}`);
