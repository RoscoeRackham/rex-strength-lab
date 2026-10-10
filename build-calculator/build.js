// Builds dist/index.html: src/app.html with the data and src/calc.js inlined.
// Run: node build.js
'use strict';
const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'src', 'app.html'), 'utf8');
const calc = fs.readFileSync(path.join(root, 'src', 'calc.js'), 'utf8');
const data = JSON.parse(fs.readFileSync(path.join(root, 'data', 'builds.json'), 'utf8'));

// Keep what the page shows. Drop the correction log (it is in NOTES.md and builds.json),
// the verifier's long free text, and local file paths that mean nothing to a reader.
const slim = JSON.parse(JSON.stringify(data));
delete slim.corrections_applied;
delete slim.meta.inputs;
for (const f of Object.values(slim.facts)) {
  if (f.verify) f.verify = { ok: f.verify.ok, applied: f.verify.applied || [] };
}
function stripFiles(o) {
  if (Array.isArray(o)) { o.forEach(stripFiles); return; }
  if (o && typeof o === 'object') {
    if (typeof o.file === 'string' && o.title && !o.url) o.file = path.basename(o.file);
    Object.values(o).forEach(stripFiles);
  }
}
stripFiles(slim);

// Safe inside a <script> element.
const LS = String.fromCharCode(0x2028), PS = String.fromCharCode(0x2029);
const json = JSON.stringify(slim).replace(/</g, '\\u003c').split(LS).join('\\u2028').split(PS).join('\\u2029');
const calcSafe = calc.replace(/<\/script/gi, '<\\/script');

if (!html.includes('<!--@DATA-->') || !html.includes('<!--@CALC-->')) throw new Error('placeholders missing in src/app.html');
const out = html
  .replace('<!--@DATA-->', () => '<script>window.BUILD_DATA = ' + json + ';</script>')
  .replace('<!--@CALC-->', () => '<script>\n' + calcSafe + '\n</script>');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), out);
console.log('dist/index.html ' + (out.length / 1024).toFixed(0) + ' KB (' + data.builds.length + ' builds, ' + Object.keys(data.facts).length + ' facts)');
