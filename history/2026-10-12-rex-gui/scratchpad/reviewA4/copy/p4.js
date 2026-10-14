// For each solo tab, compare bay text with Rex bolted vs standing, over grounds and strengths and efforts
const { session } = require('./lib2');
const acts = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const grounds = ['concrete', 'sand', 'ice'];
const strengths = [Math.log10(100 * 907.18474), 8, 13];
(async () => {
  const s = await session();
  const res = [];
  for (const a of acts) for (const gnd of grounds) for (const L of strengths) for (const eff of ['least', 'allout']) {
    const out = {};
    for (const anchor of ['friction', 'bolted']) {
      await s.load({ action: a, surface: gnd, logKg: L, anchor });
      if (eff === 'allout') { const has = await s.page.$('#effort'); if (has) { await s.page.selectOption('#effort', 'allout'); await s.stable(); } }
      out[anchor] = await s.text('#bay');
    }
    const differ = out.friction !== out.bolted;
    const mentions = /bolt/i.test(out.bolted);
    res.push({ a, gnd, L, eff, differ, mentions });
    if (differ && !mentions) {
      console.log('=== DIFF WITHOUT MENTION', a, gnd, L, eff);
      const fl = out.friction.split('\n'), bl = out.bolted.split('\n');
      const fs = new Set(fl), bs = new Set(bl);
      console.log(' only standing:', fl.filter(x => !bs.has(x)).slice(0, 8));
      console.log(' only bolted  :', bl.filter(x => !fs.has(x)).slice(0, 8));
    }
  }
  const summary = {};
  for (const r of res) { const k = r.a; summary[k] = summary[k] || { cases: 0, differ: 0, differNoMention: 0 }; summary[k].cases++; if (r.differ) summary[k].differ++; if (r.differ && !r.mentions) summary[k].differNoMention++; }
  console.log(JSON.stringify(summary, null, 1));
  console.log('errs', s.errs);
  await s.browser.close();
})();
