const H = require('./h.js');
const run = async (st, label) => {
  const p = await H.open(Object.assign({ group: 'duo', duoAction: 'catch' }, st));
  await H.tab(p, 'catch', true);
  await p.waitForTimeout(1500);
  for (let i = 0; i < 60; i++) { const t = await H.text(p); if (!/working it out|Working out/.test(t)) break; await p.waitForTimeout(500); }
  const t = await H.text(p);
  const L = t.split('\n');
  console.log('=====', label);
  L.forEach((l, i) => { if (/Hits his palms|Hits Ollie|Hits Rex/.test(l)) console.log(L.slice(i, i + 3).join(' | ')); });
  console.log(L.filter((l) => /Effort|All-out|ceiling|At this effort|punch into|press .* into|gives way|g on the person|amusement|ride/.test(l)).slice(0, 14).join('\n'));
  await p.close();
};
(async () => {
  await run({ cObj: 'person', cLogD: 2, cStyle: 'easy' }, 'person easy 100 m');
  await run({ cObj: 'car', cLogD: 1, cStyle: 'hard' }, 'car hard 10 m');
  await H.close();
})();
