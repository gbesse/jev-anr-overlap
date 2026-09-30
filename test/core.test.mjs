// Objectif : vérifier la normalisation, la règle déterministe et la décision sémantique.
import test from "node:test";
import assert from "node:assert/strict";
import { researchProjectCase, detectResearchOverlap } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";
const edge = {
  "id": "limite-1",
  "text": "Cas synthétique traité par une règle déterministe avant toute analyse sémantique.",
  "source": {
    "url": "https://example.test/cas-limite",
    "date": "2026-09-16"
  },
  "sourceProjectId": "ANR-26-TEST-01",
  "candidateProjectId": "ANR-26-TEST-01"
};
test("exige une source", () => assert.throws(() => researchProjectCase({ id: "x", text: "y" }), /source/));
test("applique le cas limite sans appel Jev", async () => { const provider = createFakeProvider(() => { throw new Error("appel interdit"); }); assert.equal((await detectResearchOverlap(edge, provider)).decision, "same_project"); assert.equal(provider.calls, 0); });
test("classe un dossier sourcé", async () => { const provider = createFakeProvider(() => ({ model: "jev-1.13.0", answers: { decision: { type: "choice", choice: "partial_overlap", probabilities: {
  "strong_overlap": 0.05,
  "partial_overlap": 0.85,
  "distinct": 0.05,
  "same_project": 0.05
}, confidence: 0.85 } }, usage: { input_tokens: 10, output_tokens: 0 } })); const result = await detectResearchOverlap({
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
}, provider); assert.equal(result.decision, "partial_overlap"); assert.equal(result.review, false); });
