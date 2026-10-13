const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const S = __dirname;
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const page_ = path.join(S, 'page.html');
fs.writeFileSync(page_, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
async function run(saved, fn) {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto('file://' + page_);
  await p.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), saved);
  await p.reload();
  await p.waitForTimeout(500);
  // wait for duo to finish
  for (let i = 0; i < 120; i++) { const t = await p.evaluate(() => (document.querySelector('#duo') || {}).innerText || ''); if (!/working it out/i.test(t)) break; await p.waitForTimeout(500); }
  const r = await fn(p);
  await b.close();
  return r;
}
(async () => {
  const mode = process.argv[2];
  if (mode === 'b1') {
    for (const gh of [false, true]) {
      const r = await run({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push', anchor: 'bolted', oAnchor: 'bolted', logKg: 9, groundHolds: gh }, async (p) => p.evaluate(() => {
        const duo = document.querySelector('#duo');
        const v = duo.querySelector('.verdict, [class*=verdict]');
        const chips = [...duo.querySelectorAll('.chip.status, .status')].map((c) => c.innerText.trim()).filter(Boolean);
        return { verdict: v ? v.innerText : null, chips, tear: /tear/i.test(duo.innerText) ? duo.innerText.split('\n').filter((l) => /tear/i.test(l)) : [] };
      }));
      console.log('groundHolds=' + gh, JSON.stringify(r, null, 1));
    }
    const card = await run({}, async (p) => p.evaluate(() => {
      const all = document.body.innerText.split('\n');
      return all.filter((l) => /Newton’s third law stays on|“Comic ground” removes|Every push pushes him back/.test(l) || /These switches never absorb momentum/.test(l) || /^On, his feet are fixed/.test(l));
    }));
    console.log(card.join('\n---\n'));
  }
  if (mode === 'b3') {
    const r = await run({ anchor: 'bolted', action: 'sprint', duoOpen: true, duoAction: 'wrestle', wrestleMove: 'push' }, async (p) => p.evaluate(() => {
      const t = document.body.innerText.split('\n');
      return t.filter((l) => /Bolted to the planet, his feet|Top speed|can’t walk Ollie|Walking drive is friction|he can’t step/.test(l));
    }));
    console.log(r.join('\n---\n'));
  }
})();
