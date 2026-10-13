export const meta = {
  name: 'gui-b-escape-facts',
  description: 'Research and skeptic-check the escape-speed facts for very fast throws (BRIEF-gui.md 5a)',
  phases: [
    { title: 'Research', detail: 'researcher fetches primary sources' },
    { title: 'Skeptic', detail: 'skeptic re-fetches every source and checks every number' },
  ],
}

const FACTS = {
  type: 'object',
  properties: {
    facts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          category: { type: 'string' },
          label: { type: 'string' },
          status: { type: 'string', enum: ['verified', 'official', 'reported', 'derived', 'estimate'] },
          value_si: { type: 'number' },
          unit_si: { type: 'string' },
          low_si: { type: ['number', 'null'] },
          high_si: { type: ['number', 'null'] },
          display: { type: 'string' },
          sources: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, url: { type: 'string' } }, required: ['title', 'url'] } },
          notes: { type: 'string' },
          who_when: { type: 'string' },
          quote: { type: 'string', description: 'the exact sentence or table cell on the fetched page that carries the number' },
        },
        required: ['key', 'category', 'label', 'status', 'value_si', 'unit_si', 'display', 'sources', 'notes', 'quote'],
      },
    },
    gaps: { type: 'array', items: { type: 'string' } },
  },
  required: ['facts', 'gaps'],
}
const VERDICTS = {
  type: 'object',
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          fetched: { type: 'boolean', description: 'you fetched every source URL yourself and saw the page' },
          confirmed: { type: 'boolean', description: 'the number, its range and its status are supported by the fetched source exactly as stated' },
          problems: { type: 'array', items: { type: 'string' } },
          corrected: { type: 'object', description: 'the fact as it should be, same schema as the researcher used, if any field needs correcting; else empty object' },
        },
        required: ['key', 'fetched', 'confirmed', 'problems', 'corrected'],
      },
    },
  },
  required: ['verdicts'],
}

const NEED = `The Rex strength lab (/home/user/rex-strength-lab/rex-strength-lab) needs a few facts for its Throw tab: when something is thrown faster than 1% of light speed (about 3,000 km/s), the page will say it flies off in a straight line and where it goes. It needs, as research facts in the house format (see research/final-environment.json for examples; keys, category, label, status, value_si, unit_si, low_si, high_si, display, sources with exact URLs, notes, who_when):
1. The Sun's gravitational parameter GM_sun (the IAU 2015 Resolution B3 nominal value, 1.3271244e20 m^3/s^2) and the astronomical unit (IAU 2012 Resolution B2, exactly 149,597,870,700 m), so the page can derive the speed needed to escape the Sun from Earth's distance, sqrt(2 GM_sun / au) (about 42.1 km/s). Give that derived speed as a third fact with status 'derived' and the arithmetic in its notes.
2. The escape speed from the Milky Way at the Sun's position (for example Piffl et al. 2014, A&A 562, A91, from RAVE: 533 (+54, -41) km/s; or a later measurement such as Monari et al. 2018 or Deason et al. 2019). Record the range the literature gives and the value used, as the existing asteroid fact does (search research/ for 'chicxulub' to see that style).
Prefer primary sources: the IAU resolution PDFs on iau.org, the journal article pages (A&A, MNRAS, arXiv abstract pages are fine as the open copy). 'Sourced' means you fetched the page and saw the number on it; give the exact URL and quote the sentence or table cell that carries the number. If a page cannot be fetched, say so in gaps and do not mark the fact verified. Use WebFetch and WebSearch (load them with ToolSearch if needed). Do not edit any file in the repo.`

phase('Research')
const found = await agent(`${NEED}

Return the facts. Status 'official' for the IAU constants, 'reported' or 'verified' for a measured galactic escape speed (verified only if two independent measurements agree within their errors and you fetched both), 'derived' for the solar escape speed.`, { label: 'researcher', phase: 'Research', schema: FACTS })

phase('Skeptic')
const checked = await agent(`${NEED}

You are the skeptic. A researcher returned the facts below. For EVERY source URL in every fact, fetch it yourself (WebFetch) and check that the page carries the number, the range and the wording the fact claims, and that the status is right (official for the IAU constants; reported/verified for measurements; derived for arithmetic, which you must redo). Look for: wrong numbers, wrong units, a range the source does not give, a quote not on the page, a URL that does not resolve or is not the source named, a status stronger than the evidence. Default to confirmed=false if you could not fetch a source. Give a corrected fact where needed.

FACTS:
${JSON.stringify(found, null, 1)}`, { label: 'skeptic', phase: 'Skeptic', schema: VERDICTS })

return { found, checked }
