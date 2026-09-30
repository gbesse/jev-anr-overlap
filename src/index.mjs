// Objectif : implémenter la frontière de décision métier propre au dépôt.
import { readFile } from "node:fs/promises";

export const DECISIONS = Object.freeze({
  "strong_overlap": "recouvrement_fort",
  "partial_overlap": "recouvrement_partiel",
  "distinct": "distincts",
  "same_project": "même_projet"
});
const CRITERIA = Object.freeze({
  "strong_overlap": "recouvrement fort",
  "partial_overlap": "recouvrement partiel",
  "distinct": "distincts",
  "same_project": "même projet"
});

export function researchProjectCase(input) {
  if (!input?.id || !input?.text || !input?.source?.url || !input?.source?.date) throw new TypeError("Le dossier exige id, text, source.url et source.date");
  const date = new Date(input.source.date);
  if (Number.isNaN(date.valueOf())) throw new TypeError("source.date doit être une date ISO valide");
  return { ...input, id: String(input.id), text: String(input.text).trim(), source: { url: String(input.source.url), date: date.toISOString() } };
}

export async function detectResearchOverlap(input, provider) {
  const record = researchProjectCase(input);
  if (record.sourceProjectId !== undefined && record.sourceProjectId === record.candidateProjectId) return { decision: "same_project", label: DECISIONS["same_project"], probability: 1, review: false, deterministic: true };
  const response = await provider.decide({
    state: record,
    questions: { decision: { type: "choice", instructions: "Analysez ce paire de projets ANR à partir des seuls éléments sourcés. Choisissez la catégorie la plus prudente. N’inventez ni fait, ni éligibilité, ni garantie.", criteria: CRITERIA } },
  });
  const answer = response.answers.decision;
  return { decision: answer.choice, label: DECISIONS[answer.choice], probability: answer.probabilities[answer.choice], confidence: answer.confidence, review: answer.confidence < 0.8, deterministic: false, usage: response.usage };
}

export async function runCli(argv, io = console) {
  if (argv.length !== 1) throw new Error("Usage : jev-anr-overlap <dossier.json>");
  const record = researchProjectCase(JSON.parse(await readFile(argv[0], "utf8")));
  io.log(JSON.stringify({ dossier: record, prochaineÉtape: "Transmettez ce dossier à detectResearchOverlap avec un fournisseur Jev configuré." }, null, 2));
}
