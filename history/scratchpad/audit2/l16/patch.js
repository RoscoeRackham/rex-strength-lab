const fs = require('fs');
let s = fs.readFileSync('/home/user/dino-strength-sim/dist/preview.html', 'utf8');
const rep = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error('match count ' + n + ' for ' + a.slice(0, 60)); s = s.replace(a, b); };
rep(`  let thCache = { key: null, list: null };
  function thresholds() {
    const key = JSON.stringify([state.mode, state.H, state.m, state.surface, state.anchor, state.groundHolds]);
    if (thCache.key === key) return thCache.list;
    const base = ctx();`,
`  const thCache = new Map(), STALE = {};
  let thJob = null;
  const thKey = () => JSON.stringify([state.mode, state.H, state.m, state.surface, state.anchor, state.groundHolds]);
  // Same log-space bisection as P.threshold, but yields to the browser every ~30 ms so a
  // settings change never freezes the page; a newer settings change cancels the run.
  async function thresholds(key) {
    thJob = key;
    const base = ctx();
    let slice = performance.now();`);
rep(`    const th = (pred) => P.threshold(pred, Math.pow(10, LMIN), Math.pow(10, LMAX));`,
`    const th = async (pred) => {
      let lo = Math.pow(10, LMIN), hi = Math.pow(10, LMAX);
      if (pred(lo)) return lo;
      if (!pred(hi)) return Infinity;
      while (hi / lo >= 1 + 1e-4) {
        if (performance.now() - slice > 30) { await new Promise((r) => setTimeout(r, 0)); slice = performance.now(); if (thJob !== key) throw STALE; }
        const mid = Math.sqrt(lo * hi);
        if (pred(mid)) hi = mid; else lo = mid;
      }
      return hi;
    };`);
for (const id of ['boom','windows','carmach3','jumpliberty','quake3','hiro','quake7','tsar','chix','earth']) {
  const re = new RegExp(`(\\{ id: '${id}', text: [^\\n]*?, kg: )th\\(`);
  if (!re.test(s)) throw new Error('no ' + id); s = s.replace(re, '$1await th(');
}
rep(`jl.withRigid = th(jumpPred({ groundHolds: true }));
    thCache = { key, list };
    return list;`, `jl.withRigid = await th(jumpPred({ groundHolds: true }));
    return list;`);
rep(`  function renderLadder() {
    const wrap = $('#ladder-viz');`, `  function renderLadder() {
    const key = thKey(), th = thCache.get(key);
    if (!th) {
      if (thJob !== key) thresholds(key).then((list) => { thCache.set(key, list); if (thJob === key) { thJob = null; renderLadder(); } }, (e) => { if (e !== STALE) console.error(e); });
      return;
    }
    const wrap = $('#ladder-viz');`);
rep(`    const th = thresholds();\n`, ``);
fs.writeFileSync(process.argv[2], s);
console.log('ok');
