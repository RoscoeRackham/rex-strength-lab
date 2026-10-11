// Builds dist/index.html: src/app.html with the data and the scripts inlined.
// Run from build-comparison/: node build.js
// Inputs: ../build-calculator/data/builds.json and src/calc.js (shared with the Build Calculator),
// data/*.json, src/model.js, src/figure.js, src/measure.js, and rex-strength-lab/assets/duo.jpg
// (for the measuring tool's validation example).
'use strict';
const fs = require('fs');
const path = require('path');

const root = __dirname;
const rd = (...p) => fs.readFileSync(path.join(root, ...p), 'utf8');
const json = (...p) => JSON.parse(rd(...p));

const html = rd('src', 'app.html');
const builds = json('..', 'build-calculator', 'data', 'builds.json');
// The chart's data: settings (body-fat classes, per-build choices, anchors, page text), research
// facts, and the functional limits computed by tools/compute_limits.js.
const settings = json('data', 'settings.json');
const facts = fs.existsSync(path.join(root, 'data', 'facts.json')) ? json('data', 'facts.json').facts : {};
const limits = fs.existsSync(path.join(root, 'data', 'limits.json')) ? json('data', 'limits.json') : null;
// Facts as the page shows them: label, status, sources with a URL, and a short summary.
const factsSlim = {};
for (const [k, f] of Object.entries(facts)) {
  factsSlim[k] = { label: f.label, status: f.status, topic: f.topic, sources: (f.sources || []).filter((s) => s.url && /^https?:/.test(s.url)), summary: f.summary || null };
}
const comparison = Object.assign({}, settings, { facts: factsSlim, limits });
const outline = json('data', 'outline.json');
const duo = json('data', 'duo-outlines.json');
const validation = json('data', 'duo-validation.json');
const duoJpg = fs.readFileSync(path.join(root, '..', 'rex-strength-lab', 'assets', 'duo.jpg'));

// The Build Calculator's data, slimmed as its own build.js does: no correction log, no verifier
// free text, no local file paths.
const slim = JSON.parse(JSON.stringify(builds));
delete slim.corrections_applied;
delete slim.meta.inputs;
for (const f of Object.values(slim.facts)) if (f.verify) f.verify = { ok: f.verify.ok, applied: f.verify.applied || [] };
(function stripFiles(o) {
  if (Array.isArray(o)) { o.forEach(stripFiles); return; }
  if (o && typeof o === 'object') {
    if (typeof o.file === 'string' && o.title && !o.url) o.file = path.basename(o.file);
    Object.values(o).forEach(stripFiles);
  }
})(slim);
// Only the outline numbers the page draws with.
const outlineSlim = { levels: {}, lengths: {}, girths: {}, sections: outline.sections, fits: outline.fits, ratios: {}, n: outline.n, source: outline.source };
for (const g of ['levels', 'lengths', 'girths', 'ratios']) for (const [k, v] of Object.entries(outline[g])) outlineSlim[g][k] = { mean: v.mean, sd: v.sd };

const data = {
  builds: slim, comparison, outline: outlineSlim, duo, validation,
  duoImage: 'data:image/jpeg;base64,' + duoJpg.toString('base64'),
};
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
const safe = (s) => s.replace(/</g, '\\u003c').split(LS).join('\\u2028').split(PS).join('\\u2029');
const script = (file) => '<script>\n' + rd(...file).replace(/<\/script/gi, '<\\/script') + '\n</script>';

const marks = ['<!--@DATA-->', '<!--@SCRIPTS-->'];
for (const m of marks) if (!html.includes(m)) throw new Error('placeholder ' + m + ' missing in src/app.html');
const out = html
  .replace('<!--@DATA-->', () => '<script>window.COMPARE_DATA = ' + safe(JSON.stringify(data)) + ';</script>')
  .replace('<!--@SCRIPTS-->', () => [
    script(['..', 'build-calculator', 'src', 'calc.js']), script(['src', 'model.js']), script(['src', 'figure.js']), script(['src', 'measure.js']),
  ].join('\n'));

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), out);
console.log('dist/index.html ' + (out.length / 1024).toFixed(0) + ' KB (' + Object.keys(comparison.builds).length + ' builds on the chart, ' + Object.keys(factsSlim).length + ' facts' + (limits ? ', ' + limits.items.length + ' limits' : ', no limits yet') + ')');
