// node dump.js <which> <label> '<json state>'  -> writes out/<which>-<label>-<tab>.txt for every tab
const { open, settle, S } = require('./lib');
const fs = require('fs');
const [which, label, js] = process.argv.slice(2);
const st = JSON.parse(js || '{}');
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
const DUO = ['arm', 'wrestle', 'catch', 'collide'];
fs.mkdirSync(S + '/out', { recursive: true });
(async () => {
  const tabs = (process.env.TABS || SOLO.concat(DUO).join(',')).split(',');
  for (const t of tabs) {
    const duo = DUO.includes(t);
    const s = Object.assign({}, st);
    if (duo) { s.duoAction = t; if (which === 'old') s.group = 'duo'; else s.duoOpen = true; }
    else { s.action = t; if (which === 'old') s.group = 'solo'; else s.duoOpen = false; }
    const { browser, page, errs } = await open(which, s, { wait: 800 });
    const sel = which === 'new' && duo ? '#duo-bay' : '#bay';
    await settle(page, sel, 30000);
    // open all inner details (Show the math etc.)
    await page.evaluate((sel) => { for (const d of document.querySelectorAll(sel + ' details')) d.open = true; }, sel);
    await page.waitForTimeout(200);
    const txt = await page.evaluate((sel) => document.querySelector(sel).innerText, sel);
    fs.writeFileSync(`${S}/out/${which}-${label}-${t}.txt`, txt + (errs.length ? '\nERRS: ' + errs.join('\n') : ''));
    await browser.close();
  }
})();
