// Objectif : montrer qu’une décision incertaine est explicitement envoyée en revue humaine.
import assert from "node:assert/strict";
import { detectResearchOverlap } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const dossier = {
  "id": "revue-1",
  "text": "Deux résumés partagent un terrain et une méthode, mais leurs questions de recherche et livrables semblent distincts.",
  "source": {
    "url": "https://example.test/dossier-ambigu",
    "date": "2026-09-20"
  },
  "details": {
    "origine": "donnée synthétique",
    "signal": "informations incomplètes"
  }
};
const provider = createFakeProvider(() => ({
  model: "jev-1.13.0",
  answers: { decision: {
    type: "choice",
    choice: "partial_overlap",
    probabilities: {
  "strong_overlap": 0.15,
  "partial_overlap": 0.55,
  "distinct": 0.15,
  "same_project": 0.15
},
    confidence: 0.62,
  } },
  usage: { input_tokens: 140, output_tokens: 0 },
}));
const résultat = await detectResearchOverlap(dossier, provider);
assert.equal(résultat.decision, "partial_overlap");
assert.equal(résultat.review, true);
assert.equal(provider.calls, 1);
console.log(`Décision : ${résultat.label} · revue humaine : ${résultat.review} · confiance : ${résultat.confidence}`);
