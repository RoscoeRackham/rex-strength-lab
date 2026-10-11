const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const L = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const mix = (fg, bg, a) => '#' + hex(fg).map((c, i) => Math.round((c * a + hex(bg)[i] * (1 - a)) * 255).toString(16).padStart(2, '0')).join('');
const T = {
  light: { bg: '#e9ece2', surface: '#f6f7f1', s2: '#dfe3d5', ink: '#161911', ink2: '#444a3a', ink3: '#626954', line: '#c9cebd', accent: '#b5650a', accentInk: '#7d4303', olive: '#4f5e22', good: '#0b7a0b', warn: '#c98500', goodInk: '#0a7a0a', warnInk: '#8a5c00', bad: '#d03b3b' },
  dark: { bg: '#11130d', surface: '#1a1d14', s2: '#252a1d', ink: '#eef0e6', ink2: '#c0c6b0', ink3: '#939a80', line: '#363c2b', accent: '#f0a23a', accentInk: '#f7c27a', olive: '#a9be6b', good: '#3fbf4f', warn: '#fab219', goodInk: '#3fbf4f', warnInk: '#fab219', bad: '#e66767' },
};
for (const [k, t] of Object.entries(T)) {
  const rows = [
    ['ink-3 on bg (eyebrow, start strip, footer, ladder sub? )', t.ink3, t.bg],
    ['ink-3 on surface (tile .k, field labels, hints)', t.ink3, t.surface],
    ['good-ink badge on surface (Verified)', t.goodInk, t.surface],
    ['warn-ink badge on surface (Claimed/Disputed)', t.warnInk, t.surface],
    ['olive badge on surface (Canon)', t.olive, t.surface],
    ['selected tab #000 on accent', '#000000', t.accent],
    ['run:hover #000 on accent', '#000000', t.accent],
    ['ladder axis ink-3 on bg', t.ink3, t.bg],
    ['ladder leader ink-3@0.6 on bg', mix(t.ink3, t.bg, 0.6), t.bg],
    ['chart grid/axis --line on surface', t.line, t.surface],
    ['ghost path ink-3 on surface', t.ink3, t.surface],
    ['meter track s2 on surface', t.s2, t.surface],
    ['meter good bar on surface', t.good, t.surface],
    ['meter good bar on track', t.good, t.s2],
    ['meter bad bar on surface', t.bad, t.surface],
    ['olive bar @0.75 on surface', mix(t.olive, t.surface, 0.75), t.surface],
    ['accent bar on surface', t.accent, t.surface],
    ['tip surface-on-ink', t.surface, t.ink],
    ['chip border --line on surface', t.line, t.surface],
    ['status warn icon on surface', t.warn, t.surface],
    ['viz text ink-2 on surface', t.ink2, t.surface],
    ['accent-ink link on surface', t.accentInk, t.surface],
    ['accent-ink link on bg', t.accentInk, t.bg],
    ['ink-3 sub text ladder on bg', t.ink3, t.bg],
    ['bad text (none)', t.bad, t.surface],
    ['accent (now? ) on bg', t.accent, t.bg],
    ['olive dot on bg', t.olive, t.bg],
  ];
  console.log('== ' + k);
  for (const [n, a, b] of rows) console.log(cr(a, b).toFixed(2).padStart(6), n, a, b);
}
