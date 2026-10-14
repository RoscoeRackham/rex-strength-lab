// main vs branch: full text of the bay for each state x tab
const { launch, url, settle, text } = require('./lib.js');
const fs = require('fs');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'], DUO = ['arm', 'wrestle', 'catch', 'collide'];
const STATES = JSON.parse(process.argv[2]);
(async () => {
  const br = await launch();
  const out = {};
  for (const [file, tag] of [['main.html', 'main'], ['branch.html', 'branch']]) {
    const page = await br.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(url(file));
    for (const [si, st] of STATES.entries()) for (const tab of SOLO.concat(DUO)) {
      const duo = DUO.includes(tab);
      const s = Object.assign({}, st, tag === 'main' ? (duo ? { group: 'duo', duoAction: tab } : { group: 'solo', action: tab }) : (duo ? { duoOpen: true, duoAction: tab } : { action: tab }));
      await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), s);
      await page.reload(); await page.waitForTimeout(500);
      const id = tag === 'main' ? 'bay' : (duo ? 'duo-bay' : 'bay');
      const ok = await settle(page, id);
      out[tag + '|' + si + '|' + tab] = (ok ? '' : '[UNSETTLED] ') + await text(page, id);
    }
    if (errs.length) console.log(tag, 'errors', errs.slice(0, 3));
    await page.close();
  }
  fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
  let n = 0;
  for (const k of Object.keys(out)) if (k.startsWith('main|')) { const b = k.replace('main|', 'branch|'); if (out[k] !== out[b]) { n++; console.log('DIFF ' + k.slice(5)); } }
  console.log('diffs', n, 'of', Object.keys(out).length / 2);
  await br.close();
})();
