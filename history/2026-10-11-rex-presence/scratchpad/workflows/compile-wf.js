export const meta = {
  name: 'rex-presence-compile',
  description: 'Apply each research verifier\'s corrections and write the final facts for research/final-presence.json, one topic per agent',
  phases: [{ title: 'Compile', detail: 'one agent per topic: research + verifier corrections -> final facts' }],
}
const W = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/'
const OUT = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/compiled/'
const REPO = '/home/user/rex-strength-lab'
const topics = args || []
const RES = { type: 'object', properties: { file: { type: 'string' }, n_facts: { type: 'number' }, changes: { type: 'array', items: { type: 'string' } }, dropped: { type: 'array', items: { type: 'string' } }, open_issues: { type: 'string' } }, required: ['file', 'n_facts', 'changes', 'dropped', 'open_issues'] }
const results = await parallel(topics.map((t) => () => agent(`You are compiling the verified research for topic "${t}" of the Rex Super-Strength Lab presence brief (${REPO}/rex-strength-lab/BRIEF-presence.md). Read ${W}research_${t}.json (the researcher's facts, summary, model recommendation and gaps) and ${W}verify_${t}.json (a skeptical verifier's per-fact checks with corrections, recommendation issues and missing items).
Write ${OUT}${t}.json (create the folder) as {"facts": [...], "gaps": "..."} in the lab's research format, the same as ${REPO}/rex-strength-lab/research/final-environment.json: each fact has key, category ("presence_${t}"), label, status, value_si, unit_si, low_si, high_si, display, sources [{title, url}], notes, who_when, and optionally values_json. Rules:
- Apply EVERY verifier correction marked ok=false: fix the value, range, display, status, label, quote or source as the correction says. Where the verifier says a claim is unsupported, downgrade the status (verified -> reported or estimate) or drop the fact, and say which in your changes list.
- Statuses: verified (number seen in a fetched primary or authoritative source; "as reproduced in" is fine when the reproduction is an agency document), derived (our computation from verified inputs; give the formula and inputs in notes), estimate (a reasoned assumption), reported (secondary or weak source), disputed. Never upgrade a status.
- Keep notes factual and short (under about 900 characters): the exact quote or table cell, the conditions, the caveat, and "Verifier: ..." for anything the verifier changed.
- Add the verifier's important missing items only if the verifier fetched and confirmed them (with the URL); otherwise mention them in gaps.
- Keep values in SI with the original units in display. value_si must be a number or null.
Do not edit anything under ${REPO}. Return the file path, the fact count, a list of what you changed (one line each, naming the key), what you dropped, and any open issue the page must handle (for example a number that must be labelled an estimate, or a conflict between sources).`, { label: 'compile:' + t, phase: 'Compile', schema: RES })))
return results.filter(Boolean)
