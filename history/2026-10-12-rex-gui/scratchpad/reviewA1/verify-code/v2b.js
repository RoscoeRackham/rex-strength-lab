const { wrap, S } = require('./h.js');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names, delay }) => { window.__duoCalls = 0; let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => { for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; const t = performance.now(); while (performance.now() - t < delay) { } return f.apply(this, arguments); }; } v = x; } }); };
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [name, dir] of [['branch', 'lab'], ['B8-solo-kills-duo', 'labB8']]) {
    const url = wrap(S + '/' + dir + '/dist/index.html', name + '.html');
    const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await p.addInitScript(countDuoCalls, { names: DUO_FNS, delay: 60 });
    // click Rex's Jump tab from inside the page as soon as the duo placeholder shows
    await p.addInitScript(() => { const iv = setInterval(() => { const b = document.getElementById('duo-bay'); const s = localStorage.getItem('rex-lab-v1');
      if (b && s && JSON.parse(s).duoOpen && /working it out/i.test(b.textContent)) { window.__c0 = window.__duoCalls; document.getElementById('tab-jump').click(); clearInterval(iv); } }, 5); });
    await p.goto(url);
    await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'arm', action: 'throw' })));
    await p.reload(); await p.waitForTimeout(6000);
    const r = await p.evaluate(() => ({ c0: window.__c0, calls: window.__duoCalls, rexTab: document.querySelector('#tabs [aria-selected=true]').id, duoHead: (document.querySelector('#duo-bay .effort-read b') || {}).textContent }));
    console.log(name, JSON.stringify(r));
    await p.close();
  }
  await browser.close();
})();
