// Build patched copies of the branch's dist: fix2 = ux-2's proposed JS fix; fix123 = all three fixes
const fs = require('fs');
const src = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
function rep(s, a, b) { if (s.split(a).length !== 2) throw new Error('not unique: ' + a); return s.replace(a, b); }
let f2 = src;
f2 = rep(f2, "const box = aside.getBoundingClientRect(), scrolls = aside.scrollHeight - aside.clientHeight > 4;",
  "const own = cue.hidden ? 0 : cue.offsetHeight + 12 - 16, sh = aside.scrollHeight - own;\n      const box = aside.getBoundingClientRect(), scrolls = sh - aside.clientHeight > 4;");
f2 = rep(f2, "const more = scrolls && aside.scrollHeight - aside.clientHeight - aside.scrollTop > 4;",
  "const more = scrolls && sh - aside.clientHeight - aside.scrollTop > 4;");
f2 = rep(f2, "    window.addEventListener('scroll', upd, { passive: true });",
  "    window.addEventListener('scroll', upd, { passive: true });\n    try { const ro = new ResizeObserver(upd); for (const c of aside.children) if (c !== cue) ro.observe(c); } catch (e) { /* ignore */ }");
fs.writeFileSync(__dirname + '/dist-fix2.html', f2);
let f3 = rep(f2, '</style>', '@media (min-width: 920px) { .panel-controls { scroll-padding-bottom: 60px; } }\n@media (forced-colors: active) { .more-below:not([hidden]) { background: Canvas; border-top: 1px solid CanvasText; } }\n</style>');
fs.writeFileSync(__dirname + '/dist-fix123.html', f3);
console.log('ok');
