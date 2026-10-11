'use strict';
const src = require('fs').readFileSync('/home/user/rex-strength-lab/build-comparison/src/app.html', 'utf8');
function tokens(block) { const o = {}; block.replace(/--([\w-]+):\s*(#[0-9A-Fa-f]{6}|rgba\([^)]*\))/g, (m, k, v) => { o[k] = v; }); return o; }
const light = tokens(src.slice(src.indexOf(':root {'), src.indexOf('@media (prefers-color-scheme: dark)')));
const dark = Object.assign({}, light, tokens(src.slice(src.indexOf(':root[data-theme="dark"]'), src.indexOf('* { box-sizing'))));
function rgb(h) { return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); }
function parse(v, T) { if (v.startsWith('#')) return { c: rgb(v), a: 1 }; const m = v.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/); return { c: [+m[1], +m[2], +m[3]], a: +m[4] }; }
function over(fg, bg) { return fg.c.map((x, i) => x * fg.a + bg[i] * (1 - fg.a)); }
function L(c) { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); }
function ratio(a, b) { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
function col(T, spec) { // "chalk-band/sheet" composite
  const parts = spec.split('/'); let base = parse(T[parts[parts.length - 1]], T).c;
  for (let i = parts.length - 2; i >= 0; i--) base = over(parse(T[parts[i]], T), base);
  return base;
}
const pairs = [
  // [fg, bg, need, where]
  ['ink-3', 'paper', 4.5, '.spec, .jumps, .eyebrow on paper'],
  ['ink-3', 'sheet', 4.5, 'forest .h, .off, tool .viewcaps, .tbl th'],
  ['ink-3', 'floor', 4.5, 'plate .f FFMI line (11px) on floor'],
  ['ink-3', 'wall', 3, 'gap tile .lab 22px bold (large) on wall'],
  ['ink-2', 'floor', 4.5, 'plate .w, gap .end on floor'],
  ['ink-2', 'wall', 4.5, 'n/a'],
  ['ink-2', 'paper', 4.5, 'subs on paper'],
  ['ink-2', 'rule-2', 4.5, 'forest row hover ink-2 (anchor names)'],
  ['chalk', 'wall', 4.5, 'gap tile .post labels (11px 600)'],
  ['chalk', 'paper', 4.5, 'links on paper'],
  ['chalk', 'sheet', 4.5, 'limit row names, gutter labels'],
  ['chalk', 'chalk-band/paper', 4.5, '.limitnote b on chalk band over paper'],
  ['chalk', 'chalk-bg', 4.5, '.formula? (ink on chalk-bg)'],
  ['ink', 'chalk-bg', 4.5, '.formula text'],
  ['alarm', 'wall', 4.5, 'gap tile .mark labels'],
  ['alarm', 'floor', 4.5, 'plate .flag (11.5px) on floor'],
  ['alarm', 'sheet', 4.5, 'forest .x, plate flag on hover/expanded, drawer'],
  ['alarm', 'alarm-bg', 4.5, 'chip.over'],
  ['alarm', 'paper', 4.5, 'rule-end text'],
  ['sheet', 'alarm', 4.5, 'chip.fail'],
  ['tape-ink', 'tape', 4.5, 'tape labels and .tag'],
  ['sheet', 'ink', 4.5, 'pressed seg buttons'],
  ['ink-2', 'sheet', 4.5, 'seg buttons unpressed'],
  // marks 3:1
  ['g-every', 'wall', 3, 'figure fill vs wall (head/hands/feet have no edge)'],
  ['g-natural', 'wall', 3, 'figure fill vs wall'],
  ['g-bb', 'wall', 3, 'figure fill vs wall'],
  ['g-strong', 'wall', 3, 'figure fill vs wall'],
  ['g-comic', 'wall', 3, 'figure fill vs wall'],
  ['g-duo', 'wall', 3, 'figure fill vs wall'],
  ['g-geom', 'wall', 3, 'limit-card template figures: grey fill on wall, no outline'],
  ['g-every', 'paper', 3, 'glance/locator ticks on paper'],
  ['g-natural', 'paper', 3, 'glance/locator ticks on paper'],
  ['g-bb', 'paper', 3, 'ticks'],
  ['g-strong', 'paper', 3, 'ticks'],
  ['g-comic', 'paper', 3, 'ticks'],
  ['g-duo', 'paper', 3, 'ticks'],
  ['g-every', 'sheet', 3, 'forest bars on sheet'],
  ['g-natural', 'sheet', 3, 'forest bars on sheet'],
  ['g-bb', 'sheet', 3, 'forest bars'],
  ['g-strong', 'sheet', 3, 'forest bars'],
  ['g-comic', 'sheet', 3, 'forest bars'],
  ['g-duo', 'sheet', 3, 'forest bars'],
  ['void', 'void-bg', 3, 'hatch lines vs hatch bg'],
  ['chalk', 'tape', 3, 'locator window border over tape'],
  ['wall-line', 'wall', 3, 'landmark lines on wall (decorative?)'],
  ['ink', 'g-strong', 3, 'figure edge (ink) vs strongman fill'],
  ['ink', 'g-comic', 3, 'edge vs comic fill'],
  ['ink', 'g-every', 3, 'edge vs everyday fill'],
  ['ink', 'g-duo', 3, 'edge vs duo fill'],
  ['ink', 'wall', 3, 'edge vs wall'],
];
for (const [name, T] of [['light', light], ['dark', dark]]) {
  console.log('== ' + name);
  for (const [fg, bg, need, where] of pairs) {
    const r = ratio(col(T, fg), col(T, bg));
    if (r < need) console.log('FAIL ' + r.toFixed(2) + ' < ' + need + '  ' + fg + ' on ' + bg + '  (' + where + ')');
    else console.log('ok   ' + r.toFixed(2) + '  ' + fg + ' on ' + bg);
  }
}
